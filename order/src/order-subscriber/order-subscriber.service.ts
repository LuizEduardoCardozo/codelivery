import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Order } from 'src/order/order.model';
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

@EventSubscriber()
export class OrderSubscriberService
  implements EntitySubscriberInterface<Order>
{
  constructor(connection: Connection, private amqpConnection: AmqpConnection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Order;
  }

  async afterInsert(event: InsertEvent<Order>) {
    const order = event.entity;
    await this.amqpConnection.publish('amq.direct', 'orders.new', {
      id: order.id,
      driver_name: order.driver_name,
      location_id: order.location_id,
      location_geo: order.location_geo,

      order: order.id,
      destination: order.location_id,
    });
  }
}
