import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from "../sidebar/sidebar.component";
import Swal from 'sweetalert2';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastrModule, SidebarComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'], // note: `styleUrls` (plural)
  encapsulation:ViewEncapsulation.None
})
export class ProductListComponent implements OnInit {
  products: any[] = [];

  paginatedProducts: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;

  searchTerm: string = '';
selectedStatus: string = 'All';
selectedCategory: string = 'All';
filteredProducts: any[] = [];

categories: string[] = []
loading = false;
  constructor(private toastr: ToastrService, private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      this.extractCategories();
      this.applyFilters();
      this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
      this.updatePaginatedProducts();
      console.log('Products loaded:', data);
    });
  }

  extractCategories(): void {
    const categorySet = new Set(this.products.map(p => p.category).filter(Boolean));
    this.categories = ['All', ...Array.from(categorySet)];
  }
  
  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = this.searchTerm
        ? product.title.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;
  
      const matchesStatus = this.selectedStatus === 'All' || product.status === this.selectedStatus;
      const matchesCategory = this.selectedCategory === 'All' || product.category === this.selectedCategory;
  
      return matchesSearch && matchesStatus && matchesCategory;
    });
  
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedProducts();
  }

  updatePaginatedProducts(): void {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  this.paginatedProducts = this.filteredProducts.slice(start, end);
}

onSearchChange(): void {
  this.applyFilters();
}

onStatusChange(): void {
  this.applyFilters();
}

onCategoryChange(): void {
  this.applyFilters();
}

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedProducts();
  }
  
  preventNegative(event: KeyboardEvent): void {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }
  
  deleteRequest(id: string) {
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
          //delete request service
          this.productService.deleteProduct(id).then(() => {
            console.log('Product deleted successfully');
      
            
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
//     previewUrl: string | null = null;
// selectedFile: File | null = null;
@ViewChild('fileInput') fileInput!: ElementRef;

// 
selectedFiles: File[] = [];
imagePreviews: string[] = [];

onMultipleFilesSelected(event: any): void {
  const files: FileList = event.target.files;
  const maxImages = 4;

  if (files.length + this.imagePreviews.length > maxImages) {
    alert(`You can only select up to ${maxImages} images.`);
    this.fileInput.nativeElement.value = '';
    return;
  }

  Array.from(files).forEach((file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviews.push(reader.result as string);
      };
      reader.readAsDataURL(file);
      this.selectedFiles.push(file);
    }
  });
}

removeImageAtIndex(index: number): void {
  this.imagePreviews.splice(index, 1);
  this.selectedFiles.splice(index, 1);
}
// 
editProduct(product: any) {
  this.selectedProduct = { ...product };
  this.imagePreviews = [...(product.images || [])];
  this.selectedFiles = []; // Start fresh for new uploads
}

    selectedProduct: any = null;
  //   editProduct(product: any) {
  //     this.selectedProduct = { ...product }; // Clone for editing
  //      this.previewUrl = product.image || null;

  // // Programmatically open modal
  //   }
  
    // cancelEdit() {
    //   this.selectedProduct = null;
    // }
    cancelEdit() {
      this.selectedProduct = null;
      this.imagePreviews = [];
      this.selectedFiles = [];
      if (this.fileInput) {
        this.fileInput.nativeElement.value = '';
      }
    }
    
    // async updateProduct() {
    //   if (this.selectedFile) {
    //     const imageUrl = await this.productService.uploadImageToImgBB(this.selectedFile);
    //     this.selectedProduct.image = imageUrl;
    //   }
    //   if (!this.selectedProduct?.id) return;
    //   this.productService.updateProduct(this.selectedProduct.id, this.selectedProduct)
    //     .then(() => {
    //       this.selectedProduct = null;
    //       this.toastr.success('Product updated successfully!', 'Success'); // ✅ Toastr
    //     })
    //     .catch(err => {
    //       console.error('Update failed:', err);
    //     this.toastr.error('Product update failed!', 'Error'); // ❌ Error
    //     }
    //     );
        
    // }
    async updateProduct() {
      if (this.loading) return;
    this.loading = true;
      if (!this.selectedProduct?.id) return;
    
      // Upload new files if any
      const uploadedImageUrls = [];
    
      for (const file of this.selectedFiles) {
        const url = await this.productService.uploadImageToImgBB(file);
        uploadedImageUrls.push(url);
      }
    
      // Combine already-present image URLs with new ones
      this.selectedProduct.images = [
        ...this.imagePreviews.filter(url => url.startsWith('http')), // already saved
        ...uploadedImageUrls, // newly uploaded
      ];
    
      // Trim to max 4
      this.selectedProduct.images = this.selectedProduct.images.slice(0, 4);
    
      this.productService.updateProduct(this.selectedProduct.id, this.selectedProduct)
        .then(() => {
          
          this.selectedProduct = null;
          this.imagePreviews = [];
          this.selectedFiles = [];
          this.toastr.success('Product updated successfully!', 'Success');
          this.loading = false;
        })
        .catch(err => {
          console.error('Update failed:', err);
          this.toastr.error('Product update failed!', 'Error');
          this.loading = false;
        });
    }
    
    
}
