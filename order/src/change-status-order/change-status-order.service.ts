import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from 'src/order/order.model';
import { Repository } from 'typeorm';

@Injectable()
export class ChangeStatusOrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: 'orders.change-status',
    queue: 'micro-orders/change-status',
  })
  public async rpcHandler(message: { id: string; status: OrderStatus }) {
    const order = await this.orderRepository.findOne(message.id);
    order.status = message.status;
    await this.orderRepository.save(order);
    return 1;
  }
}
