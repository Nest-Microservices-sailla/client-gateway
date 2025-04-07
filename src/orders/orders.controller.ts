import { Controller, Get, Post, Body, Param, Inject, Query, ParseUUIDPipe, Patch } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ORDERS_SERVICE } from 'src/config';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  
  constructor(

    @Inject(ORDERS_SERVICE) private readonly orderClient: ClientProxy

  ) { }

  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto
  ) {
    return this.orderClient.send('createOrder', createOrderDto);
  }

  @Get()
  findAll(
    @Query() orderPaginationDto: OrderPaginationDto
  ) {
    return this.orderClient.send('findAllOrders', orderPaginationDto);
  }

  @Get('id/:id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    try {

      const order = await firstValueFrom(
        this.orderClient.send('findOneOrder', {id})
      )
      return order

    } catch (error) {
      throw new RpcException(error)
    }
  }


  @Get(':status')
  async findOneStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto
  ) {
    try {

      const orders = await this.orderClient.send('findAllOrders', {
        ...paginationDto,
        status: statusDto.status
      })
      return orders

    } catch (error) {
      throw new RpcException(error)
    }
  }


  @Patch(':id')
  async changeOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto 
  ){
    try {

      const order = await this.orderClient.send('changeOrderStatus', {
        id,
        status: statusDto.status
      })
      return order

    } catch (error) {
      throw new RpcException(error)
    }
    }
}

