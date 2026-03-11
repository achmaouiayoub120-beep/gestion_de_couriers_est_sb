"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EntitiesService = class EntitiesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async findOne(id) {
        const entity = await this.prisma.entity.findUnique({
            where: { id },
            include: {
                chef: { select: { id: true, name: true, email: true } },
                parent: true,
                children: true,
                users: { select: { id: true, name: true, email: true, role: true } },
            },
        });
        if (!entity)
            throw new common_1.NotFoundException('Entité non trouvée');
        return entity;
    }
    async create(dto) {
        const exists = await this.prisma.entity.findUnique({ where: { code: dto.code } });
        if (exists)
            throw new common_1.ConflictException('Code entité déjà utilisé');
        return this.prisma.entity.create({
            data: dto,
            include: {
                chef: { select: { id: true, name: true, email: true } },
                parent: { select: { id: true, label: true, code: true } },
            },
        });
    }
    async update(id, dto) {
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
    async delete(id) {
        await this.findOne(id);
        await this.prisma.entity.delete({ where: { id } });
        return { message: 'Entité supprimée' };
    }
};
exports.EntitiesService = EntitiesService;
exports.EntitiesService = EntitiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EntitiesService);
//# sourceMappingURL=entities.service.js.map