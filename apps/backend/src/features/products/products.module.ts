import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductsController } from './api/products.controller';
import { ProductsRepo } from './infrastructure/products.repo';
import { ProductsDataEntity } from './entities/products-data.entity';
import { CreateAndSaveCreateRandomProductsUseCase } from './application/create-and-save-create-random-products.use-case';
import { CreateRandomProductsUseCase } from './application/create-random-products.use-case';
import { OrderItemsEntity } from './entities/order-items.entity';
import { PaymentTransactionsEntity } from './entities/payment-transaction.entity';
import { OrdersEntity } from './entities/orders.entity';
import { OrdersRepo } from './infrastructure/orders.repo';
import { OrderItemsRepo } from './infrastructure/order-items.repo';
import { CreateOrderAndPaymentTransactionsUseCase } from './application/create-order-and-payment-transactions.use-case';
import { PaymentTransactionsRepo } from '../../../../payment-service/src/infrastructure/payment-transactions.repo';
import { ParseQueriesService } from '../../../../../libs/common/src/query/parse-queries.service';
import { UuidErrorResolver } from '../../../../../libs/common/src/helpers/uuid-error-resolver';

const useCases = [
  CreateRandomProductsUseCase,
  CreateAndSaveCreateRandomProductsUseCase,
  CreateOrderAndPaymentTransactionsUseCase,
];
const services = [ParseQueriesService];

const helpers = [UuidErrorResolver];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrdersEntity,
      OrderItemsEntity,
      ProductsDataEntity,
      PaymentTransactionsEntity,
    ]),
    CqrsModule,
  ],
  controllers: [ProductsController],
  providers: [
    OrdersRepo,
    ProductsRepo,
    OrderItemsRepo,
    PaymentTransactionsRepo,
    ...useCases,
    ...services,
    ...helpers,
  ],
})
export class ProductsModule {}
