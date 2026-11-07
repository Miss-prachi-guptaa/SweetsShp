import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryProductDto {
  @ApiPropertyOptional({ description: 'Filter by category name (Chicken, Mutton, Seafood)' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Search term by name or description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by featured flag' })
  @IsOptional()
  featured?: string;
}
