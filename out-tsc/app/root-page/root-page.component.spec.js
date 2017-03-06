import { async, TestBed } from '@angular/core/testing';
import { RootPageComponent } from './root-page.component';
describe('RootPageComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [RootPageComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(RootPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/root-page/root-page.component.spec.js.map