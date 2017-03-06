import { async, TestBed } from '@angular/core/testing';
import { ChatsLayoutComponent } from './chats-layout.component';
describe('ChatsLayoutComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [ChatsLayoutComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(ChatsLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/chats/chats-layout/chats-layout.component.spec.js.map