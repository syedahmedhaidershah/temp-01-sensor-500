import { IsEnum, IsString } from "class-validator";
import { PaymentStatuses } from "../../enums"


class ConfirmPaymentQueryClass {
    @IsString()
    payment_intent: string;

    @IsString()
    payment_intent_client_secret: string;

    @IsEnum(PaymentStatuses)
    @IsString()
    redirect_status: PaymentStatuses
}

export type ConfirmPaymentQuery = ConfirmPaymentQueryClass;