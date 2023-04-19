import { IsJSON, IsNotEmpty, IsString } from "class-validator";

class PaymentMethodObject {
    id: string;

    [keys: string]: unknown;
}

export class RegisterPaymentMethodDto {

    @IsNotEmpty()
    @IsString()
    customerId: string;

    @IsNotEmpty()
    @IsJSON()
    paymentMethod: PaymentMethodObject;
}