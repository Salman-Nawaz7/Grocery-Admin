import { Routes } from '@angular/router';
import { CategoryListComponent } from './category-list/category-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AddCategoryComponent } from './add-category/add-category.component';

export const routes: Routes = [
    {path:'',redirectTo:'dashboard',pathMatch:'full'},
        {path:'dashboard',component:DashboardComponent},
        {path:'category-list',component:CategoryListComponent},
        {path:'product-add',component:ProductAddComponent},
        {path:'product-list',component:ProductListComponent},
        {path:'contact-us',component:ContactUsComponent},
        {path:'add-category',component:AddCategoryComponent}
];
