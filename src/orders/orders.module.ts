import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, ORDERS_SERVICE} from 'src/config';

@Module({
  controllers: [OrdersController],
  providers: [],
  imports: [
      ClientsModule.register([
        {
          name: ORDERS_SERVICE,
          transport: Transport.TCP,
          options: {
            host: envs.orders_microservice_host,
            port: envs.orders_microservice_port,
          },
        }
      ])
    ],
})
export class OrdersModule {}
