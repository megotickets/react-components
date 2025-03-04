
//Stepper enum docs
// 0: Form_data (information about the event)
// 1: Processing (processing the payment)
// 2: Information (if the payment is successful or not, or if there is an error)
// 3: Payments (payments step)
// 4: Claim (claim the ticket, google pay, apple pay, etc.)
export enum Stepper {
    "Form_data", 
    "Processing",
    "Information",
    "Payments",
    "Claim"
}
