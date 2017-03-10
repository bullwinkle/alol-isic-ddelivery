var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
var fakeChatId = Math.floor(Math.random() * 1000);
export var ChatsLayoutComponent = (function () {
    function ChatsLayoutComponent(el) {
        this.el = el;
        this.chatId = fakeChatId;
        this.height = '100%';
    }
    ChatsLayoutComponent.prototype.ngOnInit = function () {
        this.updateHeight();
        Observable.fromEvent(window, "resize")
            .debounce(function (x) { return Observable.timer(100); })
            .subscribe(this.updateHeight.bind(this));
    };
    ChatsLayoutComponent.prototype.updateHeight = function () {
        console.warn('updateHeight');
        var height = document.documentElement.clientHeight - this.el.nativeElement.offsetTop - 40;
        this.height = height + "px";
    };
    ChatsLayoutComponent = __decorate([
        Component({
            selector: 'app-chats-layout',
            templateUrl: './chats-layout.component.html',
            styleUrls: ['./chats-layout.component.scss']
        }), 
        __metadata('design:paramtypes', [ElementRef])
    ], ChatsLayoutComponent);
    return ChatsLayoutComponent;
}());
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/chats/chats-layout/chats-layout.component.js.map