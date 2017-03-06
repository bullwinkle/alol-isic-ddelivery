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
import { BrowserModule } from '@angular/platform-browser';
import { AppSettings } from "./app.settings";
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppRouterModule } from './app.router';
import { PersonalAreaModule } from './personal-area/personal-area.module';
import { FeedModule } from './feed/feed.module';
import { ChatsModule } from './chats/chats.module';
import { AppComponent } from './app.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { RootPageComponent } from './root-page/root-page.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { WsnComponent } from './wsn/wsn.component';
export var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                AppComponent,
                RootPageComponent,
                MainMenuComponent,
                NotFoundComponent,
                WsnComponent,
                RootPageComponent
            ],
            imports: [
                BrowserModule,
                CoreModule,
                SharedModule,
                AppRouterModule,
                PersonalAreaModule,
                FeedModule,
                ChatsModule
            ],
            providers: [
                {
                    provide: "APP_SETTINGS",
                    useClass: AppSettings
                }
            ],
            bootstrap: [AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/app.module.js.map