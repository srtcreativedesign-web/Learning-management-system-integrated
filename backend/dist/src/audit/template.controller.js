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
exports.TemplateController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const template_service_1 = require("./template.service");
let TemplateController = class TemplateController {
    templateService;
    constructor(templateService) {
        this.templateService = templateService;
    }
    async findAllForOfflineSync() {
        return this.templateService.findAllForOfflineSync();
    }
};
exports.TemplateController = TemplateController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all audit templates with checklists for offline sync' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of templates and nested checklists.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TemplateController.prototype, "findAllForOfflineSync", null);
exports.TemplateController = TemplateController = __decorate([
    (0, swagger_1.ApiTags)('Audit Templates (Offline Sync)'),
    (0, common_1.Controller)('audit/templates'),
    __metadata("design:paramtypes", [template_service_1.TemplateService])
], TemplateController);
//# sourceMappingURL=template.controller.js.map