import { Component, OnInit } from '@angular/core';
import { User } from '../../models/api-models';
import { AdminService } from '../../services/admin.service';
// import { AdminService } from 'src/app/services/admin.service';
// import { User } from 'src/app/models/api-models';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  standalone: false
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  filter: string = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe((res: User[]) => {
      this.users = res;
    });
  }

  onRoleChange(event: Event, user: User): void {
    const select = event.target as HTMLSelectElement;
    const newRole = select.value;
  
    this.adminService.updateUserRole(user._id, newRole).subscribe(() => {
      this.loadUsers(); // Refresh after update
    });
  }

  filteredUsers(): User[] {
    return this.users.filter(u => !this.filter || u.role === this.filter);
  }
}
