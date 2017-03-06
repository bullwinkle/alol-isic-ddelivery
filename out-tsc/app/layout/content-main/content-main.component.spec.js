import { async, TestBed } from '@angular/core/testing';
import { ContentMainComponent } from './content-main.component';
describe('ContentMainComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [ContentMainComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(ContentMainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/layout/content-main/content-main.component.spec.js.map