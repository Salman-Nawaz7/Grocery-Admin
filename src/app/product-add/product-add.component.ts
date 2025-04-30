
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../product.service'; // import your Firestore service
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from "../sidebar/sidebar.component";

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
    image:"",
  };

  constructor(private productService: ProductService) {}

 

  async saveProduct() {
    const { title, description, category, stock, baseprice, saleprice, status, image } = this.product;
    const productData = { title, description, category, stock, baseprice, saleprice, status, image };

    try {
      await this.productService.addProduct(productData);
    } catch (error) {
      console.error('Error adding product:', error);
    }
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
        this.product.image=url;
       
        // return this.productService.saveImageInfoToFirestore(url, { category: 'Fruits' });
      })
      
      .catch(err => {
        console.error('Upload error:', err);
      });
  }
}
