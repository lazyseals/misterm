import { Component, OnInit, Inject, Renderer, ElementRef, ViewChild } from '@angular/core';
import 'rxjs/add/operator/filter';

import { ItemService } from './shared/item.service';
import { CategoryService } from './shared/category.service';
import { ShopService } from './shared/shop.service';
import { BewertungService } from './shared/bewertung.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [ItemService, CategoryService, ShopService, BewertungService]
})
export class AppComponent implements OnInit {

    constructor() { }
    ngOnInit() {

    }
}
