var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ControlSwitchComponent } from './control-switch/control-switch.component';
import { ControlInputComponent } from './control-input/control-input.component';
import { ControlCheckboxComponent } from './control-checkbox/control-checkbox.component';
import { ControlRadioButtonComponent } from './control-radio-button/control-radio-button.component';
import { ControlButtonComponent } from './control-button/control-button.component';
export var UiModule = (function () {
    function UiModule() {
    }
    UiModule = __decorate([
        NgModule({
            imports: [
                CommonModule,
                SharedModule
            ],
            declarations: [
                ControlSwitchComponent,
                ControlInputComponent,
                ControlCheckboxComponent,
                ControlRadioButtonComponent,
                ControlButtonComponent
            ],
            exports: [
                ControlSwitchComponent,
                ControlInputComponent,
                ControlCheckboxComponent,
                ControlRadioButtonComponent,
                ControlButtonComponent
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], UiModule);
    return UiModule;
}());
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/ui/ui.module.js.map