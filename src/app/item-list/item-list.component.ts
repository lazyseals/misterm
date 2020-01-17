import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Item } from '../shared/item.model';
import { ItemService } from '../shared/item.service';
import { CategoryService } from '../shared/category.service';
import { Category } from '../shared/category.model';
import { FilterService } from '../shared/filter.service';
import { SortService } from '../shared/sort.service';
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
  // All items in the category to be displayed
  private items: Item[];
  // True if app is fetching data from backend
  private isFetching = false;
  // Subscription to item changes due to filtering
  private itemsFilterSub: Subscription;
  // Subscriptions to item changes due to server loading
  private itemsServerSub: Subscription;

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
    this.cid = this.route.snapshot.params['cid'];
    // Subscribe to route changes
    this.route.params.subscribe(
      (params: Params) => {
        this.cid = params['cid'];
      }
    );
    // End subscription
    this.categoryService.getCategories([this.cid])
      .subscribe(category => {
        this.category = category[0];
        this.itemService.getItemsInCategory(this.cid);
        this.itemsServerSub = this.itemService.getItemsUpdateListener()
          .subscribe(items => {
            this.items = items;
          });
      });
    this.itemsFilterSub = this.filterService.getItemsUpdateListener()
      .subscribe((items: Item[]) => {
        this.items = items;
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

}
