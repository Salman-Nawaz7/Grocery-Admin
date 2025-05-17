import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../product.service';
import Swal from 'sweetalert2';
import { SidebarComponent } from "../sidebar/sidebar.component";

declare var bootstrap: any; // For Bootstrap modal

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  requests: any[] = [];
  paginatedRequests: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  selectedRequest: any = null;
searchTerm: string = '';
filteredRequests: any[] = [];
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.productService.getContactRequests().subscribe((data) => {
      this.requests = (data || []).map(r => ({
        ...r,
        status: r['status'] || 'unread'  // default to 'unread' if not set
      }));
      this.sortByDateDescending();
      this.totalPages = Math.ceil(this.requests.length / this.itemsPerPage);
      this.updatePaginatedRequests();
      this.applyFilter();
      console.log('Requests loaded:', data);
    });
  }

   applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      // No search term, show all
      this.filteredRequests = [...this.requests];
    } else {
      this.filteredRequests = this.requests.filter(r =>
        r.name.toLowerCase().includes(term) ||
        r.email.toLowerCase().includes(term) ||
        r.subject.toLowerCase().includes(term)
      );
    }

    this.totalPages = Math.ceil(this.filteredRequests.length / this.itemsPerPage) || 1;
    this.currentPage = 1;
    this.updatePaginatedRequests();
  }
  sortByDateDescending(): void {
    this.requests.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
    this.updatePaginatedRequests();
  }

 updatePaginatedRequests(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedRequests = this.filteredRequests.slice(start, end);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedRequests();
  }
  deleteRequest(id: string): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger  me-2"
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
        this.productService.deleteContactRequest(id).then(() => {
          // Remove deleted request from array
          this.requests = this.requests.filter(request => request.id !== id);
          this.totalPages = Math.ceil(this.requests.length / this.itemsPerPage) || 1;
          if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages;
          }
          this.updatePaginatedRequests();

          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "The request has been deleted.",
            icon: "success"
          });
        }).catch(error => {
          console.error('Error deleting request:', error);
          Swal.fire("Error", "Failed to delete the request.", "error");
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "The request was not deleted.",
          icon: "error"
        });
      }
    });
  }

  markRequestAsRead(request: any): void {
    if (request.status === 'unread') {
      request.status = 'read';
      // Optional: persist change in backend
      this.productService.markContactRequestAsRead?.(request.id).catch(err => {
        console.error('Failed to mark request as read:', err);
      });
    }
  }

  openMessageModal(request: any): void {
    this.selectedRequest = request;
    this.markRequestAsRead(request);

    const modalElement = document.getElementById('messageModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}
