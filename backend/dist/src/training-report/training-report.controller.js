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
exports.TrainingReportController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const training_report_service_1 = require("./training-report.service");
let TrainingReportController = class TrainingReportController {
    reportService;
    constructor(reportService) {
        this.reportService = reportService;
    }
    async getOverview(startDate, endDate, outletId) {
        const data = await this.reportService.getOverview({ startDate, endDate, outletId });
        return {
            success: true,
            data,
        };
    }
    async getRecords(startDate, endDate, type, isPassed, outletId, search, limit, offset) {
        const data = await this.reportService.getDetailedRecords({
            startDate,
            endDate,
            type,
            isPassed,
            outletId,
            search,
            limit: limit ? parseInt(limit, 10) : 100,
            offset: offset ? parseInt(offset, 10) : 0,
        });
        return {
            success: true,
            data,
        };
    }
    async getOutlets() {
        const data = await this.reportService.getOutlets();
        return {
            success: true,
            data,
        };
    }
};
exports.TrainingReportController = TrainingReportController;
__decorate([
    (0, common_1.Get)('overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Get aggregated training report analytics and KPI metrics' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('outletId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TrainingReportController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('records'),
    (0, swagger_1.ApiOperation)({ summary: 'Get normalized and filterable training participation records' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('type')),
    __param(3, (0, common_1.Query)('isPassed')),
    __param(4, (0, common_1.Query)('outletId')),
    __param(5, (0, common_1.Query)('search')),
    __param(6, (0, common_1.Query)('limit')),
    __param(7, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TrainingReportController.prototype, "getRecords", null);
__decorate([
    (0, common_1.Get)('outlets'),
    (0, swagger_1.ApiOperation)({ summary: 'Get outlets list for training report filter' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrainingReportController.prototype, "getOutlets", null);
exports.TrainingReportController = TrainingReportController = __decorate([
    (0, common_1.Controller)('training-report'),
    (0, swagger_1.ApiTags)('training-report'),
    __metadata("design:paramtypes", [training_report_service_1.TrainingReportService])
], TrainingReportController);
//# sourceMappingURL=training-report.controller.js.map