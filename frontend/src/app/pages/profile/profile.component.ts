import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  form = {
    name: '',
    email: '',
    password: ''
  };

  message = '';

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe(user => {
      this.form.name = user['name'];
      this.form.email = user['email'];
    });
  }

  onSubmit() {
    this.userService.updateProfile(this.form).subscribe({
      next: (updatedUser) => {
        this.auth.setUser(updatedUser);
        this.message = '✅ Profile updated successfully!';
      },
      error: () => {
        this.message = '❌ Failed to update profile.';
      }
    });
  }
}
