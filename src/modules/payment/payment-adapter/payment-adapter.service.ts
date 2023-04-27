import { Injectable } from '@nestjs/common';
import { ConflictException, NotImplementedException } from '@nestjs/common/exceptions';
import { ThirdPartyPaymentServices } from '../enums';
import { Constants } from 'src/common/constants';
import { ConfirmPaymentData, CreateCustomerUserData, CreatePaymentIntentData, CreateStripeCustomer } from '../thirdparty/stripe/types';
import { AttachMethodCustomerData } from '../thirdparty/stripe/types/attach-method-customer-data.type';
import { StripePaymentIntentService } from '../thirdparty';
import { RegisterPaymentMethodDto } from '../dto/register-payment-method.dto';



/** DRY-KISS Payment adaptee method */
const paymentAdapteeMethod = {
    addUser: {
        stripe: 'createStripeCustomer',
    },
    startPaymentProcess: {
        stripe: 'createPaymentIntent'
    },
    ConfirmPaymentData: {
        stripe: 'confirmPayment',
    },
    attachPaymentMethodToCustomer: {
        stripe: 'attachMethodToCustomer',
    },
    createPaymentMethodForCustomer: {
        stripe: 'createPaymentMethod'
    }
}

@Injectable()
export class PaymentAdapterService {

    method: ThirdPartyPaymentServices = ThirdPartyPaymentServices.Stripe;

    /**
     * Inject services with names mapped 1:1 with the {ThirdPartyPaymentServices} values.
     */
    constructor(
        private readonly stripe: StripePaymentIntentService,
    ) { }

    /**
     * Changes payment method
     */
    async setMethod(
        method: ThirdPartyPaymentServices
    ): Promise<void> {
        this.method = method;
    }

    async getCustomerByEmail(email: string) {
        return await this.stripe.getCustomerByEmail(email);
    }


    async addUser(data: CreateCustomerUserData, options: CreateStripeCustomer) {
        const isUserAlreadyCustomer = await this.getCustomerByEmail(data.email);

        if (isUserAlreadyCustomer)
            throw new ConflictException(Constants.ErrorMessages.STRIPE_CUSTOMER_ALREADY_EXISTS);

        const added = await this.methodResolver(
            this.addUser.name,
            data,
            options,
        );

        return added;
    }

    async startPaymentProcess(data: CreatePaymentIntentData) {
        return await this.methodResolver(
            this.startPaymentProcess.name,
            data,
        );
    }

    async createPaymentMethodForCustomer(data: RegisterPaymentMethodDto) {
        return await this.methodResolver(
            this.createPaymentMethodForCustomer.name,
            data,
        );
    }

    async attachPaymentMethodToCustomer(data: AttachMethodCustomerData) {
        return await this.methodResolver(
            this.attachPaymentMethodToCustomer.name,
            data,
        );
    }

    async confirmPaymentProcess(data: ConfirmPaymentData) {
        return await this.methodResolver(
            this.confirmPaymentProcess.name,
            data,
        );
    }


    async methodResolver(
        methodKeyInAdapteeMap: string,
        data: CreateCustomerUserData
            | CreatePaymentIntentData
            | AttachMethodCustomerData
            | ConfirmPaymentData
            | RegisterPaymentMethodDto
            | AttachMethodCustomerData,
        options?: CreateStripeCustomer
    ) {
        const methodToUse = paymentAdapteeMethod
        [methodKeyInAdapteeMap]
        [this.method];

        if (!methodToUse)
            throw new NotImplementedException(Constants.ErrorMessages.PAYMENT_METHOD_NOT_SETUP);

        if (!options)
            return await this
            [this.method] // takes in the current method eg, stripe etc, services are imported 1:1 with the same name
            [methodToUse]( // Method of the service to use
                data
            );

        return await this
        [this.method] // takes in the current method eg, stripe etc, services are imported 1:1 with the same name
        [methodToUse]( // Method of the service to use
            data,
            options,
        );
    }
}
