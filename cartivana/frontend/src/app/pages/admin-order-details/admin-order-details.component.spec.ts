import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminOrderDetailsComponent } from './admin-order-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdminOrderDetailsComponent', () => {
  let component: AdminOrderDetailsComponent;
  let fixture: ComponentFixture<AdminOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminOrderDetailsComponent],
      imports: [RouterTestingModule, HttpClientTestingModule]
    }).compileComponents();
    fixture = TestBed.createComponent(AdminOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
