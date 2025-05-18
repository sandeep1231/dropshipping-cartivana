import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardOverviewComponent } from './admin-dashboard-overview.component';

describe('AdminDashboardOverviewComponent', () => {
  let component: AdminDashboardOverviewComponent;
  let fixture: ComponentFixture<AdminDashboardOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDashboardOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
