import {
  Controller, Get, Post, Put, Delete, Param, Body, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { RefStatesService } from './ref-states.service';
import { CreateRefStateDto } from './dto/create-ref-state.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('RefStates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ref-states')
export class RefStatesController {
  constructor(private refStatesService: RefStatesService) {}

  @Get()
  @ApiOperation({ summary: 'Liste des états référentiels' })
  findAll() {
    return this.refStatesService.findAll();
  }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Créer un état référentiel' })
  create(@Body() dto: CreateRefStateDto) {
    return this.refStatesService.create(dto);
  }

  @Put(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Modifier un état référentiel' })
  update(@Param('id') id: string, @Body() dto: CreateRefStateDto) {
    return this.refStatesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Supprimer un état référentiel' })
  delete(@Param('id') id: string) {
    return this.refStatesService.delete(id);
  }
}
