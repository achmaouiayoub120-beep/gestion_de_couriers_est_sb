import {
  Controller, Get, Post, Put, Delete, Param, Body, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CourierTypesService } from './courier-types.service';
import { CreateCourierTypeDto } from './dto/create-courier-type.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('CourierTypes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('courier-types')
export class CourierTypesController {
  constructor(private courierTypesService: CourierTypesService) {}

  @Get()
  @ApiOperation({ summary: 'Liste des types de courrier' })
  findAll() {
    return this.courierTypesService.findAll();
  }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Créer un type de courrier' })
  create(@Body() dto: CreateCourierTypeDto) {
    return this.courierTypesService.create(dto);
  }

  @Put(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Modifier un type de courrier' })
  update(@Param('id') id: string, @Body() dto: CreateCourierTypeDto) {
    return this.courierTypesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Supprimer un type de courrier' })
  delete(@Param('id') id: string) {
    return this.courierTypesService.delete(id);
  }
}
