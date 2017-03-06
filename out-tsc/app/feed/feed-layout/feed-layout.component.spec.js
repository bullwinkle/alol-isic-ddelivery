import { async, TestBed } from '@angular/core/testing';
import { FeedLayoutComponent } from './feed-layout.component';
describe('FeedLayoutComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [FeedLayoutComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(FeedLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/feed/feed-layout/feed-layout.component.spec.js.map