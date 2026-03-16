import {
  Injectable, NotFoundException, ForbiddenException, Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CourierState, Role } from '@prisma/client';
import { CreateCourierDto } from './dto/create-courier.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

const COURIER_INCLUDE = {
  fromEntity: true,
  toEntity: true,
  category: true,
  type: true,
  createdBy: { select: { id: true, name: true, email: true, role: true } },
  attachments: true,
  history: {
    include: {
      changedBy: { select: { id: true, name: true } },
    },
    orderBy: { changedAt: 'asc' as const },
  },
};

@Injectable()
export class CouriersService {
  private readonly logger = new Logger(CouriersService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(user: any, pagination: PaginationDto) {
    const { page = 1, limit = 20, search } = pagination;
    const skip = (page - 1) * limit;

    // Filter by role
    let roleFilter: any = {};
    if (user.role === Role.AGENT) {
      roleFilter = { OR: [{ toEntityId: user.entityId }, { createdById: user.id }] };
    } else if (user.role === Role.CHEF) {
      roleFilter = { toEntityId: user.entityId };
    }

    // Search filter
    const searchFilter = search
      ? {
          OR: [
            { reference: { contains: search, mode: 'insensitive' as const } },
            { subject: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const where = { ...roleFilter, ...searchFilter };

    const [data, total] = await Promise.all([
      this.prisma.courier.findMany({
        where,
        include: COURIER_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.courier.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string, user: any) {
    const courier = await this.prisma.courier.findUnique({
      where: { id },
      include: COURIER_INCLUDE,
    });

    if (!courier) throw new NotFoundException('Courrier non trouvé');

    // Check access by role
    if (
      user.role === Role.AGENT &&
      courier.toEntityId !== user.entityId &&
      courier.createdById !== user.id
    ) {
      throw new ForbiddenException('Accès non autorisé');
    }

    return courier;
  }

  async create(dto: CreateCourierDto, userId: string) {
    const reference = this.generateReference();

    const courier = await this.prisma.courier.create({
      data: {
        reference,
        subject: dto.subject,
        description: dto.description,
        toEntityId: dto.toEntityId,
        fromEntityId: dto.fromEntityId,
        categoryId: dto.categoryId,
        typeId: dto.typeId,
        priority: dto.priority,
        createdById: userId,
        state: CourierState.NEW,
        history: {
          create: { state: CourierState.NEW, changedById: userId },
        },
      },
      include: COURIER_INCLUDE,
    });

    this.logger.log(`Nouveau courrier créé : ${reference} par user ${userId}`);
    return courier;
  }

  async updateState(id: string, dto: UpdateStateDto, userId: string, userRole: Role) {
    const courier = await this.prisma.courier.findUnique({ where: { id } });
    if (!courier) throw new NotFoundException('Courrier non trouvé');

    // State transition rules
    this.validateStateTransition(courier.state, dto.state, userRole);

    const updated = await this.prisma.courier.update({
      where: { id },
      data: {
        state: dto.state,
        history: {
          create: { state: dto.state, changedById: userId, notes: dto.notes },
        },
      },
      include: COURIER_INCLUDE,
    });

    this.logger.log(`Courrier ${id} : ${courier.state} → ${dto.state} par user ${userId}`);
    return updated;
  }

  async delete(id: string, userId: string, userRole: Role) {
    const courier = await this.prisma.courier.findUnique({ where: { id } });
    if (!courier) throw new NotFoundException('Courrier non trouvé');

    if (userRole !== Role.SUPER_ADMIN && userRole !== Role.ADMIN) {
      if (courier.createdById !== userId) {
        throw new ForbiddenException('Vous ne pouvez supprimer que vos propres courriers');
      }
    }

    await this.prisma.courier.delete({ where: { id } });
    this.logger.log(`Courrier supprimé : ${id} par user ${userId}`);
    return { message: 'Courrier supprimé avec succès' };
  }

  private validateStateTransition(current: CourierState, next: CourierState, role: Role) {
    const allowedTransitions: Record<CourierState, CourierState[]> = {
      NEW: [CourierState.IN_PROGRESS, CourierState.REJECTED],
      IN_PROGRESS: [CourierState.TREATED, CourierState.REJECTED],
      TREATED: [CourierState.ARCHIVED],
      REJECTED: [CourierState.ARCHIVED],
      ARCHIVED: [],
    };

    if (!allowedTransitions[current].includes(next) && role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException(`Transition ${current} → ${next} non autorisée`);
    }
  }

  private generateReference(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `ESTSB-${year}${month}-${random}`;
  }
}
