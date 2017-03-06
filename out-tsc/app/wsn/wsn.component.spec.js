import { async, TestBed } from '@angular/core/testing';
import { WsnComponent } from './wsn.component';
describe('WsnComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [WsnComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(WsnComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/wsn/wsn.component.spec.js.map