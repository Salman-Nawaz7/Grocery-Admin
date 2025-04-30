import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    BrowserModule,
    CommonModule,
    // Initialize Firebase with the compat SDK
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // Import Firestore
  ],
  providers: [],
})
export class AppModule {}
