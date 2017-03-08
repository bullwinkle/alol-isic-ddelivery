var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
export var PaletteComponent = (function () {
    function PaletteComponent() {
        this.selected = null;
        this.select = [
            { value: 'steak-0', title: 'Steak' },
            { value: 'pizza-1', title: 'Pizza' },
            { value: 'tacos-2', title: 'Tacos' }
        ];
    }
    PaletteComponent.prototype.ngOnInit = function () {
    };
    PaletteComponent = __decorate([
        Component({
            selector: 'app-palette',
            templateUrl: './palette.component.html',
            styleUrls: ['./palette.component.scss']
        }), 
        __metadata('design:paramtypes', [])
    ], PaletteComponent);
    return PaletteComponent;
}());
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/shared/palette/palette.component.js.map