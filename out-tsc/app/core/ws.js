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
;
;
var generateRequestId = function () { return ('' + Math.random()).replace('0.', ''); };
var deviceToken = generateRequestId();
var REQUESTS = {};
export var Ws = (function () {
    function Ws(
        // public wsApi: WsApiService,
        // public ws: WsService,
        // public http: Http,
        settings) {
        this.settings = settings;
        this.socket = null;
        this.events = [];
        this.io = io;
        this.REQUESTS = REQUESTS;
    }
    Object.defineProperty(Ws.prototype, "connected", {
        get: function () {
            return Boolean(this.socket && this.socket.connected);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Ws.prototype, "time", {
        get: function () {
            var d = new Date();
            return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + " " + d.getMilliseconds();
        },
        enumerable: true,
        configurable: true
    });
    Ws.prototype.connect = function (url) {
        if (url === void 0) { url = this.settings.wsConnectUrl; }
        if (!this.subject) {
            this.subject = this.create(url);
        }
        return this.subject;
    };
    Ws.prototype.create = function (url) {
        var _this = this;
        var socket = this.socket = io.connect(this.settings.wsConnectUrl, {
            'path': '/websocket',
            'transports': ['websocket', 'polling']
        });
        var observable = Observable.create(function (observer) {
            socket.on('response', function (data) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var response = JSON.parse(data);
                console.info('[WS] <- response', response);
                _this.parseResponse(response, observer);
            });
            socket.on('event', function (data) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var event = JSON.parse(data);
                console.info('[WS] <- event', event);
                _this.parseEvent(event, observer);
            });
            socket.on('error', function (data) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var error = JSON.parse(data);
                console.warn('[WS] <- error', error);
                _this.parseError(error, observer);
            });
            socket.on('ping', function () {
                console.info('[WS] -> ping', _this.time);
                observer.next(event);
            });
            socket.on('pong', function (delay) {
                console.info('[WS] <- pong', _this.time, delay);
                observer.next(event);
            });
            socket.on('disconnect', function (reason) {
                console.log('[WS] disconnect', reason);
                observer.complete();
            });
            socket.on('connect', function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                console.info('[WS] connected', args);
            });
            socket.on('reconnect_failed', function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                console.info('[WS] reconnect_failed', args);
                observer.complete();
            });
            socket.on('reconnect_attempt', function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                console.info('[WS] reconnect_attempt', args);
            });
            socket.on('reconnect_error', function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                console.info('[WS] reconnect_error', args);
            });
            return socket.disconnect.bind(socket);
        });
        var observer = {
            next: function (data) {
                if (socket) {
                    console.log('[WS] -> request', data);
                    socket.emit('request', data);
                }
            },
        };
        observable.subscribe(function (res) { return console.info('[WS] subscription res', res); }, function (err) { return console.warn('[WS] subscription error', err); });
        return Subject.create(observer, observable);
    };
    Object.defineProperty(Ws.prototype, "canSend", {
        get: function () {
            return !!this.subject;
        },
        enumerable: true,
        configurable: true
    });
    // request (data=this.defaultData):Promise<any> {
    Ws.prototype.request = function (request) {
        var _this = this;
        request.request_id || (request.request_id = generateRequestId());
        var requestId = request.request_id;
        var requestDeferedPromise = (function () {
            var resolve, reject;
            var promise = new Promise(function (_resolve, _reject) {
                resolve = _resolve;
                reject = _reject;
            });
            return { promise: promise, resolve: resolve, reject: reject };
        })();
        var _request = {
            request: request,
            promise: requestDeferedPromise,
            replay: function () {
                return _this.request(request);
            },
            cancel: function () {
                _request.canceled = true;
                return requestDeferedPromise.reject(Ws.ERROR_TYPES.CANCEL);
            },
            wasSent: false,
            hasResponse: false,
            canceled: false
        };
        if (this.canSend) {
            this.subject.next(request);
            _request.wasSent = true;
        }
        REQUESTS[requestId] = _request;
        // return requestDeferedPromise.promise;
        return Observable.fromPromise(requestDeferedPromise.promise);
    };
    Ws.prototype.parseResponse = function (response, observer) {
        console.info('[WS] <- response', response);
        var userId = response.user_id;
        var requestId = response.request_id;
        console.info(requestId, REQUESTS);
        if (REQUESTS[requestId]) {
            REQUESTS[requestId].promise.resolve(response);
            REQUESTS[requestId].hasResponse = true;
        }
        observer.next(response);
    };
    Ws.prototype.parseEvent = function (event, observer) {
        console.info('[WS] <- event', event);
        observer.next(event);
    };
    Ws.prototype.parseError = function (error, observer) {
        console.warn('[WS] <- error', error);
        observer.error(event);
    };
    Ws.ERROR_TYPES = {
        CANCEL: 'cancel'
    };
    Ws = __decorate([
        Injectable(),
        __param(0, Inject('APP_SETTINGS')), 
        __metadata('design:paramtypes', [Object])
    ], Ws);
    return Ws;
}());
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/core/ws.js.map