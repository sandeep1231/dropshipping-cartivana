import { Component } from '@angular/core';
// import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/api-models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent {
  form = {
    email: '',
    password: ''
  };

  errorMsg = '';
  showPassword = false;
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.errorMsg = '';
    this.authService.login(this.form.email, this.form.password).subscribe({
      next: (res: User) => {
        this.authService.setUser(res);
        this.router.navigate(['/']);
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Invalid email or password';
        this.loading = false;
      }
    });
  }
}
