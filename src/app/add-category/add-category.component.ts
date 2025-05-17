import { Component, ElementRef, ViewChild } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastrModule, SidebarComponent],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {
  category = {
    title: '',
    description: '',
    image: '',
  };

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('productForm') productForm!: NgForm;

  previewUrl: string | null = null;
  selectedFile: File | null = null;
  isSubmitting: boolean = false;

  constructor(private toastr: ToastrService, private productService: ProductService) {}

  async saveCategory() {
    if (this.isSubmitting) return; // Prevent multiple clicks
    this.isSubmitting = true;

    try {
      if (this.selectedFile) {
        const imageUrl = await this.productService.uploadImageToImgBB(this.selectedFile);
        this.category.image = imageUrl;
      }

      const { title, description, image } = this.category;
      const categoryData = { title, description, image };

      await this.productService.addCategory(categoryData);
      this.toastr.success('Category Added successfully!', 'Success');

      this.resetForm(); // Reset form fields and validation
    } catch (error) {
      console.error('Error adding category:', error);
      this.toastr.error('Category addition failed!', 'Error');
    } finally {
      this.isSubmitting = false;
    }
  }

  resetForm(): void {
    this.category = {
      title: '',
      description: '',
      image: ''
    };
    this.previewUrl = null;
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    if (this.productForm) {
      this.productForm.resetForm(this.category); // reset with default values and clear validation
    }
  }

  removeImage(): void {
    this.previewUrl = null;
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

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
}
