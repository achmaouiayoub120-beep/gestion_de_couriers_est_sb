import {
  Controller, Get, Post, Patch, Delete, Param, Body,
  UseGuards, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CouriersService } from './couriers.service';
import { CreateCourierDto } from './dto/create-courier.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Couriers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('couriers')
export class CouriersController {
  constructor(private couriersService: CouriersService) {}

  @Get()
  @ApiOperation({ summary: 'Liste des courriers (filtrée par rôle)' })
  findAll(@CurrentUser() user: any, @Query() pagination: PaginationDto) {
    return this.couriersService.findAll(user, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail d\'un courrier' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.couriersService.findOne(id, user);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.CHEF, Role.AGENT)
  @ApiOperation({ summary: 'Créer un courrier' })
  create(@Body() dto: CreateCourierDto, @CurrentUser() user: any) {
    return this.couriersService.create(dto, user.id);
  }

  @Patch(':id/state')
  @ApiOperation({ summary: 'Mettre à jour l\'état d\'un courrier' })
  updateState(
    @Param('id') id: string,
    @Body() dto: UpdateStateDto,
    @CurrentUser() user: any,
  ) {
    return this.couriersService.updateState(id, dto, user.id, user.role);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un courrier' })
  delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.couriersService.delete(id, user.id, user.role);
  }
}
