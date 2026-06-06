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
import { PayPalFactory } from './config/pay-pal/pay-pal-factory';
import { PaymentService } from './application/payment.service';
import { PaymentServiceController } from './api/payment-service.controller';
import { PostgresConfig } from 'backend/src/config/db/postgres/postgres.config';
import { NodeEnvConfig } from 'backend/src/config/node-env/node-env.config';
import { ProductsDataEntity } from 'backend/src/features/products/entities/products-data.entity';
import { CustomConfigModule } from 'backend/src/config/custom.config-module';
import { ProductsRepo } from 'backend/src/features/products/infrastructure/products.repo';
import { TypeOrmPostgresOptions } from 'backend/src/db/type-orm/options/type-orm-postgres.options';
import { UuidErrorResolver } from '@libs/common/src/helpers/uuid-error-resolver';

const paymentUseCases = [BuyProductsUseCase];
const paymentConfigs = [NodeEnvConfig, StripeConfig, PostgresConfig];
const libs = [UuidErrorResolver];

@Module({
  imports: [
    CustomConfigModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmPostgresOptions, // Use the OrmOptions class as the stripe
    }),
    TypeOrmModule.forFeature([ProductsDataEntity]),
    CqrsModule,
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
    ...libs,
    ...paymentConfigs,
    ...paymentUseCases,
  ],
})
export class PaymentServiceModule {}
