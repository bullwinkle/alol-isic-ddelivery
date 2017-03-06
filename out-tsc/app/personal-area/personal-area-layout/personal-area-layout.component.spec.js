import { async, TestBed } from '@angular/core/testing';
import { PersonalAreaLayoutComponent } from './personal-area-layout.component';
describe('PersonalAreaLayoutComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [PersonalAreaLayoutComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(PersonalAreaLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/personal-area/personal-area-layout/personal-area-layout.component.spec.js.map