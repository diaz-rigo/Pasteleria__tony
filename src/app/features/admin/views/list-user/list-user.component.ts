import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [TableModule, ButtonModule, DialogModule, InputTextModule, FormsModule],
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent {
  users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Michael Brown', email: 'michael@example.com' },
  ];

  userDialog: boolean = false;
  submitted: boolean = false;
  user: any = {};

  openNew() {
    this.user = {};
    this.submitted = false;
    this.userDialog = true;
  }

  editUser(user: any) {
    this.user = { ...user };
    this.userDialog = true;
  }

  deleteUser(user: any) {
    this.users = this.users.filter(u => u.id !== user.id);
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  saveUser() {
    this.submitted = true;

    if (this.user.name && this.user.email) {
      if (this.user.id) {
        this.users = this.users.map(u => u.id === this.user.id ? this.user : u);
      } else {
        this.user.id = this.users.length + 1;
        this.users.push(this.user);
      }

      this.userDialog = false;
      this.user = {};
    }
  }
}
