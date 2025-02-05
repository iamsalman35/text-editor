import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceFindReplaceComponent } from './service-find-replace.component';

describe('ServiceFindReplaceComponent', () => {
  let component: ServiceFindReplaceComponent;
  let fixture: ComponentFixture<ServiceFindReplaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceFindReplaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceFindReplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
