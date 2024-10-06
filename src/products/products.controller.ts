import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}
  @Post()
  createProduct(@Body() createProduct: CreateProductDto) {
    return this.client.send({ cmd: 'create_product' }, createProduct);
  }
  @Get()
  async findProducts(@Query() paginationDto: PaginationDto) {
    try {
      const product = await firstValueFrom(
        this.client.send({ cmd: 'find_all_product' }, paginationDto),
      );
      return product;
    } catch (error) {
      console.log('find - error', error);
      throw new RpcException(error);
    }
  }

  @Get(':id')
  async findProductById(@Param('id') id: string) {
    try {
      const product = await firstValueFrom(
        this.client.send({ cmd: 'find_one_product' }, { id }),
      );
      return product;
    } catch (error) {
      console.log('find - error', error);
      // throw new BadRequestException(error);
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    try {
      console.log('Id eNVIA' + id);
      const value = await firstValueFrom(
        this.client.send({ cmd: 'delete_product' }, { id }),
      );
      return value;
    } catch (error) {
      console.log('error', error);
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.client
      .send(
        {
          cmd: 'update_product',
        },
        { id, ...updateProductDto },
      )
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }
}
