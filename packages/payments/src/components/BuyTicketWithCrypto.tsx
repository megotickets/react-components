import { useBuyTicketContext } from "@/context/BuyTicketContext";
import { Stepper } from "@/interfaces/interface-stepper";
import { PopupModality } from "@/interfaces/popup-enum";
import { checkPayment, checkUserBalance, getDecimals, getPayment, resolveProcessor, switchNetwork } from "@/utils/BuyTicketUtils";
import { Loader, switchChain, useAccount, createWalletClient, config, waitForTransactionReceipt } from "@megotickets/core";
import { useEffect, useState } from "react";
import { useSendTransaction, ethers, useWaitForTransactionReceipt, writeContract } from "@megotickets/core";
import { erc20ABI } from "@/contracts/ABIErc20";
import "../css/pay.css";
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
            setMessage("Waiting for payment confirmation...")
            const uuid = paymentsDetails?.payment?.paymentId;
            if (uuid) {
                setMessage("Getting payment details...")
                const payment = await getPayment(uuid);
                console.log('payment', payment);
                if (payment.error == false) {
                    console.log("Payment details found! .. check payment status")
                    //Check if payment is completed
                    const interval = setInterval(async () => {
                        console.log('checkPayment with uuid:', uuid);
                        const result = await checkPayment(uuid);
                        console.log('checkPayment:', result);
                        if (result.error == false) {
                            clearInterval(interval);
                            setStepper(Stepper.NFT_Mint);
                        } else {
                            console.log("Still error = false")
                        }
                    }, 5000);
                } else {
                    openPopup({
                        title: 'Error',
                        message: `Error waiting for payment confirmation: ${payment.message || 'Unknown error'}`,
                        modality: PopupModality.Error,
                        isOpen: true
                    });
                    resetPaymentProcessing()
                    setIsProcessing(false);
                }
            } else {
                console.log("uuid non trovato")
                openPopup({
                    title: 'Error',
                    message: `Error waiting for payment confirmation: uuid not found`,
                    modality: PopupModality.Error,
                    isOpen: true
                });
                resetPaymentProcessing()
                setIsProcessing(false);
            }
        } catch (error: any) {
            console.error("Error waiting for payment confirmation:", error);
            openPopup({ title: 'Error', message: `Error waiting for payment confirmation: ${error.message || 'Unknown error'}`, modality: PopupModality.Error, isOpen: true });
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
                openPopup({ title: 'Error', message: 'Unable to retrieve the erc20 token contract address', modality: PopupModality.Error, isOpen: true });
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
            console.error("Error in payment with erc20 token:", error);
            openPopup({ title: 'Error', message: `Error in payment with erc20 token`, modality: PopupModality.Error, isOpen: true });
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
            openPopup({ title: 'Error', message: 'Please connect your wallet', modality: PopupModality.Error, isOpen: true });
            return;
        }
        setIsProcessing(true);
        setMessage("Processing payment...");
        await new Promise(resolve => setTimeout(resolve, 1000));

        //Check user has enough balance
        const { balance, formattedBalance, success, reason } = await checkUserBalance(address, processor);
        if (!success) {
            openPopup({ title: 'Error', message: reason || 'Unknown error', modality: PopupModality.Error, isOpen: true });
            return;
        }

        //Switch to the correct network
        const chainId = resolveProcessor(processor || "");
        if (chainId == -1) {
            openPopup({ title: 'Error', message: `Unable to switch to the network ${processor}`, modality: PopupModality.Error, isOpen: true });
            resetPaymentProcessing();
            setIsProcessing(false);
            return;
        }
        const networkChanged = await switchNetwork(chainId);
        if (!networkChanged) {
            openPopup({ title: 'Error', message: `Unable to switch to the network ${processor}`, modality: PopupModality.Error, isOpen: true });
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
            openPopup({ title: 'Error', message: error.message || 'Unknown error', modality: PopupModality.Error, isOpen: true });
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
        <div className="payment-stepper-container">
            {
                isProcessing &&
                <div className="loader">
                    <Loader message={message} />
                </div>
            }
        </div>
    )
}

export default BuyTicketWithCrypto;