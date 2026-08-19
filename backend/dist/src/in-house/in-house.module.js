"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InHouseModule = void 0;
const common_1 = require("@nestjs/common");
const in_house_controller_1 = require("./in-house.controller");
const in_house_service_1 = require("./in-house.service");
let InHouseModule = class InHouseModule {
};
exports.InHouseModule = InHouseModule;
exports.InHouseModule = InHouseModule = __decorate([
    (0, common_1.Module)({
        controllers: [in_house_controller_1.InHouseController],
        providers: [in_house_service_1.InHouseService],
        exports: [in_house_service_1.InHouseService],
    })
], InHouseModule);
//# sourceMappingURL=in-house.module.js.map