import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { PaymentManager } from './payment-manager/payment-manager';
import { BuyProductsUseCase } from './application/use-cases/buy-products.use-case';
import { PayPalAdapter } from './payment-systems/pay-pal/adapter/pay-pal.adapter';
import { StripeAdapter } from './payment-systems/stripe/adapter/stripe-adapter';
import { StripeFactory } from './payment-systems/stripe/factory/stripe-factory';
import { PayPalConfig } from './config/pay-pal/pay-pal.config';
import { StripeConfig } from './config/stripe/stripe.config';
import { PostgresConfig } from '../../backend/src/config/db/postgres/postgres.config';
import { PayPalFactory } from './config/pay-pal/pay-pal-factory';
import { NodeEnvConfig } from '../../backend/src/config/node-env/node-env.config';
import { ProductsDataEntity } from '../../backend/src/features/products/entities/products-data.entity';
import { ProductsRepo } from '../../backend/src/features/products/infrastructure/products.repo';
import { PaymentService } from './application/payment.service';
import { LibsModule } from '../../libs/libs.module';
import { UuidErrorResolver } from '../../libs/common/helpers/uuid-error-resolver';
import { PaymentServiceController } from './api/payment-service.controller';

const paymentUseCases = [BuyProductsUseCase];
const paymentConfigs = [NodeEnvConfig, StripeConfig, PostgresConfig];
const helpers = [UuidErrorResolver];

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductsDataEntity]),
    CqrsModule,
    LibsModule,
  ],
  controllers: [PaymentServiceController],
  providers: [
    PaymentService,
    PayPalConfig,
    PayPalFactory,
    PayPalAdapter,
    StripeAdapter,
    StripeFactory,
    PaymentManager,
    ProductsRepo,
    ...helpers,
    ...paymentConfigs,
    ...paymentUseCases,
  ],
})
export class PaymentServiceModule {}
