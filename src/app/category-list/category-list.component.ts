import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ProductService } from '../product.service';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-category-list',
  imports: [CommonModule, FormsModule, ToastrModule, SidebarComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {
  Categories: any[] = [];

  constructor(private toastr: ToastrService, private CategoryService: ProductService) {}

  ngOnInit(): void {
    this.CategoryService.getCategories().subscribe((data) => {
      this.Categories = data;
      console.log('Categories loaded:', data);
    });
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
          this.CategoryService.deleteCategory(id).then(() => {
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
    @ViewChild('fileInput') fileInput!: ElementRef;
    previewUrl: string | null = null;
    selectedFile: File | null = null;
    removeImage(): void {
      this.previewUrl = null;
      this.selectedFile = null;
      // Clear the file input
   if (this.fileInput) {
    this.fileInput.nativeElement.value = '';
  }
    }
    
    // 
    onFileSelected(event: any) {
      const file = event.target.files[0];
      if (!file) return;
    
      // Check if the file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
        return;
      }
    
      this.selectedFile = file;
    
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
      selectedCategory: any = null;

    editCategory(category: any) {
      this.selectedCategory = { ...category }; // Clone for editing
       this.previewUrl = category.image || null;

  // Programmatically open modal
    }
  
    cancelEdit() {
      this.selectedCategory = null;
    }
  
    async updateCategory() {
      if (this.selectedFile) {
        const imageUrl = await this.CategoryService.uploadImageToImgBB(this.selectedFile);
        this.selectedCategory.image = imageUrl;
      }
      if (!this.selectedCategory?.id) return;
      this.CategoryService.updateCategory(this.selectedCategory.id, this.selectedCategory)
        .then(() => {
          this.selectedCategory = null;
          this.toastr.success('Category updated successfully!', 'Success'); // ✅ Toastr
        })
        .catch(err => {
          console.error('Update failed:', err);
        this.toastr.error('Category update failed!', 'Error'); // ❌ Error
        }
        );
    }

   
}
