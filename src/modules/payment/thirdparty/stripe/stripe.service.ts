/** Core dependencies */
import { Injectable } from '@nestjs/common';



/** Third party dependencies */
import stripe from 'stripe';



/** Local dependencies, configuration & Declarations */
import { STRIPE_API_VERSION } from 'src/modules/payment/thirdparty/stripe/config';
import EnvironmentVariables from 'src/common/interfaces/environmentVariables';
import { CacheService } from 'src/modules/cache/cache.service';
import { UserType } from 'src/modules/users/types';
import { CreateStripeCustomer } from './types';



/** Application configuration & declarations */
const {
    STRIPE_SECRET_KEY,
} = process.env as EnvironmentVariables;


/**
 * @note GRX-55 | test - jira/github integration
 * New test
 */
@Injectable()
export class StripeService implements IStripeSerice {

    instance: stripe | undefined;

    constructor(
        public readonly cache: CacheService,
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
            phone_number: phone,
        } = data;

        const {
            isGuest,
        } = options;

        const Customer = await this.instance.customers.create({
            name: username,
            email,
            phone,
        });

        if (!isGuest) {
            const key = ['stripe', username, Customer.id]
                .join('-');

            await this.cache.set(key, Customer, 0);
        }
    }
}

export interface IStripeSerice {
    instance: stripe | undefined;
    cache: CacheService;
}
