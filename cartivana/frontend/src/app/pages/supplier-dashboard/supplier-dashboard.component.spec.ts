import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupplierDashboardComponent } from './supplier-dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';

describe('SupplierDashboardComponent', () => {
  let component: SupplierDashboardComponent;
  let fixture: ComponentFixture<SupplierDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupplierDashboardComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, NgChartsModule, FormsModule]
    }).compileComponents();
    fixture = TestBed.createComponent(SupplierDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty products initially', () => {
    expect(component.myProducts.length).toBe(0);
  });
});
