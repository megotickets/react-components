import { useBuyTicketContext } from "@/context/BuyTicketContext";
import { Stepper } from "@/interfaces/interface-stepper";
import { PopupModality } from "@/interfaces/popup-enum";
import { checkPayment, checkUserBalance, getDecimals, getPayment, resolveProcessor, switchNetwork } from "@/utils/BuyTicketUtils";
import { Loader, switchChain, useAccount, createWalletClient, config, waitForTransactionReceipt } from "@megotickets/core";
import { useEffect, useState } from "react";
import { useSendTransaction, ethers, useWaitForTransactionReceipt, writeContract } from "@megotickets/core";
import { erc20ABI } from "@/contracts/ABIErc20";

const BuyTicketWithCrypto = () => {

    const { eventDetails, paymentsDetails, openPopup, setStepper, processor, resetPaymentProcessing } = useBuyTicketContext();
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState("");
    const { address } = useAccount();
    const { data: hash, error, isPending, sendTransaction } = useSendTransaction()
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

    let count = 0;

    const waitBackendConfirmationOfPayment = async () => {
        try {
            setMessage("Attendere la conferma del pagamento...")
            const uuid = paymentsDetails?.payment?.paymentId;
            if (uuid) {
                setMessage("Ottenimento dei dettagli del pagamento...")
                const payment = await getPayment(uuid);
                console.log('payment', payment);
                if (payment.error == false) {
                    console.log("Dati del pagamento ritrovati! .. check dello stato del pagamento")
                    //Check if payment is completed
                    const interval = setInterval(async () => {
                        console.log('checkPayment with uuid:', uuid);
                        const result = await checkPayment(uuid);
                        console.log('checkPayment:', result);
                        if (result.error == false) {
                            clearInterval(interval);
                            setStepper(Stepper.NFT_Mint);
                        } else {
                            console.log("Ancora error = false")
                        }
                    }, 5000);
                } else {
                    openPopup({
                        title: 'Errore',
                        message: `Errore nell'attesa della conferma del pagamento: ${payment.message || 'Errore sconosciuto'}`,
                        modality: PopupModality.Error,
                        isOpen: true
                    });
                    resetPaymentProcessing()
                    setIsProcessing(false);
                }
            } else {
                console.log("uuid non trovato")
                openPopup({
                    title: 'Errore',
                    message: `Errore nell'attesa della conferma del pagamento: uuid non trovato`,
                    modality: PopupModality.Error,
                    isOpen: true
                });
                resetPaymentProcessing()
                setIsProcessing(false);
            }
        } catch (error: any) {
            console.error("Errore nell'attesa della conferma del pagamento:", error);
            openPopup({ title: 'Errore', message: `Errore nell'attesa della conferma del pagamento: ${error.message || 'Errore sconosciuto'}`, modality: PopupModality.Error, isOpen: true });
            resetPaymentProcessing()
            setIsProcessing(false);
        } finally {
            localStorage.removeItem("_func");
        }
    };

    // Funzione per pagare con token ERC20
    const payWithErc20 = async (chainId: number) => {
        try {
            const contract_address = processor?.split(":")[2];
            if (!contract_address) {
                openPopup({ title: 'Errore', message: 'Impossibile prelevare il contract address del token erc20', modality: PopupModality.Error, isOpen: true });
                resetPaymentProcessing();
                setIsProcessing(false);
                return;
            }
            const decimals = getDecimals(contract_address);
            const amount = ethers.parseUnits(
                paymentsDetails?.payment?.amount.toString(),
                decimals
            );
            const tx = await writeContract(config, {
                //@ts-ignore
                chainId: chainId,
                address: contract_address as `0x${string}`,
                abi: erc20ABI,
                functionName: "transfer",
                args: [paymentsDetails?.payment?.payment_intent, amount],
                account: address,
            });
            console.log('tx', tx);
            setMessage("Waiting for transaction confirmation...");
            const transactionReceipt = await waitForTransactionReceipt(config, { 
                hash: tx, 
                //@ts-ignore
                chainId: chainId 
            });
            console.log('transactionReceipt', transactionReceipt);
            setMessage("Transaction confirmed!");
            waitBackendConfirmationOfPayment();
        } catch (error: any) {
            console.error("Errore nel pagamento con token ERC20:", error);
            openPopup({ title: 'Errore', message: `Errore nel pagamento con token ERC20`, modality: PopupModality.Error, isOpen: true });
            resetPaymentProcessing();
            setIsProcessing(false);
        }
    };

    // Funzione per pagare con criptovalute native (ETH, MATIC, ecc.)
    const payWithNativeCrypto = async () => {
        // Opening metamask modal for payment
        setMessage("Please confirm the operation in your wallet...");
        const to = paymentsDetails?.payment?.payment_intent;
        const value = ethers.parseEther(paymentsDetails?.payment?.amount.toString());
        // Invia la transazione
        sendTransaction({ to, value });
    };

    const payWithCrypto = async () => {
        if (!address) {
            openPopup({ title: 'Errore', message: 'Please connect your wallet', modality: PopupModality.Error, isOpen: true });
            return;
        }
        setIsProcessing(true);
        setMessage("Processing payment...");
        await new Promise(resolve => setTimeout(resolve, 1000));

        //Check user has enough balance
        const { balance, formattedBalance, success, reason } = await checkUserBalance(address, processor);
        if (!success) {
            openPopup({ title: 'Errore', message: reason || 'Errore sconosciuto', modality: PopupModality.Error, isOpen: true });
            return;
        }

        //Switch to the correct network
        const chainId = resolveProcessor(processor || "");
        if (chainId == -1) {
            openPopup({ title: 'Errore', message: `Impossibile passare alla rete ${processor}`, modality: PopupModality.Error, isOpen: true });
            resetPaymentProcessing();
            setIsProcessing(false);
            return;
        }
        const networkChanged = await switchNetwork(chainId);
        if (!networkChanged) {
            openPopup({ title: 'Errore', message: `Impossibile passare alla rete ${processor}`, modality: PopupModality.Error, isOpen: true });
            resetPaymentProcessing();
            setIsProcessing(false);
            return;
        }

        // Controlla se si tratta di un token ERC20 o di una criptovaluta nativa
        if (processor?.includes('erc20:')) {
            await payWithErc20(chainId);
        } else {
            await payWithNativeCrypto();
        }
    }

    //await hash
    useEffect(() => {
        if (isConfirming) {
            setMessage("Transaction is being confirmed...");
        }
        if (isConfirmed) {
            setMessage("Transaction confirmed!");
            waitBackendConfirmationOfPayment();
        }
        if (error) {
            setMessage("Transaction failed!");
            openPopup({ title: 'Errore', message: error.message || 'Errore sconosciuto', modality: PopupModality.Error, isOpen: true });
            resetPaymentProcessing()
            setIsProcessing(false);
        }
    }, [hash, isConfirming, isConfirmed, error]);

    useEffect(() => {
        if (count == 0) {
            payWithCrypto();
            count++;
        }
    }, []);


    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            {
                isProcessing &&
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                    <Loader message={message} />
                </div>
            }
        </div>
    )
}

export default BuyTicketWithCrypto;