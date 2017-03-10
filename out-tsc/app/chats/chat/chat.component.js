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
var _a = new Array(10).fill('').reduce(function (_a) {
    var messages = _a[0], promos = _a[1];
    messages.push({
        avatar: 'assets/fake/ava.jpg',
        name: "Смирнова Надежда",
        phone: "+7 (923) 564-34-21",
        id: Math.random().toString().replace('0.', '')
    });
    if (promos.length < 2)
        promos.push({
            avatar: 'assets/fake/ava.jpg',
            name: "Смирнова Надежда",
            phone: "+7 (923) 564-34-21",
            id: Math.random().toString().replace('0.', '')
        });
    return [messages, promos];
}, [[], []]), fakeMessages = _a[0], fakePromoList = _a[1];
export var ChatComponent = (function () {
    function ChatComponent() {
        this.chatId = 0;
        this.messagesList = fakeMessages;
        this.promoList = fakePromoList;
    }
    ChatComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], ChatComponent.prototype, "chatId", void 0);
    ChatComponent = __decorate([
        Component({
            selector: 'app-chat',
            templateUrl: './chat.component.html',
            styleUrls: ['./chat.component.scss']
        }), 
        __metadata('design:paramtypes', [])
    ], ChatComponent);
    return ChatComponent;
}());
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/chats/chat/chat.component.js.map