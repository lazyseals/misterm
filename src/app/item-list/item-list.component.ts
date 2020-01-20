import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Item } from '../shared/item.model';
import { ItemService } from '../shared/item.service';
import { CategoryService } from '../shared/category.service';
import { Category } from '../shared/category.model';
import { FilterService } from './filter.service';
import { SortService } from './sort.service';
import { Subscription } from 'rxjs';

/**
 * Displays all items in a category. Offers filtering and sorting options.
 */
@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
  providers: [
    FilterService,
    SortService
  ]
})
export class ItemListComponent implements OnInit, OnDestroy {
  // Category to be displayed
  private cid: string;
  private category: Category;
  private subCids: string[] = [];
  private subCategories: Category[];
  // All items in the category to be displayed
  private items: Item[];
  // True if app is fetching data from backend
  private isFetching = false;
  // Subscription to item changes due to filtering
  private itemsFilterSub: Subscription;
  // Subscriptions to item changes due to server loading
  private itemsServerSub: Subscription;
  private numberOfItemsToDisplay = 24;
  private page = 1;
  private collectionSize: Number;

  /**
   * Constructor 
   * @param route 
   * @param itemService 
   * @param categoryService 
   */
  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private categoryService: CategoryService,
    private sortService: SortService,
    private filterService: FilterService
  ) { };

  /**
   * Load items and category from server
   */
  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.cid = params['cid'];
        this.fetchData();
      }
    );
  };

  paginateItems() {
    this.items = this.itemService.getItems();
    this.items = this.items.slice((this.page - 1) * this.numberOfItemsToDisplay, this.page * this.numberOfItemsToDisplay);
  }

  fetchData() {
    this.isFetching = true;
    this.categoryService.getCategories([this.cid])
      .subscribe(category => {
        this.category = category[0];
        if (this.category.main && this.category.subCategories.length > 0) {
          this.categoryService.getSubcategories(this.category.subCategories)
            .subscribe(subCategories => {
              this.subCategories = subCategories;
              for (const subCategory of subCategories) {
                this.subCids.push(subCategory.cid);
              }
              this.itemService.getItemsInCategories(this.subCids);
              this.itemsServerSub = this.itemService.getItemsUpdateListener()
                .subscribe(items => {
                  this.isFetching = false;
                  this.items = items;
                  this.collectionSize = (this.items.length / this.numberOfItemsToDisplay) * 10;
                  this.paginateItems();
                });
            });
        } else {
          this.itemService.getItemsInCategory(this.cid);
          this.itemsServerSub = this.itemService.getItemsUpdateListener()
            .subscribe(items => {
              this.isFetching = false;
              this.items = items;
              this.collectionSize = (this.items.length / this.numberOfItemsToDisplay) * 10;
              this.paginateItems();
            });
        }
      });
    this.itemsFilterSub = this.filterService.getItemsUpdateListener()
      .subscribe((items: Item[]) => {
        this.items = items;
        this.collectionSize = (this.items.length / this.numberOfItemsToDisplay) * 10;
        this.paginateItems();
      });
  };

  ngOnDestroy() {
    if (this.itemsFilterSub) {
      this.itemsFilterSub.unsubscribe();
    }
    if (this.itemsServerSub) {
      this.itemsServerSub.unsubscribe();
    }
  };

  /**
   * Is invoked if a sort option is selected. Sorts all items in view depending on the selected sort option 
   * and sets the sort property accordingly.
   * @param ev 
   */
  onSort(ev: any) {
    // Name of the selected option
    let value = ev.target.value;

    // Choose sort option depending on selected sort property
    switch (value) {
      case "Beliebteste zuerst": {
        this.items = this.sortService.sortItemsByPopularityDesc(this.items);
        this.sortService.setSortProperty('popularity');
        break;
      }
      case "Preis: Günstigster zuerst": {
        this.items = this.sortService.sortItemsByPriceAsc(this.items);
        this.sortService.setSortProperty('priceAsc');
        break;
      }
      case "Preis: Höchster zuerst": {
        this.items = this.sortService.sortItemsByPriceDesc(this.items);
        this.sortService.setSortProperty('priceDesc');
        break;
      }
      case "Nährwerte: Höchster Proteingehalt zuerst": {
        this.items = this.sortService.sortItemsByProteinDesc(this.items);
        this.sortService.setSortProperty('proteinDesc');
        break;
      }
      case "Nährwerte: Niedrigste Kalorien zuerst": {
        this.items = this.sortService.sortItemsByCaloriesAsc(this.items);
        this.sortService.setSortProperty('calorieAsc');
        break;
      }
    }
  };

  onChangePage() {
    this.paginateItems();
  }

}
