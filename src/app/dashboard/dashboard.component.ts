import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  dropdownOpen = false;
  constructor(private auth: Auth, private router: Router) {}
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  
  logout() {
      signOut(this.auth).then(() => {
        localStorage.removeItem('User data');
        this.router.navigate(['/login']);
      }).catch((error) => {
        console.error('Logout error:', error);
      });
    }
}
