export type AttachMethodCustomerData = {
    customerId: string;
    paymentMethod: {
        id: string,
        [keys: string]: unknown;
    };
}