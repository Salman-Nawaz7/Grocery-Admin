import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { Storage } from '@angular/fire/storage';

import { Observable } from 'rxjs';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';


import {
  getAuth,
  updatePassword,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User
} from 'firebase/auth';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // private firestore = inject(Firestore); // ✅ Modular
  private productCollection: CollectionReference<DocumentData>;
  private categoryCollection: CollectionReference<DocumentData>;
  private requestCollection: CollectionReference<DocumentData>;
  private aboutUsCollection: CollectionReference<DocumentData>;
  private userCollection: CollectionReference<DocumentData>;
  private apiKey = 'dd822a371681c4dce859aa0bb87b61d6';
  constructor(private afAuth: AngularFireAuth, private firestores: AngularFirestore, private http: HttpClient, private firestore: Firestore ,private storage: Storage) {

    this.productCollection = collection(this.firestore, 'Products');
    this.categoryCollection = collection(this.firestore, 'Category');
    this.requestCollection = collection(this.firestore, 'ContactRequests');
    this.aboutUsCollection = collection(this.firestore, 'AboutUs');
    this.userCollection = collection(this.firestore, 'Roles');
  }
  getProducts() {
    // const productsRef = collection(this.firestore, 'Products');
    return collectionData(this.productCollection, { idField: 'id' });
  }
  getUsers() {
    // const productsRef = collection(this.firestore, 'Products');
    return collectionData(this.userCollection, { idField: 'id' });
  }
  
  getCategories() {
    // const productsRef = collection(this.firestore, 'Products');
    return collectionData(this.categoryCollection, { idField: 'id' });
  }
  getContactRequests() {
    // const productsRef = collection(this.firestore, 'Products');
    return collectionData(this.requestCollection, { idField: 'id' });
  }
  getAboutUs() {
    // const productsRef = collection(this.firestore, 'Products');
    return collectionData(this.aboutUsCollection, { idField: 'id' });
  }
  deleteProduct(id: string) {
    const productDocRef = doc(this.firestore, `Products/${id}`);
    return deleteDoc(productDocRef);
  }
  deleteCategory(id: string) {
    const categoryDocRef = doc(this.firestore, `Category/${id}`);
    return deleteDoc(categoryDocRef);
  }
  
  deleteContactRequest(id: string) {
    const requestDocRef = doc(this.firestore, `ContactRequests/${id}`);
    return deleteDoc(requestDocRef);
  }

  deleteUser(id: string) {
    const userDocRef = doc(this.firestore, `Roles/${id}`);
    return deleteDoc(userDocRef);
  }


 
  // async uploadImage(file: File): Promise<string> {
  //   const filePath = `product-images/${Date.now()}_${file.name}`;
  //   const fileRef = ref(this.storage, filePath);
  //   await uploadBytes(fileRef, file);
  //   return getDownloadURL(fileRef);
  // }

  addProduct(product: any) {
    return addDoc(this.productCollection, product);
  }

  addCategory(category: any) {
    return addDoc(this.categoryCollection, category);
  }

  updateProduct(id: string, data: any) {
    const productRef = doc(this.firestore, `Products/${id}`);
    return updateDoc(productRef, data);
  }

  updateCategory(id: string, data: any) {
    const categoryRef = doc(this.firestore, `Category/${id}`);
    return updateDoc(categoryRef, data);
  }
  updateAboutUs(id: string, data: any) {
    const aboutRef = doc(this.firestore, `AboutUs/${id}`);
    return updateDoc(aboutRef, data);
  }
  updateUser(id: string, data: any) {
    const userRef = doc(this.firestore, `Roles/${id}`);
    return updateDoc(userRef, data);
  }
  
  uploadImageToImgBB(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<any>(
      `https://api.imgbb.com/1/upload?key=${this.apiKey}`,
      formData
    ).toPromise().then(res => res.data.url);
  }
  
  // getUser(): Observable<any[]> {
  //   return this.firestores.collection('Roles').valueChanges();
  // }
  // async saveImageInfoToFirestore(imageUrl: string, otherData: any = {}) {
  //   const col = collection(this.firestore, 'Images');
  //   return await addDoc(col, { url: imageUrl, ...otherData, date: new Date() });
  // }

  private auth = getAuth();

  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  async changePassword(newPassword: string): Promise<void> {
    const user = this.auth.currentUser;
    console.log('user',user?.email);
    if (!user) throw new Error('User not signed in');

    try {
      await updatePassword(user, newPassword);
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        throw new Error('Reauthentication required to change password.');
      }
      throw error;
    }
  }

  async changeEmail(newEmail: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not signed in');

    try {
      await updateEmail(user, newEmail);
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        throw new Error('Reauthentication required to change email.');
      }
      throw error;
    }
  }

  async reauthenticate(currentPassword: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user || !user.email) throw new Error('User not signed in or missing email');

    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
  }
}
