import { Component } from '@angular/core';
// import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/api-models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})
export class RegisterComponent {
  form = {
    name: '',
    email: '',
    password: '',
    role: 'customer'
  };

  errorMsg = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.register(this.form).subscribe({
      next: (res) => {
        this.authService.setUser(res as User);
        this.router.navigate(['/']);
      },
      error: () => {
        this.errorMsg = 'Registration failed. Try a different email.';
      }
    });
  }
}
