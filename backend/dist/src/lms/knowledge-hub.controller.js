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
exports.KnowledgeHubController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const course_service_1 = require("./course.service");
let KnowledgeHubController = class KnowledgeHubController {
    courseService;
    constructor(courseService) {
        this.courseService = courseService;
    }
    async getAllCourses() {
        return this.courseService.findAll();
    }
};
exports.KnowledgeHubController = KnowledgeHubController;
__decorate([
    (0, common_1.Get)('courses'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all courses for Knowledge Hub (Mobile)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all courses.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KnowledgeHubController.prototype, "getAllCourses", null);
exports.KnowledgeHubController = KnowledgeHubController = __decorate([
    (0, swagger_1.ApiTags)('Knowledge Hub'),
    (0, common_1.Controller)('api/knowledge-hub'),
    __metadata("design:paramtypes", [course_service_1.CourseService])
], KnowledgeHubController);
//# sourceMappingURL=knowledge-hub.controller.js.map