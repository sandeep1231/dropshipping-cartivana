import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { AppComponent } from './app.component';

// Layout & Shared
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

// Pages
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
// import { AboutComponent } from './pages/about/about.component';
// import { ContactComponent } from './pages/contact/contact.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { SupplierDashboardComponent } from './pages/supplier-dashboard/supplier-dashboard.component';
import { RoleGuard } from './guards/role.guard';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { NgChartsModule } from 'ng2-charts';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { AdminDashboardOverviewComponent } from './pages/admin-dashboard-overview/admin-dashboard-overview.component';
import { AdminOrderDetailsComponent } from './pages/admin-order-details/admin-order-details.component';
import { AdminOrdersComponent } from './pages/admin-orders/admin-orders.component';
import { AuthGuard } from './guards/auth.guard';
import { MyOrdersUserComponent } from './pages/my-orders-user/my-orders-user.component';
import { MyOrderDetailsUserComponent } from './pages/my-order-details-user/my-order-details-user.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    ProductsComponent,
    ProductDetailComponent,
    CartComponent,
    CheckoutComponent,
    LoginComponent,
    RegisterComponent,
    SupplierDashboardComponent,
    AdminDashboardComponent,
    AdminUsersComponent,
    AdminDashboardOverviewComponent,
    AdminOrderDetailsComponent,
    AdminOrdersComponent,
    MyOrdersUserComponent,
    MyOrderDetailsUserComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'product/:id', component: ProductDetailComponent },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'supplier', component: SupplierDashboardComponent, canActivate: [RoleGuard], data: { role: 'supplier' } },
      { path: 'admin', component: AdminDashboardComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
      {
              path: 'admin/users',
              component: AdminUsersComponent,
              canActivate: [RoleGuard],
              data: { role: 'admin' }
            },
            {
                    path: 'admin/overview',
                    component: AdminDashboardOverviewComponent,
                    canActivate: [RoleGuard],
                    data: { role: 'admin' }
                  },
                  {
                          path: 'admin/orders',
                          component: AdminOrdersComponent,
                          canActivate: [RoleGuard],
                          data: { role: 'admin' }
                        },
                  {
                          path: 'admin/orders/:id',
                          component: AdminOrderDetailsComponent,
                          canActivate: [RoleGuard],
                          data: { role: 'admin' }
                        },
                        {
                                path: 'my-orders',
                                component: MyOrdersUserComponent,
                                canActivate: [AuthGuard]
                              },
                              {
                                path: 'my-orders/:id',
                                component: MyOrderDetailsUserComponent,
                                canActivate: [AuthGuard]
                              }
    ])
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
