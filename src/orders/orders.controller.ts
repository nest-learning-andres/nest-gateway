import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
  Patch,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { StatusDto } from './dto/status.dto';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const products = await firstValueFrom(
        this.client.send('createOrder', createOrderDto),
      );
      return products;
    } catch (error) {
      console.log('Error Grate Way', error);
      throw new RpcException(error);
    }

    // return createOrderDto;
  }

  @Get()
  findAll(@Query() paginationDto: OrderPaginationDto) {
    // return paginationDto;
    return this.client.send('findAllOrders', paginationDto);
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.client.send('findOneOrder', { id }),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }
  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: OrderPaginationDto,
  ) {
    try {
      const order = await firstValueFrom(
        this.client.send('findAllOrders', {
          status: statusDto.status,
          ...paginationDto,
        }),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }
  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    try {
      const params = {
        id,
        status: statusDto.status,
      };
      return this.client.send('changeOrderStatus', params);
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
