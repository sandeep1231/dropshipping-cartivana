import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderHistoryComponent } from './order-history.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';

describe('OrderHistoryComponent', () => {
  let component: OrderHistoryComponent;
  let fixture: ComponentFixture<OrderHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, CommonModule, OrderHistoryComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(OrderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
