import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';

@Injectable()
export class EntitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.entity.findMany({
      include: {
        chef: { select: { id: true, name: true, email: true } },
        parent: { select: { id: true, label: true, code: true } },
        children: { select: { id: true, label: true, code: true } },
        _count: { select: { users: true, receivedCouriers: true } },
      },
      orderBy: { label: 'asc' },
    });
  }

  async findOne(id: string) {
    const entity = await this.prisma.entity.findUnique({
      where: { id },
      include: {
        chef: { select: { id: true, name: true, email: true } },
        parent: true,
        children: true,
        users: { select: { id: true, name: true, email: true, role: true } },
      },
    });
    if (!entity) throw new NotFoundException('Entité non trouvée');
    return entity;
  }

  async create(dto: CreateEntityDto) {
    const exists = await this.prisma.entity.findUnique({ where: { code: dto.code } });
    if (exists) throw new ConflictException('Code entité déjà utilisé');

    return this.prisma.entity.create({
      data: dto,
      include: {
        chef: { select: { id: true, name: true, email: true } },
        parent: { select: { id: true, label: true, code: true } },
      },
    });
  }

  async update(id: string, dto: UpdateEntityDto) {
    await this.findOne(id);
    return this.prisma.entity.update({
      where: { id },
      data: dto,
      include: {
        chef: { select: { id: true, name: true, email: true } },
        parent: { select: { id: true, label: true, code: true } },
      },
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    await this.prisma.entity.delete({ where: { id } });
    return { message: 'Entité supprimée' };
  }
}
