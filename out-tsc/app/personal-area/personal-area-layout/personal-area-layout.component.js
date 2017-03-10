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
var fakeContacts = new Array(10).fill('').map(function (el) {
    return {
        avatar: 'assets/fake/ava.jpg',
        name: "Смирнова Надежда",
        phone: "+7 (923) 564-34-21",
        id: Math.random().toString().replace('0.', '')
    };
});
export var PersonalAreaLayoutComponent = (function () {
    function PersonalAreaLayoutComponent() {
        this.contacts = fakeContacts;
    }
    PersonalAreaLayoutComponent.prototype.ngOnInit = function () {
    };
    PersonalAreaLayoutComponent = __decorate([
        Component({
            selector: 'app-personal-area-layout',
            templateUrl: './personal-area-layout.component.html',
            styleUrls: ['./personal-area-layout.component.scss']
        }), 
        __metadata('design:paramtypes', [])
    ], PersonalAreaLayoutComponent);
    return PersonalAreaLayoutComponent;
}());
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/personal-area/personal-area-layout/personal-area-layout.component.js.map