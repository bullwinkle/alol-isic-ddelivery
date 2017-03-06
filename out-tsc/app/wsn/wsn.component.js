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
import { Component, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { WsApiService } from '../shared/ws-api.service';
import { Ws } from '../core/ws';
var generateRequestId = function () { return ('' + Math.random()).replace('0.', ''); };
var deviceToken = generateRequestId();
var requests = {};
export var WsnComponent = (function () {
    function WsnComponent(wsApi, ws, http, settings) {
        this.wsApi = wsApi;
        this.ws = ws;
        this.http = http;
        this.settings = settings;
        this.socket = null;
        this.requests = [];
        this.events = [];
        this.messages = [];
        this.wsConnectionState = false;
        this.isTyping = false;
        this.myTyping = 0;
        this.otherTyping = 0;
        this.badge = '';
        this.API_URL = "http://strizhapp.ru";
        this.currentUserId = 0;
        this.userPhone = "79215820458";
        this.authCode = "";
        this.dialogId = '';
        this.messageText = "";
        this.readMessageId = 0;
        this.path = "";
        this.method = "GET";
        this.bodyParams = "{}";
        this.queryParams = "{}";
        window['ws'] = this.ws;
        console.log('settings', this.settings);
    }
    WsnComponent.prototype.ngOnInit = function () {
        var _this = this;
        setInterval(function () {
            if (Date.now() - 4000 < _this.otherTyping) {
                _this.isTyping = true;
            }
            else {
                _this.isTyping = false;
            }
        }, 1000);
        setInterval(function () {
            if (Date.now() - 4000 < _this.myTyping) {
                _this.doRequest("api/dialog/" + _this.dialogId, 'PUT', {}, { "typing": true });
            }
        }, 3000);
        if (window.location.hash.substr(1) != '') {
            this.API_URL = window.location.hash.substr(1);
        }
    };
    WsnComponent.prototype.onLogoutClick = function () {
        var _this = this;
        var reqId = generateRequestId();
        this.addRequest(reqId, { "path": "api/auth", "method": "DELETE" });
        this.http.delete("/auth").subscribe(function (res) {
            var data = res.json();
            _this.currentUserId = data.data.user_id;
            _this.addResponse(reqId, data);
        }, function (err) { return console.warn('[request error]', err); });
    };
    WsnComponent.prototype.onSessionCheckClick = function () {
        var _this = this;
        var reqId = generateRequestId();
        this.addRequest(reqId, { "path": "api/auth", "method": "GET" });
        this.http.get('/auth').subscribe(function (res) {
            var data = res.json();
            _this.currentUserId = data.data.user_id;
            _this.addResponse(reqId, data);
            if (data.data.user_id > 0) {
                _this.socketConnect();
            }
        }, function (err) { return console.warn('[request error]', err); });
    };
    WsnComponent.prototype.onCodeRequestClick = function () {
        var _this = this;
        var reqId = generateRequestId();
        this.addRequest(reqId, { "path": "api/code", "method": "POST" });
        var data = {
            "phone": this.userPhone,
            "device_type": "web",
            "device_token": deviceToken
        };
        this.http.post('/code', data).subscribe(function (res) {
            var resData = res.json();
            console.log(resData);
            _this.addResponse(reqId, data);
        }, function (err) { console.warn('[request] error', err); });
    };
    WsnComponent.prototype.onCodeAuthClick = function () {
        var _this = this;
        var reqId = generateRequestId();
        this.addRequest(reqId, { "path": "api/auth", "method": "POST" });
        var data = {
            "phone": this.userPhone,
            "device_type": "web",
            "device_token": deviceToken,
            "code": this.authCode,
            "type": "code",
            "system_version": "10.2.2",
            "application": "com.app",
            "application_version": "0.0.1"
        };
        this.http.post('/auth', data).subscribe(function (res) {
            var data = res.json();
            _this.currentUserId = data.data.user_id;
            _this.addResponse(reqId, data);
            _this.socketConnect();
        }, function (err) { console.warn('[request] error', err); });
    };
    WsnComponent.prototype.onSendRequestClick = function () {
        var valid = false;
        try {
            var body_params = JSON.parse(this.bodyParams);
            var query_params = JSON.parse(this.queryParams);
            valid = true;
        }
        catch (err) {
            console.warn('invalid json', err);
        }
        var path = this.path;
        var method = this.method;
        if (valid)
            this.doRequest(path, method, query_params, body_params);
    };
    WsnComponent.prototype.onReadButtonClick = function () {
        var messageId = this.readMessageId;
        this.doRequest("api/dialog/" + this.dialogId, 'PUT', {}, { last_read_message_id: messageId });
    };
    WsnComponent.prototype.onSendButtonClick = function () {
        this.doRequest('api/message', 'POST', {}, {
            "message": this.messageText,
            "dialog_id": this.dialogId
        });
        this.messageText = '';
    };
    WsnComponent.prototype.onChatTextKeyup = function () {
        this.myTyping = Date.now();
    };
    WsnComponent.prototype.socketConnect = function () {
        var _this = this;
        this.ws.connect();
        this.socket = this.ws.socket;
        this.socket.on('response', function (data) {
            var response = JSON.parse(data);
            console.log(response);
            _this.addResponse(response.request_id, response);
            if (requests[response.request_id]) {
                var callback = requests[response.request_id];
                callback(response);
            }
        });
        this.socket.on('event', function (data) {
            console.log('[event]', data);
            _this.eventProcessor(data);
            _this.addEvent(data);
        });
        this.socket.on('disconnect', function () {
            console.log('disconnect');
        });
        this.wsConnectionState = 'connected';
        this.checkDialog();
    };
    WsnComponent.prototype.addRequest = function (requestId, data) {
        this.requests.push({ id: requestId, options: data });
    };
    WsnComponent.prototype.addResponse = function (requestId, data) {
        var currentRequest = this.requests.filter(function (el) { return el.id == requestId; })[0];
        if (currentRequest)
            currentRequest['response'] = data;
    };
    WsnComponent.prototype.addEvent = function (data) {
        this.events.push({ event: data });
    };
    WsnComponent.prototype.addMessage = function (message) {
        setTimeout(function () {
            var $messagesEl = document.getElementById('#messages');
            if ($messagesEl) {
                $messagesEl.scrollTop = $messagesEl.scrollHeight;
            }
        });
        this.messages.push(message);
    };
    WsnComponent.prototype.doRequest = function (path, method, query, body, callback) {
        var requestId = generateRequestId();
        requests[requestId] = callback;
        var payloadData = {
            "path": path,
            "method": method,
            "body_params": body,
            "query_params": query,
            "request_id": requestId
        };
        if (this.ws && this.ws.subject) {
            // this.ws.request(payloadData)
            //   .then((res)=>{console.warn('wsn res',res)})
            //   .catch((err)=>{console.warn('wsn err',err)})
            this.ws.request(payloadData)
                .subscribe(function (res) {
                var el = document.getElementById(res.request_id);
                if (!el)
                    return false;
                el.style.backgroundColor = 'green';
            }, function (err) { console.warn('wsn err', err); });
            this.addRequest(requestId, payloadData);
        }
    };
    WsnComponent.prototype.showBadge = function (badge) {
        this.badge = String(badge);
    };
    WsnComponent.prototype.checkDialog = function () {
        var _this = this;
        this.doRequest('api/dialog', 'GET', {}, {}, function (data) {
            _this.dialogId = data.id;
            _this.doRequest('api/message', 'GET', {
                filter: { dialog_id: _this.dialogId },
                order: { id: 'desc' },
                page_size: 30,
                reverse: true
            }, {}, function (data) {
                (_a = _this.messages).push.apply(_a, data.data.message);
                var _a;
            });
        });
    };
    WsnComponent.prototype.eventProcessor = function (event) {
        console.info('[this.eventProcessor]', event);
        switch (event.type) {
            case 'message':
                this.addMessage(event.data);
                if (event.data.user_id != this.currentUserId) {
                    var messageId = this.readMessageId;
                    console.log(messageId, event.data.id, messageId > event.data.id);
                    if (messageId < event.data.id) {
                        this.readMessageId = event.data.id;
                    }
                }
                break;
            case 'dialog_badge':
                this.showBadge(event.data.unread_message_count);
                break;
            case 'typing':
                this.otherTyping = Date.now();
                break;
        }
    };
    WsnComponent = __decorate([
        Component({
            selector: 'app-wsn',
            templateUrl: './wsn.component.html',
            styleUrls: ['./wsn.component.scss']
        }),
        __param(3, Inject('APP_SETTINGS')), 
        __metadata('design:paramtypes', [WsApiService, Ws, Http, Object])
    ], WsnComponent);
    return WsnComponent;
}());
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/wsn/wsn.component.js.map