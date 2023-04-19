import { RegisterPaymentMethodDto } from "src/modules/payment/dto/register-payment-method.dto";

export type AttachMethodCustomerData = {
    customerId: string;
} & RegisterPaymentMethodDto;