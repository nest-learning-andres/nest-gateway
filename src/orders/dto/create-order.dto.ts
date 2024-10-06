// import { OrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { OrderItemDto } from './oder-item.dto';

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
  // @IsNumber()
  // @IsPositive()
  // totalAmount: number;

  // @IsNumber()
  // @IsPositive()
  // totalItems: number;

  // // OrderStatusList
  // @IsEnum(OrderStatus, {
  //   message: `Status must be one of the following values: ${Object.values(OrderStatus)}`,
  // })
  // @IsOptional()
  // status: OrderStatus = OrderStatus.PENDING;

  // @IsBoolean()
  // @IsOptional()
  // paid: boolean = false;
}
