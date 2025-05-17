import { Component, ViewChild } from '@angular/core';
import { ProductService } from '../product.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  imports: [SidebarComponent,MatTableModule,CommonModule,FormsModule,MatIconModule,MatFormFieldModule,MatSelectModule,],
  // imports if standalone
})
export class UsersComponent {
onReauthenticate(arg0: string) {
throw new Error('Method not implemented.');
}
showReauth: any;
onChangePassword(arg0: string) {
throw new Error('Method not implemented.');
}
onChangeEmail(arg0: string) {
throw new Error('Method not implemented.');
}
  users: any[] = [];
  displayedColumns: string[] = ['email', 'role', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private userService: ProductService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      this.dataSource.data = this.users;
    });
  }

  selectedUser: any = null;

  editUser(user: any) {
    this.selectedUser = { ...user };
  }

  cancelEdit() {
    this.selectedUser = null;
  }

  updateUser() {
    if (!this.selectedUser?.id) return;
    this.userService.updateUser(this.selectedUser.id, this.selectedUser)
      .then(() => {
        this.selectedUser = null;
      })
      .catch(err => console.error('Update failed:', err));
  }
}
