var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, Inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as io from "socket.io-client";
var generateRequestId = function () { return ('' + Math.random()).replace('0.', ''); };
var deviceToken = generateRequestId();
var requests = {};
export var Ws = (function () {
    function Ws(
        // public wsApi: WsApiService,
        // public ws: WsService,
        // public http: Http,
        settings) {
        this.settings = settings;
        this.socket = null;
        this.requests = [];
        this.events = [];
        // window['ws'] = new Ws();
    }
    Object.defineProperty(Ws.prototype, "connected", {
        get: function () {
            return Boolean(this.socket && this.socket.connected);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Ws.prototype.connect = function (url) {
        if (!this.subject) {
            this.subject = this.create(url);
        }
        return this.subject;
    };
    Ws.prototype.create = function (url) {
        var socket = this.socket = io.connect(this.settings.wsConnectUrl, { 'transports': ['websocket', 'polling'], 'path': '/websocket' });
        var observable = Observable.create(function (observer) {
            socket.on('response', function (data) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var response = JSON.parse(data);
                console.info('[WS] response', data, args, response);
                observer.next(response);
            });
            socket.on('error', function (data) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var error = JSON.parse(data);
                console.warn('[WS] error', data, args, error);
                observer.error(error);
            });
            socket.on('event', function (data) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var event = JSON.parse(data);
                console.info('[WS] event', data, args, event);
                observer.next(event);
            });
            socket.on('disconnect', function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                console.log('[WS] disconnect', args);
                observer.complete();
            });
            return socket.disconnect.bind(socket);
        });
        var observer = {
            next: function (data) {
                if (socket && socket.connected) {
                    socket.emit('request', data);
                }
            },
        };
        return Subject.create(observer, observable);
    };
    Ws.prototype.makeRequest = function (data) {
        if (data === void 0) { data = {}; }
        data = { "path": "api/message", "method": "GET", "body_params": {}, "query_params": { "filter": {}, "order": { "id": "desc" }, "page_size": 30, "reverse": true }, "request_id": generateRequestId() };
        if (this.subject)
            this.subject.next(data);
    };
    Ws = __decorate([
        Injectable(),
        __param(0, Inject('APP_SETTINGS')), 
        __metadata('design:paramtypes', [Object])
    ], Ws);
    return Ws;
}());
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/shared/ws.js.map