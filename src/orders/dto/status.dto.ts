import { IsEnum } from 'class-validator';
import { OrderStatus } from '../enum/order.enum';

export class StatusDto {
  @IsEnum(OrderStatus, {
    message: `Status must be one of the following values: ${Object.values(OrderStatus)}`,
  })
  status: OrderStatus;
}
