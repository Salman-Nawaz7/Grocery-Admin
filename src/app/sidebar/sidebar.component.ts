import { Component } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  constructor(private auth: Auth, private router: Router) {}
  logout() {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger me-2'
    },
    buttonsStyling: false
  });

  swalWithBootstrapButtons.fire({
    title: 'Are you sure?',
    text: 'You will be logged out of the session.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, logout!',
    cancelButtonText: 'No, stay logged in',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      signOut(this.auth).then(() => {
        localStorage.removeItem('User data');
        this.router.navigate(['/login']);

        swalWithBootstrapButtons.fire({
          title: 'Logged out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          confirmButtonText: 'OK',
          buttonsStyling: true
        });
      }).catch((error) => {
        console.error('Logout error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong while logging out.'
        });
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithBootstrapButtons.fire({
        title: 'Cancelled',
        text: 'You are still logged in :)',
        icon: 'info'
      });
    }
  });
}

}
