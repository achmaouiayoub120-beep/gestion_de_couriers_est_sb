"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourierTypesModule = void 0;
const common_1 = require("@nestjs/common");
const courier_types_service_1 = require("./courier-types.service");
const courier_types_controller_1 = require("./courier-types.controller");
let CourierTypesModule = class CourierTypesModule {
};
exports.CourierTypesModule = CourierTypesModule;
exports.CourierTypesModule = CourierTypesModule = __decorate([
    (0, common_1.Module)({
        controllers: [courier_types_controller_1.CourierTypesController],
        providers: [courier_types_service_1.CourierTypesService],
        exports: [courier_types_service_1.CourierTypesService],
    })
], CourierTypesModule);
//# sourceMappingURL=courier-types.module.js.map