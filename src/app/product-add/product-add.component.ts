
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../product.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './product-add.component.html',
  styleUrl: './product-add.component.css'
})
export class ProductAddComponent {
  @ViewChild('productForm') productForm!: NgForm;
  previewUrls: string[] = [];
selectedFiles: File[] = [];
product = {
  title: '',
  description: '',
  category: '',
  stock: 0,
  baseprice: 0,
  saleprice: 0,
  status: 'Active',
  featured:'Not Featured',
  images: <string[]>[], // array of image URLs
};
  // product = {
  //   title: '',
  //   description: '',
  //   category: '',
  //   stock: 0,
  //   baseprice: 0,
  //   saleprice: 0,
  //   status: 'Active',
  //   image: '',
  // };
  // resetForm(): void {
  //   this.product = {
  //     title: '',
  //     description: '',
  //     category: '',
  //     stock: 0,
  //     baseprice: 0,
  //     saleprice: 0,
  //     status: 'Active',
  //     image: '',
  //   };
  //   this.previewUrl = null;
  //   this.selectedFile = null;
  //   this.fileInput.nativeElement.value = ''; // clear file input
  //   this.productForm.resetForm(this.product); // resets validation too
  //   if (this.fileInput) {
  //     this.fileInput.nativeElement.value = '';
  //   }
  // }
  resetForm(): void {
    this.product = {
      title: '',
      description: '',
      category: '',
      stock: 0,
      baseprice: 0,
      saleprice: 0,
      status: 'Active',
      featured:'Not Featured',
      images: [],
    };
    this.previewUrls = [];
    this.selectedFiles = [];
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    if (this.productForm) {
      this.productForm.resetForm(this.product);
    }
  }
  
  loading = false;

  @ViewChild('fileInput') fileInput!: ElementRef;
  // previewUrl: string | null = null;
  // selectedFile: File | null = null;

  constructor(
    private toastr: ToastrService,
    private productService: ProductService
  ) {}

  

  preventNegative(event: KeyboardEvent): void {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }

  // async saveProduct() {
  //   if (this.loading) return; // Prevent multiple submissions
  //   this.loading = true;
  
  //   try {
  //     if (this.selectedFile) {
  //       const imageUrl = await this.productService.uploadImageToImgBB(this.selectedFile);
  //       this.product.image = imageUrl;
  //     }
  
  //     const { title, description, category, stock, baseprice, saleprice, status, image } = this.product;
  //     const productData = { title, description, category, stock, baseprice, saleprice, status, image };
  
  //     await this.productService.addProduct(productData);
  
  //     this.toastr.success('Product saved successfully!', 'Success', {
  //       positionClass: 'toast-top-right',
  //       timeOut: 3000,
  //     });
  
  //     this.resetForm(); // Reset after saving
  //   } catch (error) {
  //     this.toastr.error('Failed to save product.', 'Error', {
  //       positionClass: 'toast-top-right'
  //     });
  //     console.error(error);
  //   } finally {
  //     this.loading = false; // Re-enable the button
  //   }
  // }
  
  async saveProduct() {
    if (this.loading) return;
    this.loading = true;
  
    try {
      const imageUrls: string[] = [];
  
      for (const file of this.selectedFiles) {
        const imageUrl = await this.productService.uploadImageToImgBB(file);
        imageUrls.push(imageUrl);
      }
  
      const { title, description, category, stock, baseprice, saleprice, status, featured } = this.product;
      const productData = {
        title,
        description,
        category,
        stock,
        baseprice,
        saleprice,
        status,
        featured,
        images: imageUrls,
      };
  
      await this.productService.addProduct(productData);
  
      this.toastr.success('Product saved successfully!', 'Success');
      this.resetForm();
    } catch (error) {
      console.error(error);
      this.toastr.error('Failed to save product.', 'Error');
    } finally {
      this.loading = false;
    }
  }
  
  // removeImage(): void {
  //   this.previewUrl = null;
  //   this.selectedFile = null;
  //   if (this.fileInput) {
  //     this.fileInput.nativeElement.value = '';
  //   }
  // }

  // onFileSelected(event: any) {
  //   const file = event.target.files[0];
  //   if (!file) return;
  
  //   // Check if the file is an image
  //   if (!file.type.startsWith('image/')) {
  //     alert('Please select an image file');
  //     if (this.fileInput) {
  //       this.fileInput.nativeElement.value = '';
  //     }
  //     return;
  //   }
  
  //   this.selectedFile = file;
  
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.previewUrl = reader.result as string;
  //   };
  //   reader.readAsDataURL(file);
  // }
  removeImage(index: number): void {
    this.previewUrls.splice(index, 1);
    this.selectedFiles.splice(index, 1);
    this.product.images = [...this.previewUrls];
    
  }

  
  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
  
    if (!files || files.length === 0) return;
  
    const validNewFiles: File[] = [];
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        validNewFiles.push(file);
      }
    }
  
    if (this.selectedFiles.length + validNewFiles.length > 4) {
      this.toastr.warning('You can only upload up to 4 images.', 'Limit Exceeded');
      return;
    }
  
    for (const file of validNewFiles) {
      this.selectedFiles.push(file);
  
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrls.push(reader.result as string);
        // DO NOT update product.images here – only after upload
      };
      reader.readAsDataURL(file);
    }
  
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
  

  
  
  
  
  

      
}
