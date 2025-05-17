import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { ProductService } from '../product.service';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  imports: [SidebarComponent, CommonModule, FormsModule]
})
export class OrderListComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  paginatedOrders: any[] = [];

  currentPage: number = 1;
  pageSize: number = 10;

  searchTerm: string = '';
  statusFilter: string = '';

  selectedOrder: any = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getOrders().subscribe((data) => {
      this.orders = data;
      this.filteredOrders = data;
      this.updatePaginatedOrders();
    });
  }

  formatTimestamp(timestamp: Timestamp): string {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleString();
  }

  deleteOrder(id: string): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger me-2"
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
        this.productService.deleteOrder(id).then(() => {
          this.orders = this.orders.filter(order => order.id !== id);
          this.applyFilters();

          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "The order has been deleted.",
            icon: "success"
          });
        }).catch(error => {
          console.error('Error deleting order:', error);
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "The order is safe :)",
          icon: "error"
        });
      }
    });
  }

  updatePaginatedOrders(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedOrders();
  }

  get totalPages(): number[] {
    return Array(Math.ceil(this.filteredOrders.length / this.pageSize)).fill(0).map((x, i) => i + 1);
  }

  applyFilters(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredOrders = this.orders.filter(order =>
      (!this.statusFilter || order.status === this.statusFilter) &&
      (
        order.id.toLowerCase().includes(term) ||
        order.userId?.toLowerCase().includes(term) ||
        order.shippingAddress?.toLowerCase().includes(term)
      )
    );
    this.currentPage = 1;
    this.updatePaginatedOrders();
  }

  editOrder(order: any): void {
    this.selectedOrder = { ...order }; // clone for editing
  }

  cancelEdit(): void {
    this.selectedOrder = null;
  }

  updateOrder(): void {
    if (!this.selectedOrder?.id) return;
    this.productService.updateOrder(this.selectedOrder.id, this.selectedOrder)
      .then(() => {
        this.orders = this.orders.map(o => o.id === this.selectedOrder.id ? this.selectedOrder : o);
        this.applyFilters(); // re-apply filter after update
        this.selectedOrder = null;
        Swal.fire('Success', 'Order updated successfully!', 'success');
      })
      .catch(err => {
        console.error('Failed to update order:', err);
        Swal.fire('Error', 'Failed to update order', 'error');
      });
  }
}
