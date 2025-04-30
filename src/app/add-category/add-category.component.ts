import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-category',
  imports: [CommonModule,FormsModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {
  category = {
      title: '',
      description: '',
      image: '',
    };
  
    constructor(private productService: ProductService) {}
  
   
  
    async saveCategory() {
      const { title, description, image } = this.category;
      const categoryData = { title, description, image };
      
      try {
        await this.productService.addCategory(categoryData);
        alert('category added successfully!');
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
          this.category.image=url;
         
          // return this.productService.saveImageInfoToFirestore(url, { category: 'Fruits' });
        })
        
        .catch(err => {
          console.error('Upload error:', err);
        });
    }
}
