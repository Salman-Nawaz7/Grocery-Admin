import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../product.service';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-us',
  imports: [CommonModule,FormsModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent implements OnInit {
  AboutUs: any[] = [];
  
    constructor(private AboutUsService: ProductService,private auth: Auth, private router: Router) {}
  
    ngOnInit(): void {
      this.AboutUsService.getAboutUs().subscribe((data) => {
        this.AboutUs = data;
        console.log('AboutUs loaded:', data);
      });
    }

//   title = 'Welcome To FreshMart';
//   description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...`;

  editing = false;
// introContent: any;

  startEditing() {
    this.editing = true;
  }

//   saveChanges() {
//     this.editing = false;
//     // Optionally: persist data to API or storage here
//   }


//start for 1 image
  previewUrl1: string | null = null;
    selectedFile1: File | null = null;
    removeImage1(): void {
      this.previewUrl1 = null;
      this.selectedFile1 = null;
    }
    
    // 
      onFileSelected1(event: any) {
        const file = event.target.files[0];
        if (!file) return;
        // 
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrl1 = reader.result as string;
        };
        reader.readAsDataURL(file);
        // 
        this.AboutUsService.uploadImageToImgBB(file)
          .then(url => {
            console.log('Image uploaded:', url);
            this.selectedAboutUs.mainImage=url;
           
            // return this.AboutUsService.saveImageInfoToFirestore(url, { AboutUs: 'Fruits' });
          })
          
          .catch(err => {
            console.error('Upload error:', err);
          });
      }
      // end for 1 image
      //start for 2 image
  previewUrl2: string | null = null;
  selectedFile2: File | null = null;
  removeImage2(): void {
    this.previewUrl2 = null;
    this.selectedFile2 = null;
  }
  
  // 
    onFileSelected2(event: any) {
      const file = event.target.files[0];
      if (!file) return;
      // 
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl2 = reader.result as string;
      };
      reader.readAsDataURL(file);
      // 
      this.AboutUsService.uploadImageToImgBB(file)
        .then(url => {
          console.log('Image uploaded:', url);
          this.selectedAboutUs.leftTopImage=url;
         
          // return this.AboutUsService.saveImageInfoToFirestore(url, { AboutUs: 'Fruits' });
        })
        
        .catch(err => {
          console.error('Upload error:', err);
        });
    }
    // end for 2 image
    //start for 3 image
  previewUrl3: string | null = null;
  selectedFile3: File | null = null;
  removeImage3(): void {
    this.previewUrl3 = null;
    this.selectedFile3 = null;
  }
  
  // 
    onFileSelected3(event: any) {
      const file = event.target.files[0];
      if (!file) return;
      // 
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl3 = reader.result as string;
      };
      reader.readAsDataURL(file);
      // 
      this.AboutUsService.uploadImageToImgBB(file)
        .then(url => {
          console.log('Image uploaded:', url);
          this.selectedAboutUs.leftBottumImage=url;
         
          // return this.AboutUsService.saveImageInfoToFirestore(url, { AboutUs: 'Fruits' });
        })
        
        .catch(err => {
          console.error('Upload error:', err);
        });
    }
    // end for 3 image
    //start for 4 image
  previewUrl4: string | null = null;
  selectedFile4: File | null = null;
  removeImage4(): void {
    this.previewUrl4 = null;
    this.selectedFile4 = null;
  }
  
  // 
    onFileSelected4(event: any) {
      const file = event.target.files[0];
      if (!file) return;
      // 
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl4 = reader.result as string;
      };
      reader.readAsDataURL(file);
      // 
      this.AboutUsService.uploadImageToImgBB(file)
        .then(url => {
          console.log('Image uploaded:', url);
          this.selectedAboutUs.rightTopImage=url;
         
          // return this.AboutUsService.saveImageInfoToFirestore(url, { AboutUs: 'Fruits' });
        })
        
        .catch(err => {
          console.error('Upload error:', err);
        });
    }
    // end for 4 image
    //start for 5 image
  previewUrl5: string | null = null;
  selectedFile5: File | null = null;
  removeImage5(): void {
    this.previewUrl5 = null;
    this.selectedFile5 = null;
  }
  
  // 
    onFileSelected5(event: any) {
      const file = event.target.files[0];
      if (!file) return;
      // 
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl5 = reader.result as string;
      };
      reader.readAsDataURL(file);
      // 
      this.AboutUsService.uploadImageToImgBB(file)
        .then(url => {
          console.log('Image uploaded:', url);
          this.selectedAboutUs.rightBottumImage=url;
         
          // return this.AboutUsService.saveImageInfoToFirestore(url, { AboutUs: 'Fruits' });
        })
        
        .catch(err => {
          console.error('Upload error:', err);
        });
    }
    // end for 5 image
      selectedAboutUs: any = null;

    editAboutUs(AboutUs: any) {
      this.editing = true;
      this.selectedAboutUs = { ...AboutUs }; // Clone for editing
       this.previewUrl1 = AboutUs.mainImage || null;
       this.previewUrl2 = AboutUs.leftTopImage || null;
       this.previewUrl3 = AboutUs.leftBottumImage || null;
       this.previewUrl4 = AboutUs.rightTopImage || null;
       this.previewUrl5 = AboutUs.rightBottumImage || null;

  // Programmatically open modal
    }
    // cancelEditing() {
      
    // }
    cancelEdit() {
      this.editing = false;
      this.selectedAboutUs = null;
    }
  
    updateAboutUs() {
      if (!this.selectedAboutUs?.id) return;
      this.AboutUsService.updateAboutUs(this.selectedAboutUs.id, this.selectedAboutUs)
        .then(() => {
          this.selectedAboutUs = null;
          this.editing = false;
        })
        .catch(err => console.error('Update failed:', err));
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
