var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
export var ControlCheckboxComponent = (function () {
    function ControlCheckboxComponent() {
        this.labelPosition = "left";
    }
    ControlCheckboxComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], ControlCheckboxComponent.prototype, "labelPosition", void 0);
    ControlCheckboxComponent = __decorate([
        Component({
            selector: 'app-control-checkbox',
            templateUrl: './control-checkbox.component.html',
            styleUrls: ['./control-checkbox.component.scss']
        }), 
        __metadata('design:paramtypes', [])
    ], ControlCheckboxComponent);
    return ControlCheckboxComponent;
}());
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/ui/control-checkbox/control-checkbox.component.js.map