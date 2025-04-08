import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE} from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }

  @Post()
  createProduct(
    @Body() createProductDto: CreateProductDto
  ) {
    return this.client.send({ cmd: 'create' }, createProductDto)
  }

  @Get()
  getProducts(
    @Query() paginationDto: PaginationDto
  ) {
    return this.client.send({ cmd: 'findAll' }, paginationDto)
  }

  @Get(':id')
  async getProductById(
    @Param('id', ParseIntPipe) id: number
  ) {

    //? Dos formas de hacerlo:

    //?  - 1) -

    /* return this.client.send({ cmd: 'findById' }, { id })
    .pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    ) */

    //?  - 2) -

    try {

      const product = await firstValueFrom(this.client.send({ cmd: 'findById' }, { id }))
      return product

    } catch (error) {
      throw new RpcException(error)
    }

  }

  @Patch(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ) {
    try {
      const product = await firstValueFrom(this.client.send({ cmd: 'update' }, { id, ...updateProductDto }))
      return {
        status: 'success',
        message: `Product with id: ${id}, update successfully`,
        product
      }
    } catch (error) {
      throw new RpcException(error)
    }
  }
  

  @Delete(':id')
  async deleteProduct(
    @Param('id', ParseIntPipe) id: number
  ) {
    try {
      const product = await firstValueFrom(this.client.send({ cmd: 'remove' }, { id }))
      return {
        status: 'success',
        message: `Product with id: ${id}, deleted successfully`
      }
    } catch (error) {
      throw new RpcException(error)
    }
  }
}
