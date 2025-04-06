import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCTS_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCTS_SERVICE) private readonly productClient: ClientProxy
  ) { }

  @Post()
  createProduct(
    @Body() createProductDto: CreateProductDto
  ) {
    return this.productClient.send({ cmd: 'create' }, createProductDto)
  }

  @Get()
  getProducts(
    @Query() paginationDto: PaginationDto
  ) {
    return this.productClient.send({ cmd: 'findAll' }, paginationDto)
  }

  @Get(':id')
  async getProductById(
    @Param('id', ParseIntPipe) id: number
  ) {

    //? Dos formas de hacerlo:

    //?  - 1) -

    /* return this.productClient.send({ cmd: 'findById' }, { id })
    .pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    ) */

    //?  - 2) -

    try {

      const product = await firstValueFrom(this.productClient.send({ cmd: 'findById' }, { id }))
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
      const product = await firstValueFrom(this.productClient.send({ cmd: 'update' }, { id, ...updateProductDto }))
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
      const product = await firstValueFrom(this.productClient.send({ cmd: 'remove' }, { id }))
      return {
        status: 'success',
        message: `Product with id: ${id}, deleted successfully`
      }
    } catch (error) {
      throw new RpcException(error)
    }
  }
}
