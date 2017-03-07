var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Http, ConnectionBackend, RequestOptions, Request } from '@angular/http';
import { ApiService } from "./api.service";
export var HttpService = (function (_super) {
    __extends(HttpService, _super);
    function HttpService(_backend, _defaultOptions) {
        _super.call(this, _backend, _defaultOptions);
    }
    HttpService.prototype.buildUrl = function (relativeUrl) {
        return ApiService.buildUrl(relativeUrl);
    };
    // private buildOptions (options:any):RequestOptionsArgs {
    //   return ApiService.buildOptions(options);
    // }
    HttpService.prototype.request = function (url, options) {
        if (url instanceof Request) {
            url.url = this.buildUrl(url.url);
        }
        else if (typeof url === 'string') {
            url = this.buildUrl(url);
        }
        console.info("[" + this.constructor.name + ".request]", url, options);
        return _super.prototype.request.call(this, url, options);
    };
    HttpService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [ConnectionBackend, RequestOptions])
    ], HttpService);
    return HttpService;
}(Http));
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/shared/http.service.js.map