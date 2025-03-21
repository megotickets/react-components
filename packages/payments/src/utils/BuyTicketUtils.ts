
import axios from 'axios';
const baseUrl = 'https://tickets-api.mego.tools'
//const baseUrl = 'https://tickets-api-dev.mego.tools'

/**
 * Ask for payment details
 * @param processor - The processor to use
 * @param amount - The amount to pay
 * @param identifier - The identifier of the payment
 * @param address - The address of the payment
 * @param discount_code - The discount code of the payment
 * @param currency - The currency of the payment
 * @param email - The email of the payment
 * @param donation_amount - The donation amount of the payment
 */
const askPaymentDetails = async (processor: string, amount: number, identifier: string, address: string, discount_code: number, currency: string, email: string, donation_amount: number) => {
    try {
        const response = await axios.post(`${baseUrl}/payments`, {
            processor,
            amount,
            identifier,
            address,
            discount_code,
            currency,
            email,
            donation_amount
        })
        return response.data
    } catch (error) {
        console.error('Errore nel richiedere i dettagli del pagamento:', error);
        throw error;
    }
}

const getPayment = async (paymentId: string) => {
    try{
        const response = await axios.get(`${baseUrl}/payments/${paymentId}`)
        return response.data
    }catch(error){
        console.error('Errore nel ottenere il pagamento:', error);
        throw error;
    }
}

const checkPayment = async (paymentId: string) => {
    try{
        const response = await axios.post(`${baseUrl}/payments/check`, {
            payment_id: paymentId
        })
        return response.data
    }catch(error){
        console.error('Errore nel controllare il pagamento:', error);
        throw error;
    }
}
/**
 * Check if the NFT is already minted
 * @param identifier - The identifier of the payment
 * @param walletAddress - The wallet address where find the NFT
 */
const checkNFT = async (identifier: string, walletAddress: string) => {
    try {
        const response = await axios.get(`${baseUrl}/nfts/last/${identifier}/${walletAddress}`)
        return response.data
    } catch (error) {
        console.error('Errore nel controllare l\'NFT:', error);
        throw error;
    }
}

/**
 * Mint the NFT
 * @param paymentId - The payment id
 */
const mintNFT = async (paymentId: string) => {
    try {
        const response = await axios.post(`${baseUrl}/nfts/mint`, {
            payment_id: paymentId
        })
        return response.data
    } catch (error) {
        console.error('Errore nel minta l\'NFT:', error);
        throw error;
    }
}

/**
 * Create a claim (and data for qrcode, apple wallet, google wallet)
 * @param signature - The signature of the claim
 * @param tokenId - The token id of the claim
 * @param email - The email of the claim
 * @param tier - The tier of the claim
 * @param address - The address of the claim
 * @param challenge - The challenge of the claim
 * @param acceptNotification - The accept notification of the claim
 * @param claim_metadata - The claim metadata of the claim
 */
const createClaim = async (signature: string, tokenId: string, email: string, tier: string, address: string, challenge: string, acceptNotification: boolean, claim_metadata: Array<any>) => {
    try {
        const response = await axios.post(`${baseUrl}/claims/create`, {
            signature,
            tokenId,
            email,
            tier,
            address,
            challenge,
            acceptNotification,
            claim_metadata
        })
        return response.data
    }catch (error) {
        console.error('Errore nel creare la richiesta:', error);
        throw error;
    }
}

/**
 * Get event details
 * @param identifier - The identifier of the event
 */
export const getEventDetails = async (identifier: string) => {
    try {
        const response = await axios.get(`${baseUrl}/events/get/${identifier}`)
        return response.data
    } catch (error) {
        console.error('Errore nel ottenere i dettagli dell\'evento:', error);
        throw error;
    }
}

/**
 * Save the mego pending claim processing
 * @param tokenId - The token id of the claim
 * @param emailOfBuyer - The email of the buyer
 * @param identifier - The identifier of the claim
 * @param userAddress - The user address of the claim
 * @param message - The message of the claim
 * @param claim_metadata - The claim metadata of the claim
 */
const saveMegoPendingClaimProcessing = async (tokenId: string, emailOfBuyer: string, identifier:string, userAddress:string, message:string, claim_metadata:Array<any>) => {
    try{
        //Local storage
        localStorage.setItem("MP_func", "claim_processing");
        localStorage.setItem("MP_tokenId", tokenId);
        localStorage.setItem("MP_emailOfBuyer", emailOfBuyer);
        localStorage.setItem("MP_identifier", identifier);
        localStorage.setItem("MP_userAddress", userAddress);
        localStorage.setItem("MP_message", message);
        localStorage.setItem("MP_claim_metadata", JSON.stringify(claim_metadata));
    }catch(error){
        console.error('Errore nel salvare la richiesta:', error);
        throw error;
    }
}

/**
 * Clean the mego pending claim processing
 */
const cleanMegoPendingClaimProcessing = async () => {
    try{
        localStorage.removeItem("MP_func")
        localStorage.removeItem("MP_tokenId")
        localStorage.removeItem("MP_emailOfBuyer")
        localStorage.removeItem("MP_identifier")
        localStorage.removeItem("MP_userAddress")
        localStorage.removeItem("MP_message")
        localStorage.removeItem("MP_claim_metadata")
    }catch(error){
        console.error('Errore nel pulire la richiesta:', error);
        throw error;
    }
}

/**
 * Get the data of the pending claim processing
 */
const getMegoPendingClaimProcessingData = async () => {
    try{
        return {
            func: localStorage.getItem("MP_func"),
            tokenId: localStorage.getItem("MP_tokenId"),
            emailOfBuyer: localStorage.getItem("MP_emailOfBuyer"),
            identifier: localStorage.getItem("MP_identifier"),
            userAddress: localStorage.getItem("MP_userAddress"),
            message: localStorage.getItem("MP_message"),
            claim_metadata: JSON.parse(localStorage.getItem("MP_claim_metadata") || "[]")
        }
    }catch(error){
        console.error('Errore nel ottenere i dati della richiesta:', error);
        throw error;
    }
}


export { 
    askPaymentDetails, checkNFT, mintNFT, createClaim, saveMegoPendingClaimProcessing, getMegoPendingClaimProcessingData, cleanMegoPendingClaimProcessing, getPayment, checkPayment
}

