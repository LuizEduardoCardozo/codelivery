import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { InjectRepository } from '@nestjs/typeorm';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../order.model';

@WebSocketGateway()
export class MappingService {
  @WebSocketServer() server: Server;

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly amqConnection: AmqpConnection,
  ) {}

  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: 'mapping.new-position',
    queue: 'micro-mapping/new-position',
  })
  public async rpcHandler(message) {
    const lat = parseFloat(message.lat);
    const lng = parseFloat(message.lng);

    this.server.emit(`order.${message.order}.new-position`, { lat, lng });

    if (lat === 0 && lng === 0) {
      const order = await this.orderRepository.findOne(message.order);
      order.order_status = OrderStatus.DONE;
      await this.orderRepository.save(order);
      await this.amqConnection.publish('amq.direct', 'orders.change-status', {
        id: order.id,
        status: OrderStatus.DONE,
      });
    }
  }
}
