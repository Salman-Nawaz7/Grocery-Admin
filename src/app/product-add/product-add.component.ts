
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../product.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-add.component.html',
  styleUrl: './product-add.component.css'
})
export class ProductAddComponent {
  product = {
    title: '',
    description: '',
    category: '',
    stock: 0,
    baseprice: 0,
    saleprice: 0,
    status: 'Active',
    image: '',
  };

  @ViewChild('fileInput') fileInput!: ElementRef;
  previewUrl: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private toastr: ToastrService,
    private productService: ProductService,private auth: Auth, private router: Router
  ) {}

  

  preventNegative(event: KeyboardEvent): void {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }

  async saveProduct() {
    try {
      if (this.selectedFile) {
        const imageUrl = await this.productService.uploadImageToImgBB(this.selectedFile);
        this.product.image = imageUrl;
      }

      const { title, description, category, stock, baseprice, saleprice, status, image } = this.product;
      const productData = { title, description, category, stock, baseprice, saleprice, status, image };

      await this.productService.addProduct(productData);

      this.toastr.success('Product saved successfully!', 'Success', {
        positionClass: 'toast-top-right',
        timeOut: 3000,
      });
      

      // Optionally reset form or redirect
    } catch (error) {
      this.toastr.error('Failed to save product.', 'Error', {
        positionClass: 'toast-top-right'
      });
      console.error(error);
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

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
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
