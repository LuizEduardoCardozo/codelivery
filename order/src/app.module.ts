import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './order/order.module';
import { Order } from './order/order.model';
import { OrderSubscriberService } from './order-subscriber/order-subscriber.service';
import { ChangeStatusOrderService } from './change-status-order/change-status-order.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'micro_orders',
      entities: [Order],
    }),
    OrderModule,
  ],
  controllers: [],
  providers: [OrderSubscriberService, ChangeStatusOrderService],
})
export class AppModule {}
