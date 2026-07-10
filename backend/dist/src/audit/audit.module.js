"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditModule = void 0;
const common_1 = require("@nestjs/common");
const template_controller_1 = require("./template.controller");
const template_service_1 = require("./template.service");
const checklist_controller_1 = require("./checklist/checklist.controller");
const checklist_service_1 = require("./checklist/checklist.service");
const outlet_controller_1 = require("./outlet/outlet.controller");
const outlet_service_1 = require("./outlet/outlet.service");
const axios_1 = require("@nestjs/axios");
let AuditModule = class AuditModule {
};
exports.AuditModule = AuditModule;
exports.AuditModule = AuditModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule],
        controllers: [template_controller_1.TemplateController, checklist_controller_1.ChecklistController, outlet_controller_1.OutletController],
        providers: [template_service_1.TemplateService, checklist_service_1.ChecklistService, outlet_service_1.OutletService]
    })
], AuditModule);
//# sourceMappingURL=audit.module.js.map