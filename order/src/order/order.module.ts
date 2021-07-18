import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChangeStatusOrderService } from 'src/change-status-order/change-status-order.service';
import { DriverHttpService } from 'src/driver-http/driver-http.service';
import { OrderSubscriberService } from 'src/order-subscriber/order-subscriber.service';
import { OrderController } from './order.controller';
import { Order } from './order.model';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: `amqp://admin:admin@localhost:5672`,
    }),
    TypeOrmModule.forFeature([Order]),
    HttpModule,
  ],
  controllers: [OrderController],
  providers: [
    DriverHttpService,
    ChangeStatusOrderService,
    OrderSubscriberService,
  ],
})
export class OrderModule {}
