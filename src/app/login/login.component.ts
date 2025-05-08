import { CommonModule } from '@angular/common';
import { Component ,ViewEncapsulation} from '@angular/core';
import { Auth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  email = '';
  password = '';
  loginError = '';
  users: any[] = [];
  constructor(private userService: ProductService, private afAuth: AngularFireAuth, private firestore: AngularFirestore, private auth: Auth, private router: Router) {
    this.checkLoginStatus();
  }


  
   ngOnInit(): void {
      this.userService.getUsers().subscribe((data) => {
        this.users = data;
        // console.log('users loaded:', data[0].id);
        // console.log('users loaded:', this.users);
        this.users.forEach(user => {
          console.log('User UID:', user.uid);
          console.log('User UID:', user.email);  // Log the uid of each user
        });
      });
    }

    login() {
      const matchedUser = this.users.find(
        user => user.email === this.email && user.role === 'Admin'
      );
    
      if (matchedUser) {
        signInWithEmailAndPassword(this.auth, this.email, this.password)
          .then((cred) => {
            localStorage.setItem('User data', JSON.stringify({
              uid: cred.user.uid,
              email: cred.user.email,
              name: cred.user.displayName,
              image: cred.user.photoURL,
              phone: cred.user.phoneNumber
            }));
            // alert("Login successful");
            this.router.navigate(['/dashboard']);
          })
          .catch((err) => {
            this.loginError = err.message;
          });
      } else {
        alert("Sorry, you are not an admin");
      }
    }
    
  // login() {
  //   console.log('this.users[0].email', this.users[0].email);
  //   if(this.email==this.users[0].email&&this.users[0].role=="admin"){
  //     signInWithEmailAndPassword(this.auth, this.email, this.password)
  //     .then((cred) => {
  //       localStorage.setItem('User data', JSON.stringify({
  //         uid: cred.user.uid,
  //         email: cred.user.email,
  //         name: cred.user.displayName,
  //         image: cred.user.photoURL,
  //         phone: cred.user.phoneNumber
  //       }));
  //       alert("login");
  //       this.router.navigate(['/dashboard']);
  //     })
  //     .catch((err) => {
  //       this.loginError = err.message;
  //     });
  //   }else{
  //     alert("Sorry you are not");
  //   }
    
  // }

  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        localStorage.setItem('User data', JSON.stringify({
          uid: result.user.uid,
          email: result.user.email,
          name: result.user.displayName,
          image: result.user.photoURL,
          phone: result.user.phoneNumber
        }));
        this.router.navigate(['/dashboard']);
      })
      .catch((err) => {
        this.loginError = err.message;
      });
  }

  checkLoginStatus() {
    onAuthStateChanged(this.auth, user => {
      if (user) this.router.navigate(['/dashboard']);
    });
  }

  logout() {
    signOut(this.auth).then(() => {
      localStorage.removeItem('User data');
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Logout error:', error);
    });
  }

  registerUser(email: string, password: string) {
    this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          // Set the user role to "user" by default or "admin" if required
          this.firestore.collection('users').doc(user.uid).set({
            email: user.email,
            role: 'user',  // Set to 'admin' if required
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });}
}
