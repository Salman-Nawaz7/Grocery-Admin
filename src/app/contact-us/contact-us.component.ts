import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../product.service';
import Swal from 'sweetalert2';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-contact-us',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent implements OnInit{
requests: any[] = [];
paginatedRequests: any[] = [];
currentPage: number = 1;
itemsPerPage: number = 10;
totalPages: number = 0;
  constructor(private productService: ProductService,private auth: Auth, private router: Router) {}

  ngOnInit(): void {
    this.productService.getContactRequests().subscribe((data) => {
      this.requests = data;
      this.totalPages = Math.ceil(this.requests.length / this.itemsPerPage);
      this.updatePaginatedRequests();
      console.log('Requests loaded:', data);
    });
  }
  updatePaginatedRequests(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedRequests = this.requests.slice(start, end);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedRequests();
  }

  deleteRequest(id: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        //delete request service
        this.productService.deleteContactRequest(id).then(() => {
          console.log('Request deleted successfully');
    
          
        }).catch(error => {
          console.error('Error deleting request:', error);
        });
        swalWithBootstrapButtons.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error"
        });
      }
    });
    
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
