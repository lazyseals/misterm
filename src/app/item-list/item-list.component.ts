import { Component, OnInit, Renderer2, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Item } from '../shared/item.model';
import { ItemService } from '../shared/item.service';
import { CategoryService } from '../shared/category.service';
import { Category } from '../shared/category.model';
import { Shop } from '../shared/shop.model';
import { ShopService } from '../shared/shop.service';
import { Subscription } from 'rxjs';

/**
 * Displays all items in a category. Offers filtering and sorting options.
 */
@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit, OnDestroy {

  /**************************************************************************************************************
   * Class variables
   **************************************************************************************************************/

  /**************************************************************************************************************
   * View Childs for price radio buttons
   **************************************************************************************************************/
  @ViewChild('bisZwanzig', { static: true }) bisZwanzig: ElementRef;
  @ViewChild('ZwanzigBisVierzig', { static: true }) zwanzigBisVierzig: ElementRef;
  @ViewChild('VierzigBisSechzig', { static: true }) vierzigBisSechzig: ElementRef;
  @ViewChild('SechzigBisAchtzig', { static: true }) sechzigBisAchtzig: ElementRef;
  @ViewChild('AbAchtzig', { static: true }) abAchtzig: ElementRef;

  /**************************************************************************************************************
   * Global properties
   **************************************************************************************************************/
  // map from min price to max price for price ranges in filter bar
  private minToMaxPrice = new Map<number, number>([
    [0, 20],
    [20, 40],
    [40, 60],
    [60, 80]
  ]);
  // unified name of the price radio buttons. Needed for reseting the price filter
  private priceRadioName = "price";
  // Defines how the items should be sorted. Can be from [popularity, priceAsc, priceDesc, proteinDesc, "caloriesAsc]
  private sortProperty = "popularity";

  /**************************************************************************************************************
   * Global category properties
   **************************************************************************************************************/
  // Category to be displayed
  private cid: string;
  private category: Category;
  private categorySub: Subscription;
  // Subcategories for filter
  private subCids: Array<string>;
  private subCategories: Array<Category>;
  private subCategorySub: Subscription;
  // All shops in the category to be displayed
  private shopsInCategory: Array<Shop>;
  private shopsSub: Subscription;
  // All geschmack in the category to be displayed
  private flavoursInCategory: Array<string>;
  // All items in the category to be displayed
  private items: Item[];
  private itemsSub: Subscription;

  /**************************************************************************************************************
   * Filter properties
   **************************************************************************************************************/
  // Selected subcategories filter from all subcategories in category
  private selectedCategories = new Set<string>([]);
  // True if a price filter is adapted
  private isPriceFilterSelected = false;
  // Selected min price of selected price range (Not dependend on selected category. Always display all price ranges)
  private selectedMinPrice: number = 0;
  // Selected geschmack filter from all geschmack in category
  private selectedFlavour = new Set<string>([]);
  // Selected shop filter from all shop in category
  private selectedShop = new Set<string>([]);
  // Selected allergen filter from all allergene (Not dependend on selected category. Always display 14 allergenes)
  private selectedAllergens = new Set<string>([]);

  /**************************************************************************************************************
   * Constructors
   **************************************************************************************************************/

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
    private shopService: ShopService,
    private renderer: Renderer2
  ) { };

  /**
   * Load items, shops and category from server
   */
  ngOnInit() {
    this.cid = this.route.snapshot.params['cid'];
    this.route.params.subscribe(
      (params: Params) => {
        this.cid = params['cid'];
        this.categoryService.getCategories([this.cid]);
        this.categorySub = this.categoryService.getCategoriesListener()
          .subscribe((categories: Category[]) => {
            this.category = categories[0];
          });
        if (this.isMainCategory()) {
          this.categoryService.getCategories(this.category.subCategories);
          this.subCategorySub = this.categoryService.getCategoriesListener()
            .subscribe((subCategories: Category[]) => {
              this.subCategories = subCategories;
            });
        }
        this.itemService.getItemsInCategory(this.cid);
        this.itemsSub = this.itemService.getItemsListener()
          .subscribe((items: Item[]) => {
            this.items = items;
          });
        this.shopService.getShops(this.itemService.getShopsInItems());
        this.shopsSub = this.shopService.getShopsListener()
          .subscribe((shops: Shop[]) => {
            this.shopsInCategory = shops;
          });
        this.flavoursInCategory = this.itemService.getFlavoursInItems();
      });
    this.categoryService.getCategories([this.cid]);
    this.categorySub = this.categoryService.getCategoriesListener()
      .subscribe((categories: Category[]) => {
        this.category = categories[0];
      });
    if (this.isMainCategory()) {
      this.categoryService.getCategories(this.category.subCategories);
      this.subCategorySub = this.categoryService.getCategoriesListener()
        .subscribe((subCategories: Category[]) => {
          this.subCategories = subCategories;
        });
    }
    this.itemService.getItemsInCategory(this.cid);
    this.itemsSub = this.itemService.getItemsListener()
      .subscribe((items: Item[]) => {
        this.items = items;
      });
    this.shopService.getShops(this.itemService.getShopsInItems());
    this.shopsSub = this.shopService.getShopsListener()
      .subscribe((shops: Shop[]) => {
        this.shopsInCategory = shops;
      });
    this.flavoursInCategory = this.itemService.getFlavoursInItems();
  };

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy() {
    this.itemsSub.unsubscribe();
    this.shopsSub.unsubscribe();
    this.categorySub.unsubscribe();
  };

  /**************************************************************************************************************
   * General helper methods
   **************************************************************************************************************/

  /**
   * Returns true, if class property category is of type MainCategory. Else it returns false.
   */
  isMainCategory() {
    if (this.category.main) {
      return true;
    } else {
      return false;
    }
  };

  /**************************************************************************************************************
   * Sort items methods
   **************************************************************************************************************/

  /**
   * Sorts items by selected property. Property must be from [popularity, priceAsc, priceDesc, proteinDesc, "caloriesAsc]
   * @param property 
   * @param items 
   */
  sortItems(property: string, items: Item[]) {
    switch (property) {
      case "popularity": return this.sortItemsByPopularityDesc(items);
      case "priceAsc": return this.sortItemsByPriceAsc(items);
      case "priceDesc": return this.sortItemsByPriceDesc(items);
      case "proteinDesc": return this.sortItemsByProteinDesc(items);
      case "caloriesAsc": return this.sortItemsByCaloriesAsc(items);
    }
  };

  /**
   * Returns items sorted by popularity descending
   * @param items 
   */
  sortItemsByPopularityDesc(items: Item[]) {
    items.sort((a, b) => (a.popularity < b.popularity) ? 1 : -1);
    return items;
  };

  /**
   * Returns items sorted by price descending
   * @param items 
   */
  sortItemsByPriceDesc(items: Item[]) {
    items.sort((a, b) => (a.minPrice < b.minPrice) ? 1 : -1);
    return items;
  };

  /**
   * Returns items sorted by price ascending
   * @param items 
   */
  sortItemsByPriceAsc(items: Item[]) {
    items.sort((a, b) => (a.minPrice > b.minPrice) ? 1 : -1);
    return items;
  };

  /**
   * Returns items sorted by protein descending
   * @param items 
   */
  sortItemsByProteinDesc(items: Item[]) {
    items.sort((a, b) => (a.nutritionText.proteins < b.nutritionText.proteins) ? 1 : -1);
    return items;
  };

  /**
   * Returns items sorted by calories ascending
   * @param items 
   */
  sortItemsByCaloriesAsc(items: Item[]) {
    items.sort((a, b) => (a.nutritionText.calories > b.nutritionText.calories) ? 1 : -1);
    return items;
  };

  /**************************************************************************************************************
   * Filter methods to filter global categories
   **************************************************************************************************************/

  /**
   * Invoked by all click listener methods. Applies all filters and updates items that are seen by user.
   */
  updateItemsOnSelectedFilter() {
    // Save the filtered items
    let filtered_items = [];

    // 1. Filter on selected Categories
    if (this.selectedCategories.size === 0) {
      filtered_items = this.items;
    } else {
      filtered_items = [];
      for (var category of Array.from(this.selectedCategories)) {
        for (const item of this.items) {
          if (item.category === category) {
            filtered_items.push(item);
          }
        }
      }
    }

    // 2. Filter on price only if price filter is selected
    if (this.isPriceFilterSelected) {
      if (this.selectedMinPrice === 80) {
        filtered_items = this.filterMinPrice(80, filtered_items);
      } else {
        filtered_items = this.filterPriceRange(this.selectedMinPrice, this.minToMaxPrice.get(this.selectedMinPrice), filtered_items);
      }
    }

    // 3. Filter on geschmack
    if (this.selectedFlavour.size !== 0) {
      filtered_items = this.filterGeschmack(this.selectedFlavour, filtered_items);
    }

    // 4. Filter on shop
    if (this.selectedShop.size !== 0) {
      filtered_items = this.filterShop(this.selectedShop, filtered_items);
    }

    // 5. Filter on allergene
    if (this.selectedAllergens.size !== 0) {
      filtered_items = this.filterAllergene(this.selectedAllergens, filtered_items);
    }

    // 6. Sort items
    this.items = this.sortItems(this.sortProperty, filtered_items);
  };

  /**
   * Returns all items in item who don't have the selected allergene
   * @param allergene 
   * @param items 
   */
  filterAllergene(allergens: Set<string>, items: Item[]) {
    // Save the filtered items
    let filtered_items_having_allergene = new Set([]);

    // Iterate over all allergenes of all items and save items which have the selected allergenes
    for (var item of items) {
      for (var itemAllergen of item.allergens) {
        for (var selectedAllergene of Array.from(allergens)) {
          if (selectedAllergene === itemAllergen) {
            filtered_items_having_allergene.add(item);
            continue;
          }
        }
      }
    }

    // Runs over items and reduce it to elements who are in items and missing in having_alergene
    let filtered_items_havent_allergene: Item[] = items.filter(i => Array.from(filtered_items_having_allergene).indexOf(i) < 0)
    return Array.from(filtered_items_havent_allergene);
  };

  /**
   * Returns all items in item whose shop id is in selected shop id. 
   * @param sids 
   * @param items 
   */
  filterShop(sids: Set<string>, items: Item[]) {
    // Save the filtered items
    let filtered_items = new Set([]);

    // Iterate over all shop ids of all items and save items which have the selected shop ids
    for (var item of items) {
      for (var sid of item.shops) {
        for (var selectedSid of Array.from(sids)) {
          if (sid === selectedSid) {
            filtered_items.add(item);
            continue;
          }
        }
      }
    }

    // Return filtered items
    return Array.from(filtered_items);
  };

  /**
   * Returns all items in item whose flavour is in selected geschmack.
   * @param flavour 
   * @param items 
   */
  filterGeschmack(flavours: Set<string>, items: Item[]) {
    // Save the filtered items
    let filtered_items = new Set([]);

    // Iterate over all geschmack of all items and save items which have the selected geschmack
    for (var item of items) {
      for (var itemFlavour of item.flavours) {
        for (var selectedFlavour of Array.from(flavours)) {
          if (itemFlavour === selectedFlavour) {
            filtered_items.add(item);
            continue;
          }
        }
      }
    }

    // Return filtered items
    return Array.from(filtered_items);
  };

  /**
   * Returns all items in item whose price is at least minPrice.
   * @param minPrice 
   * @param items 
   */
  filterMinPrice(minPrice: number, items: Item[]) {
    // Save the filtered items
    let filtered_items = [];

    // Iterate over all items and save items whose price is greater than the min price
    for (var item of items) {
      if (minPrice <= item.minPrice) {
        filtered_items.push(item);
      }
    }

    // Return filtered items
    return filtered_items;
  };

  /**
   * Returns all items in item whose price is at least minPrice and at most maxPrice.
   * @param minPrice 
   * @param maxPrice 
   * @param items 
   */
  filterPriceRange(minPrice: number, maxPrice: number, items: Item[]) {
    // Save the filtered items
    let filtered_items = [];

    // Iterate over all items and save items whose price is between the min and max price
    for (var item of items) {
      if ((item.minPrice <= maxPrice) && (minPrice <= item.minPrice)) {
        filtered_items.push(item);
      }
    }

    // Return filtered items
    return filtered_items;
  };

  /**************************************************************************************************************
   * Click Filter Listeners
   **************************************************************************************************************/

  /**
   * Is invoked, if a price range is selected. Updates filter property selectedMinPrice and updates item view for user by 
   * applying all filters in method updateItemsOnSelectedFitler.
   * @param minPrice 
   */
  onPriceSelected(minPrice: number) {
    this.isPriceFilterSelected = true;
    this.selectedMinPrice = minPrice;
    this.updateItemsOnSelectedFilter();
  };

  /**
   * Is invokes, if a category is selected. Updates filter property selectedCategories and updates item view for user by
   * applying all filters in method updateItemsOnSelectedFitler.
   * @param cid
   */
  onCategorySelected(cid: string) {
    if (this.selectedCategories.has(cid)) {
      this.selectedCategories.delete(cid);
      this.updateItemsOnSelectedFilter();
    } else {
      this.selectedCategories.add(cid);
      this.updateItemsOnSelectedFilter();
    }
  };

  /**
   * Is invoked, if a geschmack is selected. Updates filter property selectedFlavour and updates item view for user by
   * applying all filters in method updateItemsOnSelectedFitler.
   * @param flavour 
   */
  onFlavourSelected(flavour: string) {
    if (this.selectedFlavour.has(flavour)) {
      this.selectedFlavour.delete(flavour);
      this.updateItemsOnSelectedFilter();
    } else {
      this.selectedFlavour.add(flavour);
      this.updateItemsOnSelectedFilter();
    }
  };

  /**
   * Is invoked, if a hersteller is selected. Updates filter property selectedShop and updates item view for user by
   * applying all filters in method updateItemsOnSelectedFitler.
   * @param sid
   */
  onHerstellerSelected(sid: string) {
    if (this.selectedShop.has(sid)) {
      this.selectedShop.delete(sid);
      this.updateItemsOnSelectedFilter();
    } else {
      this.selectedShop.add(sid);
      this.updateItemsOnSelectedFilter();
    }
  };

  /**
   * Is invoked, if an allergen is selected. Updates filter property selectedAllergene and updates item view for user by
   * applying all filters in method updateItemsOnSelectedFitler.
   * @param allergen 
   */
  onAllergenSelected(allergen: string) {
    if (this.selectedAllergens.has(allergen)) {
      this.selectedAllergens.delete(allergen);
      this.updateItemsOnSelectedFilter();
    } else {
      this.selectedAllergens.add(allergen);
      this.updateItemsOnSelectedFilter();
    }
  };

  /**
   * Is invoked, if the price is reseted. Sets isPriceFilterSelected and all checked property of the price radio buttons to false. 
   * Sets name of all radio buttons to null. Updates item view for user by applying all filters in method updateItemsOnSelectedFitler.
   */
  onPriceReset() {
    // Set price filter selected to false
    this.isPriceFilterSelected = false;

    // Set checked property of all radio buttons to false
    this.bisZwanzig.nativeElement.checked = false;
    this.zwanzigBisVierzig.nativeElement.checked = false;
    this.vierzigBisSechzig.nativeElement.checked = false;
    this.sechzigBisAchtzig.nativeElement.checked = false;
    this.abAchtzig.nativeElement.checked = false;

    // Set name attribute of all radio buttons to null
    this.priceRadioName = null;

    // Update items
    this.updateItemsOnSelectedFilter();
  };

  onSetPrice(price: number) {
    // TODO
    this.isPriceFilterSelected = true;
    this.selectedMinPrice = price;
    this.updateItemsOnSelectedFilter();
  };

  /**************************************************************************************************************
   * Click Sort Listeners
   **************************************************************************************************************/

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
        this.items = this.sortItemsByPopularityDesc(this.items);
        this.sortProperty = "popularity";
        break;
      }
      case "Preis: Günstigster zuerst": {
        this.items = this.sortItemsByPriceAsc(this.items);
        this.sortProperty = "priceAsc";
        break;
      }
      case "Preis: Höchster zuerst": {
        this.items = this.sortItemsByPriceDesc(this.items);
        this.sortProperty = "priceDesc";
        break;
      }
      case "Nährwerte: Höchster Proteingehalt zuerst": {
        this.items = this.sortItemsByProteinDesc(this.items);
        this.sortProperty = "proteinDesc";
        break;
      }
      case "Nährwerte: Niedrigste Kalorien zuerst": {
        this.items = this.sortItemsByCaloriesAsc(this.items);
        this.sortProperty = "calorieAsc";
        break;
      }
    }
  };

}
