import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;
}
