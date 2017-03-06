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
import { Location } from '@angular/common';
import { Response, Headers, BaseRequestOptions, BaseResponseOptions } from "@angular/http";
var merge = require("lodash/merge");
import { AppSettings } from '../app.settings';
export var ApiService = (function () {
    function ApiService() {
    }
    ApiService.buildUrl = function (relativeUrl) {
        var urlParts = [];
        urlParts.push(this.settings.baseUrl, this.settings.apiUrl, relativeUrl);
        var resultUrl = urlParts.reduce(function (resultUrl, part, i) {
            return Location.joinWithSlash(resultUrl, part);
        }, '');
        return Location.stripTrailingSlash(resultUrl);
    };
    ApiService.buildResponse = function (request) {
        var _this = this;
        return new Response({
            body: {
                fromApiService: {
                    hello: 'world'
                }
            },
            status: 200,
            headers: new Headers(),
            url: request.url,
            merge: function (options) { return _this.buildResponseOptions(options); }
        });
    };
    ApiService.buildRequest = function (options) {
    };
    ApiService.buildRequestOptions = function (options) {
        return merge(BaseRequestOptions, options);
    };
    ApiService.buildResponseOptions = function (options) {
        return merge(BaseResponseOptions, options);
    };
    ApiService.buildOptions = function (options) {
        return options;
    };
    ApiService.settings = new AppSettings();
    ApiService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [])
    ], ApiService);
    return ApiService;
}());
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/shared/api.service.js.map