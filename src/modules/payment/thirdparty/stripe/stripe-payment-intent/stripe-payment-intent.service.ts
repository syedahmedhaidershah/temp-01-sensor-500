import { Injectable } from '@nestjs/common';
import { StripeService } from '../stripe.service';
import { ConfirmPaymentData, CreatePaymentIntentData, AttachMethodCustomerData } from '../types';
import { Constants } from 'src/common/constants';
import { ResourceLockedException } from 'src/common/exceptions';
import Stripe from 'stripe';

@Injectable()
export class StripePaymentIntentService extends StripeService {

    async createPaymentMethod(customerId: string, cardDetails: Stripe.PaymentMethodCreateParams.Card1) {
        const method = await this.instance.paymentMethods.create({
            card: cardDetails,
            customer: customerId,
        });

        return method;
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
}
