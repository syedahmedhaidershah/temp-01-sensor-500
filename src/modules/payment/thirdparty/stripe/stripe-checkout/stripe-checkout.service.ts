import { Injectable } from '@nestjs/common';
import { StripeService } from '../stripe.service';
import { CreatePaymentIntentData } from '../types';
import { ResourceLockedException } from 'src/common/exceptions';
import { Constants } from 'src/common/constants';

@Injectable()
export class StripeCheckoutService extends StripeService {

    // async createPaymentLink(
    //     data: CreatePaymentIntentData,
    // ) {
    //     const {
    //         user,
    //         payment,
    //     } = data;

    //     const getIntent = this.cache.get(user._id);

    //     if (getIntent)
    //         throw new ResourceLockedException(Constants.ErrorMessages.PAYMENT_ALREADY_INPROGRESS);

    //     const {
    //         payment_method,
    //         confirmation_method,
    //     } = payment;

    //     const paymentIntent = await this.instance.paymentLinks.create();

    //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //     const cached = await this.cache.set(
    //         user._id
    //             .concat(payment_method)
    //             .concat(confirmation_method),
    //         paymentIntent
    //     )

    //     return paymentIntent;
    // }
}
