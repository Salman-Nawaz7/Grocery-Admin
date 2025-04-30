import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ProductService } from '../product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-list',
  imports: [CommonModule,FormsModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {
  Categories: any[] = [];

  constructor(private CategoryService: ProductService) {}

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
        this.CategoryService.uploadImageToImgBB(file)
          .then(url => {
            console.log('Image uploaded:', url);
            this.selectedCategory.image=url;
           
            // return this.CategoryService.saveImageInfoToFirestore(url, { category: 'Fruits' });
          })
          
          .catch(err => {
            console.error('Upload error:', err);
          });
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
  
    updateCategory() {
      if (!this.selectedCategory?.id) return;
      this.CategoryService.updateCategory(this.selectedCategory.id, this.selectedCategory)
        .then(() => {
          this.selectedCategory = null;
        })
        .catch(err => console.error('Update failed:', err));
    }
}
