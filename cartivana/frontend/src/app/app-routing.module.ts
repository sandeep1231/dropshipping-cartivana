import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { SupplierDashboardComponent } from './pages/supplier-dashboard/supplier-dashboard.component';
import { RoleGuard } from './guards/role.guard';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { AdminDashboardOverviewComponent } from './pages/admin-dashboard-overview/admin-dashboard-overview.component';
import { AdminOrdersComponent } from './pages/admin-orders/admin-orders.component';
import { AdminOrderDetailsComponent } from './pages/admin-order-details/admin-order-details.component';
import { MyOrderDetailsUserComponent } from './pages/my-order-details-user/my-order-details-user.component';
import { MyOrdersUserComponent } from './pages/my-orders-user/my-orders-user.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'product/:id', component: ProductDetailComponent },
    { path: 'cart', component: CartComponent },
    { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'orders', component: OrderHistoryComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'admin', component: AdminDashboardComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
    { path: 'supplier', component: SupplierDashboardComponent, canActivate: [RoleGuard], data: { role: 'supplier' } },
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
      
      
    { path: '**', component: NotFoundComponent }
  ];
