import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRefStateDto } from './dto/create-ref-state.dto';

@Injectable()
export class RefStatesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.refState.findMany({ orderBy: { label: 'asc' } });
  }

  async findOne(id: string) {
    const state = await this.prisma.refState.findUnique({ where: { id } });
    if (!state) throw new NotFoundException('État non trouvé');
    return state;
  }

  async create(dto: CreateRefStateDto) {
    const exists = await this.prisma.refState.findUnique({ where: { label: dto.label } });
    if (exists) throw new ConflictException('État déjà existant');
    return this.prisma.refState.create({ data: dto });
  }

  async update(id: string, dto: Partial<CreateRefStateDto>) {
    await this.findOne(id);
    return this.prisma.refState.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    await this.findOne(id);
    await this.prisma.refState.delete({ where: { id } });
    return { message: 'État supprimé' };
  }
}
