import { UserType } from "src/modules/users/types";
import { ConfirmationMethod, CurrencyCode, PaymentMethodTypes } from "src/modules/payment/enums";

/** 
 * @note We dropped our internal camel case naming convention to
 * resort to the conventions and keys stripe payment intent accepts
 * */
export type PaymentData = {
    customer: string;
    amount: number;
    currency: CurrencyCode;
    payment_method: PaymentMethodTypes;
    confirmation_method: ConfirmationMethod,
    description?: string;
}

export type CreatePaymentIntentData = {
    user: UserType,
    payment: PaymentData,
}