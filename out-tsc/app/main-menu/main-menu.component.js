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
export var MainMenuComponent = (function () {
    function MainMenuComponent() {
        this.links = [
            {
                title: 'Личный кабинет',
                path: '/personal-area'
            },
            {
                title: 'Лента',
                path: '/feed'
            },
            {
                title: 'Диалоги',
                path: '/chats'
            },
            {
                title: 'Wsn',
                path: '/wsn'
            },
            {
                title: 'Palette',
                path: '/palette'
            },
            {
                title: '404',
                path: '/404'
            },
        ];
    }
    MainMenuComponent.prototype.ngOnInit = function () {
    };
    MainMenuComponent = __decorate([
        Component({
            selector: 'app-main-menu',
            templateUrl: './main-menu.component.html',
            styleUrls: ['main-menu.component.scss']
        }), 
        __metadata('design:paramtypes', [])
    ], MainMenuComponent);
    return MainMenuComponent;
}());
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/main-menu/main-menu.component.js.map