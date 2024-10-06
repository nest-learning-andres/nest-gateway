import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../enum/order.enum';
import { PaginationDto } from 'src/common';

export class OrderPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStatus, {
    message: `Status must be one of the following values: ${Object.values(OrderStatus)}`,
  })
  status: OrderStatus;
}
