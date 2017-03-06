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
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
export var NotificationService = (function () {
    function NotificationService(snackBar) {
        this.snackBar = snackBar;
        this.defaultSnackConfig = Object.assign(new MdSnackBarConfig(), {
            duration: 6000
        });
        this.defaultSnackOptions = {
            data: {},
            action: 'ok',
            config: this.defaultSnackConfig
        };
    }
    NotificationService.prototype.error = function (options) {
        return this.notify(options);
    };
    NotificationService.prototype.log = function (options) {
        return this.notify(options);
    };
    NotificationService.prototype.warn = function (options) {
        return this.notify(options);
    };
    NotificationService.prototype.notify = function (options) {
        console.info("[" + this.constructor.name + ".notify]");
        options = this.normalizeOptions(options);
        return this.snackBar.open(options.data, options.action, options.config);
    };
    NotificationService.prototype.normalizeOptions = function (options) {
        options.data = (function () {
            switch (typeof options.data) {
                case 'object':
                    return JSON.stringify(options.data);
                case 'string':
                    return String(options.data);
            }
        })();
        return Object.assign({}, this.defaultSnackOptions, options);
    };
    NotificationService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [MdSnackBar])
    ], NotificationService);
    return NotificationService;
}());
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/shared/notification.service.js.map