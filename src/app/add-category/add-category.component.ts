import { Component, ElementRef, ViewChild } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  imports: [CommonModule,FormsModule,ToastrModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {
  category = {
      title: '',
      description: '',
      image: '',
    };
  
    constructor(private toastr: ToastrService, private productService: ProductService,private auth: Auth, private router: Router) {}
  
   
  
    async saveCategory() {
      if (this.selectedFile) {
        const imageUrl = await this.productService.uploadImageToImgBB(this.selectedFile);
        this.category.image = imageUrl;
      }
      const { title, description, image } = this.category;
      const categoryData = { title, description, image };
      
      try {
        await this.productService.addCategory(categoryData);
        this.toastr.success('Category Added successfully!', 'Success'); // ✅ Toastr
      } catch (error) {
        console.error('Error adding product:', error);
        this.toastr.error('Category Added failed!', 'Error'); // ❌ Er
      }
    }
    
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  
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
