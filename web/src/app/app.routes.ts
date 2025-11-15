import { Routes } from '@angular/router';
import { MainComponent } from './dashboard/main/main.component';
import { HomeComponent } from './dashboard/home/home.component';
import { FinancesComponent } from './dashboard/finances/finances.component';
import { AddincomeComponent } from './dashboard/finances/modules/addincome/addincome.component';
import { AddbillComponent } from './dashboard/finances/modules/addbill/addbill.component';
import { AddcategoryComponent } from './dashboard/finances/modules/addcategory/addcategory.component';
import { AddinstitutionComponent } from './dashboard/finances/modules/addinstitution/addinstitution.component';
import { AddbankcardComponent } from './dashboard/finances/modules/addbankcard/addbankcard.component';
import { HomefinancesComponent } from './dashboard/finances/modules/homefinances/homefinances.component';
import { ShowincomesComponent } from './dashboard/finances/modules/showincomes/showincomes.component';
import { ShowbillsComponent } from './dashboard/finances/modules/showbills/showbills.component';
import { EditbillComponent } from './dashboard/finances/modules/editbill/editbill.component';
import { TodolistComponent } from './dashboard/home/modules/todolist/todolist.component';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './auth/guards/auth.guard';
import { guestGuard } from './auth/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard]
  },
  {
    path: 'dashboard',
    component: MainComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
        children: [{ path: '', component: TodolistComponent }],
      },
      {
        path: 'finances',
        component: FinancesComponent,
        children: [
          { path: '', component: HomefinancesComponent },
          { path: 'addIncome', component: AddincomeComponent },
          { path: 'addBill', component: AddbillComponent },
          { path: 'addCategory', component: AddcategoryComponent },
          { path: 'addInstitution', component: AddinstitutionComponent },
          { path: 'addCard', component: AddbankcardComponent },
          { path: 'showIncomes', component: ShowincomesComponent },
          { path: 'showBills', component: ShowbillsComponent },
          { path: 'editBills/:id', component: EditbillComponent },
        ],
      },
    ],
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
