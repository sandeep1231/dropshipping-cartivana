import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyOrdersUserComponent } from './my-orders-user.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('MyOrdersUserComponent', () => {
  let component: MyOrdersUserComponent;
  let fixture: ComponentFixture<MyOrdersUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyOrdersUserComponent],
      imports: [HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();
    fixture = TestBed.createComponent(MyOrdersUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
