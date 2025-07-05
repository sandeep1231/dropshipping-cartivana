import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckoutComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule]
    }).compileComponents();
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty form initially', () => {
    expect(component.form.name).toBe('');
    expect(component.form.address).toBe('');
  });

  it('should not place order with incomplete form', () => {
    spyOn(window, 'alert');
    component.placeOrder();
    expect(window.alert).toHaveBeenCalledWith('Please fill all fields');
  });
});
