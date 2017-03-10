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
var fakeChats = new Array(20).fill('').reduce(function (_a, el, i) {
    var chats = _a[0];
    chats.push({
        firstName: 'Надежда',
        lastName: 'Смирнова',
        time: Date.now(),
        imageUrl: "",
        unreadAmount: 3
    });
    return [chats];
}, [[]])[0];
export var ChatListComponent = (function () {
    function ChatListComponent() {
        this.items = fakeChats;
    }
    ChatListComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        Input('items'), 
        __metadata('design:type', Object)
    ], ChatListComponent.prototype, "items", void 0);
    ChatListComponent = __decorate([
        Component({
            selector: 'app-chat-list',
            templateUrl: './chat-list.component.html',
            styleUrls: ['./chat-list.component.scss']
        }), 
        __metadata('design:paramtypes', [])
    ], ChatListComponent);
    return ChatListComponent;
}());
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/chats/chat-list/chat-list.component.js.map