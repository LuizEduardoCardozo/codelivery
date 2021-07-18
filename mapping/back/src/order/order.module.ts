import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.model';
import { MappingService } from './mapping/mapping.service';
import { NewOrderService } from './new-order/new-order.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { OrderController } from './order.controller';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: 'amqp://admin:admin@localhost:5672',
    }),
    TypeOrmModule.forFeature([Order]),
  ],
  providers: [NewOrderService, MappingService],
  controllers: [OrderController],
})
export class OrderModule {}
