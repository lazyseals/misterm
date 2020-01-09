import { Component, OnInit, Inject, Renderer, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';

import { LocationStrategy, PlatformLocation, Location, DOCUMENT } from '@angular/common';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ItemService } from './shared/item.service';
import { CategoryService } from './shared/category.service';
import { ShopService } from './shared/shop.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [ItemService, CategoryService, ShopService]
})
export class AppComponent implements OnInit {

    constructor() { }
    ngOnInit() {

    }
}
