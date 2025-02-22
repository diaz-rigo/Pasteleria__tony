import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { DropdownModule } from 'primeng/dropdown'; // ✅ Importa PrimeNG Dropdown
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-list-user',
  standalone: true,
    providers: [UserService],
  
  imports: [CommonModule,TableModule, ButtonModule, DialogModule, InputTextModule, FormsModule,DropdownModule,HttpClientModule],
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent {
  users : any = [
    
  ];

  userDialog: boolean = false;
  submitted: boolean = false;
  user: any = {};
  ngOnInit() {
    this.loadUsers();
  }
  constructor(private userService: UserService) {}

  openNew() {
    this.user = {};
    this.submitted = false;
    this.userDialog = true;
  }


  loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }
  editUser(user: any) {
    this.user = { ...user };
    this.userDialog = true;
  }

  deleteUser(user: any) {
    this.userService.deleteUser(user.id).subscribe(() => {
      this.users = this.users.filter((u: { id: any; }) => u.id !== user.id);
    });
  }
  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  saveUser() {
    this.submitted = true;

    if (this.user.name && this.user.email) {
      if (this.user.id) {
        this.users = this.users.map((u: { id: any; }) => u.id === this.user.id ? this.user : u);
      } else {
        this.user.id = this.users.length + 1;
        this.users.push(this.user);
      }

      this.userDialog = false;
      this.user = {};
    }
  }
}
