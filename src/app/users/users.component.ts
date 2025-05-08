import { Component } from '@angular/core';
import { collection, getDocs } from '@angular/fire/firestore';
import { ProductService } from '../product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-users',
  imports: [FormsModule,CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  users: any[] = [];

  constructor(private userService: ProductService,private auth: Auth, private router: Router) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      console.log('users loaded:', data[0].id);
      console.log('users loaded:', this.users);
      this.users.forEach(user => {
        console.log('User UID:', user.uid);
        console.log('User UID:', user.email);  // Log the uid of each user
      });
    });
  }

  // editUser(user: any) {
  //   console.log('Editing user:', user);
  //   // Implement edit logic (open modal, route to edit page, etc.)
  // }

  

  // deleteUser(id: string) {
  //       const swalWithBootstrapButtons = Swal.mixin({
  //         customClass: {
  //           confirmButton: "btn btn-success",
  //           cancelButton: "btn btn-danger"
  //         },
  //         buttonsStyling: false
  //       });
  //       swalWithBootstrapButtons.fire({
  //         title: "Are you sure?",
  //         text: "You won't be able to revert this!",
  //         icon: "warning",
  //         showCancelButton: true,
  //         confirmButtonText: "Yes, delete it!",
  //         cancelButtonText: "No, cancel!",
  //         reverseButtons: true
  //       }).then((result) => {
  //         if (result.isConfirmed) {
  //           //delete request service
  //           this.userService.deleteUser(id).then(() => {
  //             console.log('Request deleted successfully');
        
              
  //           }).catch(error => {
  //             console.error('Error deleting request:', error);
  //           });
  //           swalWithBootstrapButtons.fire({
  //             title: "Deleted!",
  //             text: "Your file has been deleted.",
  //             icon: "success"
  //           });
  //         } else if (
  //           /* Read more about handling dismissals below */
  //           result.dismiss === Swal.DismissReason.cancel
  //         ) {
  //           swalWithBootstrapButtons.fire({
  //             title: "Cancelled",
  //             text: "Your imaginary file is safe :)",
  //             icon: "error"
  //           });
  //         }
  //       });
        
  //     }
  
  showReauth =  false;

async onChangePassword(newPassword: string) {
  try {
    await this.userService.changePassword(newPassword);
    alert('Password changed');
  } catch (err: any) {
    if (err.message.includes('Reauthentication')) {
      this.showReauth = true;
    } else {
      alert(err.message);
    }
  }
}

async onChangeEmail(newEmail: string) {
  try {
    await this.userService.changeEmail(newEmail);
    alert('Email changed');
  } catch (err: any) {
    if (err.message.includes('Reauthentication')) {
      this.showReauth = true;
    } else {
      alert(err.message);
    }
  }
}

async onReauthenticate(currentPassword: string) {
  try {
    await this.userService.reauthenticate(currentPassword);
    this.showReauth = false;
    alert('Reauthenticated successfully. Please retry your action.');
  } catch (err: any) {
    alert('Reauthentication failed: ' + err.message);
  }
}

  
      // previewUrl: string | null = null;
      // selectedFile: File | null = null;
      // removeImage(): void {
      //   this.previewUrl = null;
      //   this.selectedFile = null;
      // }
      
      
      //   onFileSelected(event: any) {
      //     const file = event.target.files[0];
      //     if (!file) return;
      //     // 
      //     const reader = new FileReader();
      //     reader.onload = () => {
      //       this.previewUrl = reader.result as string;
      //     };
      //     reader.readAsDataURL(file);
      //     // 
      //     this.UserService.uploadImageToImgBB(file)
      //       .then(url => {
      //         console.log('Image uploaded:', url);
      //         this.selectedUser.image=url;
             
      //         // return this.UserService.saveImageInfoToFirestore(url, { User: 'Fruits' });
      //       })
            
      //       .catch(err => {
      //         console.error('Upload error:', err);
      //       });
      //   }
        selectedUser: any = null;
  
      editUser(User: any) {
        this.selectedUser = { ...User }; // Clone for editing
        //  this.previewUrl = User.image || null;
  
    // Programmatically open modal
      }
    
      cancelEdit() {
        this.selectedUser = null;
      }
    
      updateUser() {
        if (!this.selectedUser?.id) return;
        this.userService.updateUser(this.selectedUser.id, this.selectedUser)
          .then(() => {
            this.selectedUser = null;
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
