import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyOrderDetailsUserComponent } from './my-order-details-user.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MyOrderDetailsUserComponent', () => {
  let component: MyOrderDetailsUserComponent;
  let fixture: ComponentFixture<MyOrderDetailsUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyOrderDetailsUserComponent],
      imports: [RouterTestingModule, HttpClientTestingModule]
    }).compileComponents();
    fixture = TestBed.createComponent(MyOrderDetailsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
