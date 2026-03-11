import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourierTypeDto } from './dto/create-courier-type.dto';

@Injectable()
export class CourierTypesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.courierType.findMany({ orderBy: { label: 'asc' } });
  }

  async findOne(id: string) {
    const type = await this.prisma.courierType.findUnique({ where: { id } });
    if (!type) throw new NotFoundException('Type de courrier non trouvé');
    return type;
  }

  async create(dto: CreateCourierTypeDto) {
    const exists = await this.prisma.courierType.findUnique({ where: { label: dto.label } });
    if (exists) throw new ConflictException('Type déjà existant');
    return this.prisma.courierType.create({ data: dto });
  }

  async update(id: string, dto: Partial<CreateCourierTypeDto>) {
    await this.findOne(id);
    return this.prisma.courierType.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    await this.findOne(id);
    await this.prisma.courierType.delete({ where: { id } });
    return { message: 'Type supprimé' };
  }
}
