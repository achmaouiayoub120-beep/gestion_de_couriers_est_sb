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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouriersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const couriers_service_1 = require("./couriers.service");
const create_courier_dto_1 = require("./dto/create-courier.dto");
const update_state_dto_1 = require("./dto/update-state.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let CouriersController = class CouriersController {
    couriersService;
    constructor(couriersService) {
        this.couriersService = couriersService;
    }
    findAll(user, pagination) {
        return this.couriersService.findAll(user, pagination);
    }
    findOne(id, user) {
        return this.couriersService.findOne(id, user);
    }
    create(dto, user) {
        return this.couriersService.create(dto, user.id);
    }
    updateState(id, dto, user) {
        return this.couriersService.updateState(id, dto, user.id, user.role);
    }
    delete(id, user) {
        return this.couriersService.delete(id, user.id, user.role);
    }
};
exports.CouriersController = CouriersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Liste des courriers (filtrée par rôle)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], CouriersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Détail d\'un courrier' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CouriersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN, client_1.Role.CHEF, client_1.Role.AGENT),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un courrier' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_courier_dto_1.CreateCourierDto, Object]),
    __metadata("design:returntype", void 0)
], CouriersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/state'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour l\'état d\'un courrier' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_state_dto_1.UpdateStateDto, Object]),
    __metadata("design:returntype", void 0)
], CouriersController.prototype, "updateState", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un courrier' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CouriersController.prototype, "delete", null);
exports.CouriersController = CouriersController = __decorate([
    (0, swagger_1.ApiTags)('Couriers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('couriers'),
    __metadata("design:paramtypes", [couriers_service_1.CouriersService])
], CouriersController);
//# sourceMappingURL=couriers.controller.js.map