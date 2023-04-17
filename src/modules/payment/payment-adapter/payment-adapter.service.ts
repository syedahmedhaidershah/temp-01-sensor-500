import { Injectable, Scope } from '@nestjs/common';
import { NotImplementedException } from '@nestjs/common/exceptions';
import { ThirdPartyPaymentServices } from '../enums';
import { RegisterUserDto } from '../dto/register-user.dto';
import { Constants } from 'src/common/constants';
import { ConfirmPaymentData, CreatePaymentIntentData } from '../thirdparty/stripe/types';
import { AttachMethodCustomerData } from '../thirdparty/stripe/types/attach-method-customer-data';
import { StripePaymentIntentService } from '../thirdparty';


/** DRY-KISS Payment adaptee method */
const paymentAdapteeMethod = {
    addUser: {
        stripe: 'createStripeCustomer',
    },
    startPaymentProcess: {
        stripe: 'createPaymentIntent'
    },
    attachPaymentMethod: {
        stripe: 'attachMethodToCustomer',
    },
    ConfirmPaymentData: {
        stripe: 'confirmPayment',
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
    async setMethod(method: ThirdPartyPaymentServices) {
        this.method = method;
    }


    async addUser(userData: RegisterUserDto) {
        return await this.methodResolver(userData, this.addUser.name);
    }

    async startPaymentProcess(data: CreatePaymentIntentData) {
        return await this.methodResolver(data, this.startPaymentProcess.name);
    }

    async attachPaymentMethodToCustomer(data: AttachMethodCustomerData) {
        return await this.methodResolver(data, this.attachPaymentMethodToCustomer.name);
    }

    async confirmPaymentProcess(data: ConfirmPaymentData) {
        return await this.methodResolver(data, this.confirmPaymentProcess.name);
    }


    async methodResolver(
        data: RegisterUserDto | CreatePaymentIntentData | AttachMethodCustomerData | ConfirmPaymentData,
        methodKeyInAdapteeMap: string
    ) {
        const methodToUse = paymentAdapteeMethod
        [methodKeyInAdapteeMap]
        [this.method];

        if (!methodToUse)
            throw new NotImplementedException(Constants.ErrorMessages.PAYMENT_METHOD_NOT_SETUP);

        return await this
        [this.method] // takes in the current method eg, stripe etc, services are imported 1:1 with the same name
        [methodToUse]( // Method of the service to use
            data
        );
    }
}
