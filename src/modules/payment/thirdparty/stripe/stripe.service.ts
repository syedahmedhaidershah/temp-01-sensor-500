/** Core dependencies */
import { Injectable } from '@nestjs/common';



/** Third party dependencies */
import stripe from 'stripe';



/** Local dependencies, configuration & Declarations */
import { STRIPE_API_VERSION } from 'src/modules/payment/thirdparty/stripe/config';
import EnvironmentVariables from 'src/common/interfaces/environmentVariables';
import { CacheService } from 'src/modules/cache/cache.service';
import { ConfirmPaymentData, CreatePaymentIntentData, CreateStripeCustomer } from './types';
import { Constants } from 'src/common/constants';
import { ResourceLockedException } from 'src/common/exceptions';
import { UserType } from 'src/modules/users/types';
import { AttachMethodCustomerData } from './types/attach-method-customer-data';



/** Application configuration & declarations */
const {
    STRIPE_SECRET_KEY,
} = process.env as EnvironmentVariables;


/**
 * @note GRX-55 | test - jira/github integration
 */
@Injectable()
export class StripeService {

    instance: stripe | undefined;

    constructor(
        private readonly cache: CacheService,
    ) {
        if (!this.instance) {

            this.instance = new stripe(
                STRIPE_SECRET_KEY,
                {
                    apiVersion: STRIPE_API_VERSION
                });
        }
    }

    async createStripeCustomer(
        data: UserType,
        options: CreateStripeCustomer,
    ) {
        const {
            username,
            email,
            phone
        } = data;

        const {
            isGuest,
        } = options;

        const Customer = await this.instance.customers.create({
            name: username,
            email: email,
            phone: phone,
        });

        if (!isGuest) {
            const key = ['stripe', username, Customer.id]
                .join('-');

            await this.cache.set(key, Customer, 0);
        }
    }

    async createPaymentIntent(
        data: CreatePaymentIntentData,
    ) {
        const {
            user,
            payment,
        } = data;

        const getIntent = this.cache.get(user._id);

        if (getIntent)
            throw new ResourceLockedException(Constants.ErrorMessages.PAYMENT_ALREADY_INPROGRESS);

        const {
            payment_method,
            confirmation_method,
        } = payment;

        const paymentIntent = await this.instance.paymentIntents.create(payment);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const cached = await this.cache.set(
            user._id
                .concat(payment_method)
                .concat(confirmation_method),
            paymentIntent
        )

        return paymentIntent;
    }

    async confirmPayment(
        data: ConfirmPaymentData,
    ) {
        const {
            paymentIntentId,
            paymentMethod
        } = data;

        const intent = await this.instance.paymentIntents
            .confirm(
                paymentIntentId, {
                payment_method: paymentMethod,
            });

        return intent;
    }

    async attachMethodToCustomer(
        data: AttachMethodCustomerData
    ) {
        const {
            customerId: customer,
            paymentMethod: { id: paymentMethodId }
        } = data;

        const paymentMethodAttached = await this.instance.paymentMethods
            .attach(
                paymentMethodId,
                {
                    customer,
                });

        return paymentMethodAttached;
    }
}
