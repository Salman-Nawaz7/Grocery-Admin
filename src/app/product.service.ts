import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { Storage } from '@angular/fire/storage';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // private firestore = inject(Firestore); // ✅ Modular
  private productCollection: CollectionReference<DocumentData>;
  private categoryCollection: CollectionReference<DocumentData>;
  private requestCollection: CollectionReference<DocumentData>;
  private aboutUsCollection: CollectionReference<DocumentData>;
  private apiKey = 'dd822a371681c4dce859aa0bb87b61d6';
  constructor(private http: HttpClient, private firestore: Firestore ,private storage: Storage) {

    this.productCollection = collection(this.firestore, 'Products');
    this.categoryCollection = collection(this.firestore, 'Category');
    this.requestCollection = collection(this.firestore, 'ContactRequests');
    this.aboutUsCollection = collection(this.firestore, 'AboutUs');
  }
  getProducts() {
    // const productsRef = collection(this.firestore, 'Products');
    return collectionData(this.productCollection, { idField: 'id' });
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
  uploadImageToImgBB(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<any>(
      `https://api.imgbb.com/1/upload?key=${this.apiKey}`,
      formData
    ).toPromise().then(res => res.data.url);
  }

  // async saveImageInfoToFirestore(imageUrl: string, otherData: any = {}) {
  //   const col = collection(this.firestore, 'Images');
  //   return await addDoc(col, { url: imageUrl, ...otherData, date: new Date() });
  // }
}
