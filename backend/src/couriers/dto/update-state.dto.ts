import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CourierState } from '@prisma/client';

export class UpdateStateDto {
  @ApiProperty({ enum: CourierState })
  @IsEnum(CourierState)
  state: CourierState;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
