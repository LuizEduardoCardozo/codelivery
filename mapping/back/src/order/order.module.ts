import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.model';
import { MappingService } from './mapping/mapping.service';
import { NewOrderService } from './new-order/new-order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [MappingService, NewOrderService],
})
export class OrderModule {}
