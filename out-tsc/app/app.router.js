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
import { RouterModule } from '@angular/router';
import { WsnComponent } from './wsn/wsn.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PersonalAreaLayoutComponent } from './personal-area/personal-area-layout/personal-area-layout.component';
import { FeedLayoutComponent } from './feed/feed-layout/feed-layout.component';
import { ChatsLayoutComponent } from './chats/chats-layout/chats-layout.component';
import { PaletteComponent } from './shared/palette/palette.component';
var appRoutes = [
    {
        path: '',
        // component: RootPageComponent
        redirectTo: 'personal-area',
        pathMatch: 'full'
    },
    {
        path: 'personal-area',
        component: PersonalAreaLayoutComponent
    },
    {
        path: 'feed',
        component: FeedLayoutComponent
    },
    {
        path: 'chats',
        component: ChatsLayoutComponent
    },
    {
        path: 'wsn',
        component: WsnComponent
    },
    {
        path: 'palette',
        component: PaletteComponent
    },
    {
        path: '**',
        component: NotFoundComponent
    },
];
export var AppRouterModule = (function () {
    function AppRouterModule() {
    }
    AppRouterModule = __decorate([
        NgModule({
            imports: [
                RouterModule.forRoot(appRoutes)
            ],
            exports: [
                RouterModule
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppRouterModule);
    return AppRouterModule;
}());
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/app.router.js.map