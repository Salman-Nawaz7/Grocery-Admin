import { Routes } from '@angular/router';
import { CategoryListComponent } from './category-list/category-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { UsersComponent } from './users/users.component';

export const routes: Routes = [
    {path:'',redirectTo:'login',pathMatch:'full'},
    {
        path: '',
        canActivate: [AuthGuard],
        children: [
          { path: 'dashboard', component: DashboardComponent },
          { path: 'category-list', component: CategoryListComponent },
          { path: 'product-add', component: ProductAddComponent },
          { path: 'product-list', component: ProductListComponent },
          { path: 'contact-us', component: ContactUsComponent },
          { path: 'add-category', component: AddCategoryComponent },
          { path: 'about-us', component: AboutUsComponent },
          { path: 'users', component: UsersComponent }
        ],
      },
        {path:'login',component:LoginComponent},
        { path: '**', redirectTo: 'login' },
];
