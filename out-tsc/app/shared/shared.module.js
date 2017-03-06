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
import { HttpModule, Http, XHRBackend, BaseRequestOptions } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WsApiService } from './ws-api.service';
import { WsService } from './ws.service';
import { WsConnectionBackend } from './ws.backend';
import { HttpFactory } from './http.factory';
import { WsFactory } from './ws.factory';
var importsAndExports = [
    CommonModule
];
export var SharedModule = (function () {
    function SharedModule() {
    }
    SharedModule = __decorate([
        NgModule({
            imports: importsAndExports.slice(),
            exports: importsAndExports.concat([FormsModule, HttpModule]),
            declarations: [],
            providers: [
                WsApiService,
                BaseRequestOptions,
                WsConnectionBackend,
                {
                    provide: Http,
                    useFactory: HttpFactory,
                    deps: [XHRBackend, BaseRequestOptions],
                },
                {
                    provide: WsService,
                    useFactory: WsFactory,
                    deps: [WsConnectionBackend, BaseRequestOptions],
                }
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], SharedModule);
    return SharedModule;
}());
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/shared/shared.module.js.map