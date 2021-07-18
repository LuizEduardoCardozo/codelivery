import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverHttpService } from 'src/driver-http/driver-http.service';
import { OrderController } from './order.controller';
import { Order } from './order.model';

@Module({
  controllers: [OrderController],
  imports: [TypeOrmModule.forFeature([Order]), HttpModule],
  providers: [DriverHttpService],
})
export class OrderModule {}
