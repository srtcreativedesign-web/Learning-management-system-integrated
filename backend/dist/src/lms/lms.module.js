"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LmsModule = void 0;
const common_1 = require("@nestjs/common");
const course_controller_1 = require("./course.controller");
const course_service_1 = require("./course.service");
const quiz_controller_1 = require("./quiz.controller");
const quiz_service_1 = require("./quiz.service");
const certificate_template_controller_1 = require("./certificate-template.controller");
const certificate_template_service_1 = require("./certificate-template.service");
const ai_service_1 = require("./ai.service");
let LmsModule = class LmsModule {
};
exports.LmsModule = LmsModule;
exports.LmsModule = LmsModule = __decorate([
    (0, common_1.Module)({
        controllers: [course_controller_1.CourseController, quiz_controller_1.QuizController, certificate_template_controller_1.CertificateTemplateController],
        providers: [course_service_1.CourseService, quiz_service_1.QuizService, certificate_template_service_1.CertificateTemplateService, ai_service_1.AiService]
    })
], LmsModule);
//# sourceMappingURL=lms.module.js.map