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

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.form.email, this.form.password).subscribe({
      next: (res) => {
        this.authService.setUser(res as User);
        this.router.navigate(['/']);
      },
      error: () => {
        this.errorMsg = 'Invalid email or password';
      }
    });
  }
}
