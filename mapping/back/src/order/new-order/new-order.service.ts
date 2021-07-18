import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../order.model';

@Injectable()
export class NewOrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: 'orders.new',
    queue: 'micro-mapping/orders-new',
  })
  async rpcHandler(message: {
    id: string;
    driver_name: string;
    location_id: number;
    location_geo: number[];
  }) {
    const createdOrder = this.orderRepository.create({
      id: message.id,
      driver_name: message.driver_name,
      location_id: message.location_id,
      location_geo: message.location_geo,
    });
    await this.orderRepository.save(createdOrder);
  }
}
