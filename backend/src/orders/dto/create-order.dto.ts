import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';

export class OrderItemDto {
  @ApiProperty({ example: 380 })
  @IsNumber()
  productId: number;

  @ApiProperty({ example: 'Desi Cockrel Chicken' })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: 400 })
  @IsNumber()
  price: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'Amit Kumar' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: '+919876543210' })
  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @ApiPropertyOptional({ example: 'amit@example.com' })
  @IsOptional()
  @IsString()
  customerEmail?: string;

  @ApiProperty({ example: 'Flat 402, Ganga Residency, Boring Canal Road' })
  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @ApiProperty({ example: 'Boring Road' })
  @IsString()
  @IsNotEmpty()
  deliveryArea: string;

  @ApiProperty({ example: 'Morning (7:00 AM - 9:00 AM)' })
  @IsString()
  @IsNotEmpty()
  deliverySlot: string;

  @ApiProperty({ example: 'COD' })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiPropertyOptional({ example: 'Please keep extra curry leaves' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
