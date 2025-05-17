import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { Auth, signOut } from '@angular/fire/auth';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, SidebarComponent,RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalProducts = 0;
  totalRoles = 0;
  totalOrders = 0;
  totalContactRequests = 0;

  dropdownOpen = false;
  
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  
  private toastr = inject(ToastrService);
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadStats();
    const justLoggedIn = localStorage.getItem('justLoggedIn');
    if (justLoggedIn) {
      this.toastr.success('Welcome back!', 'Login Successful');
      localStorage.removeItem('justLoggedIn');
    }
  }

   loadStats() {
    this.productService.getProducts().subscribe(data => {
      this.totalProducts = data.length;
    });

    this.productService.getUsers().subscribe(data => {
      this.totalRoles = data.length;
    });

    this.productService.getOrders().subscribe(data => {
      this.totalOrders = data.length;
    });

    this.productService.getContactRequests().subscribe(data => {
      this.totalContactRequests = data.length;
    });
  }
}
