import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UeberUnsComponent } from './ueber-uns/ueber-uns.component';
import { DatenschutzComponent } from './shared/footer/datenschutz/datenschutz.component';
import { ImpressumComponent } from './shared/footer/impressum/impressum.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'category/:cid', component: ItemListComponent },
  { path: 'category/:cid/:iid', component: ItemDetailComponent },
  { path: 'ueberuns', component: UeberUnsComponent },
  { path: 'impressum', component: ImpressumComponent },
  { path: 'datenschutz', component: DatenschutzComponent },
  { path: 'not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
