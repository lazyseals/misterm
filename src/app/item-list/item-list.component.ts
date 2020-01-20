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
  private category: Category;
  private cid: string;

  // Subcategories of category to be displayed
  private subCategories: Category[];
  private subCids: string[] = [];

  // All items in the category to be displayed
  private items: Item[];

  // True if app is fetching data from backend
  private isFetching = false;

  // Subscription to item changes due to filtering
  private itemsFilterSub: Subscription;

  // Subscriptions to item changes due to server loading
  private itemsServerSub: Subscription;

  // Number of items that are displayed on item-list page
  private numberOfItemsToDisplay = 24;

  // Page of pagination that is displayed
  private page = 1;

  // Number of pages. E.g. 70 items to display => collectionSize =  70 / 24 = 3
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

  /**
   * Is invoked with every item update.
   * Slices fetched items with respect to current page and number of items that need to be displayed.
   */
  paginateItems() {
    this.items = this.items.slice((this.page - 1) * this.numberOfItemsToDisplay, this.page * this.numberOfItemsToDisplay);
  }

  /**
   * Is invoked on initialisation. 
   * Fetches category, subcategories (if category is main) and items in this category from server.
   * Fetches items from filter service, which manipulates items on selected filters.
   * Asynchronous subscription that waits for response. 
   * Updates isFetchting property in order to show loading symbol on page.
   */
  fetchData() {
    // Set is fetching to true
    this.isFetching = true;
    // Get categories from backend
    this.categoryService.getCategories([this.cid])
      .subscribe(category => {
        // Set category at position 0, because only 1 catgory will be fetched, but is packed into array
        this.category = category[0];
        // Check if category is main and has subcategories
        if (this.category.main && this.category.subCategories.length > 0) {
          // Category has subcategories => Fetch them
          this.categoryService.getSubcategories(this.category.subCategories)
            .subscribe(subCategories => {
              // Set subcategories
              this.subCategories = subCategories;
              for (const subCategory of subCategories) {
                // Set subcategory cids
                this.subCids.push(subCategory.cid);
              }
              // Get items in each subcategory
              this.itemService.getItemsInCategories(this.subCids);
              this.itemsServerSub = this.itemService.getItemsUpdateListener()
                .subscribe(items => {
                  // Set is fetching to false (All necessary data is fetched)
                  this.isFetching = false;
                  // Set fetched items
                  this.items = items;
                  // Set collection size (number of pagination elements)
                  this.collectionSize = (this.items.length / this.numberOfItemsToDisplay) * 10;
                  // Slice fetched items to appropriate page
                  this.paginateItems();
                });
            });
        } else {
          // No subcategories => Fetch items from category
          this.itemService.getItemsInCategory(this.cid);
          this.itemsServerSub = this.itemService.getItemsUpdateListener()
            .subscribe(items => {
              // Set is fetching to false (All necessary data is fetched)
              this.isFetching = false;
              // Set fetched items
              this.items = items;
              // Set collection size (number of pagination elements)
              this.collectionSize = (this.items.length / this.numberOfItemsToDisplay) * 10;
              // Slice fetched items to appropriate page
              this.paginateItems();
            });
        }
      });
    // Subscribe to item updates due to filtering
    this.itemsFilterSub = this.filterService.getItemsUpdateListener()
      .subscribe((items: Item[]) => {
        // Set filtered items
        this.items = items;
        // Set page to 1, when new filter is selected
        this.page = 1;
        // Set collection size (number of pagination elements)
        this.collectionSize = (this.items.length / this.numberOfItemsToDisplay) * 10;
        // Slice fetched items to appropriate page
        this.paginateItems();
      });
  };

  /**
   * Is invoked on destruction of object.
   * Unsubscribes from all subscriptions.
   */
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

  /**
   * Is invoked when pagination page is changed. 
   * Fetches items from filterService, if filters are selected.
   * Fetches items from itemService, if no filters are selected.
   * Invokes pagination method to slice fetched items.
   */
  onChangePage() {
    // Check if filter is selected
    if (this.filterService.getSelectedCategories().size === 0 &&
      !this.filterService.getPriceFilterSelected() &&
      this.filterService.getSelectedFlavour().size === 0 &&
      this.filterService.getSelectedShop().size === 0 &&
      this.filterService.getSelectedAllergens().size === 0) {
      // No filter selected => Fetch items from items service
      this.items = this.itemService.getItems();
      // Paginate items (display only items on given page)
      this.paginateItems();
    } else {
      // Filter selected => Fetch items from filter service
      this.items = this.filterService.getItems();
      // Paginate items (display only items on given page)
      this.paginateItems();
    }
  }

}
