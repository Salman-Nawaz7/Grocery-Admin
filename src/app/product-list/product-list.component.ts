import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from "../sidebar/sidebar.component";
import Swal from 'sweetalert2';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'], // note: `styleUrls` (plural)
  encapsulation:ViewEncapsulation.None
})
export class ProductListComponent implements OnInit {
  products: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      console.log('Products loaded:', data);
    });
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
    previewUrl: string | null = null;
selectedFile: File | null = null;



removeImage(): void {
  this.previewUrl = null;
  this.selectedFile = null;
}

// 
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    // 
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
    // 
    this.productService.uploadImageToImgBB(file)
      .then(url => {
        console.log('Image uploaded:', url);
        this.selectedProduct.image=url;
       
        // return this.productService.saveImageInfoToFirestore(url, { category: 'Fruits' });
      })
      
      .catch(err => {
        console.error('Upload error:', err);
      });
  }
    selectedProduct: any = null;
    editProduct(product: any) {
      this.selectedProduct = { ...product }; // Clone for editing
       this.previewUrl = product.image || null;

  // Programmatically open modal
    }
  
    cancelEdit() {
      this.selectedProduct = null;
    }
  
    updateProduct() {
      if (!this.selectedProduct?.id) return;
      this.productService.updateProduct(this.selectedProduct.id, this.selectedProduct)
        .then(() => {
          this.selectedProduct = null;
        })
        .catch(err => console.error('Update failed:', err));
    }
}
