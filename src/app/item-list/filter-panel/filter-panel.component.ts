import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Category } from 'app/shared/category.model';
import { Shop } from 'app/shared/shop.model';
import { ItemService } from 'app/shared/item.service';
import { CategoryService } from 'app/shared/category.service';
import { ShopService } from 'app/shared/shop.service';
import { FilterService } from '../filter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss']
})
export class FilterPanelComponent implements OnInit, OnDestroy {
  @Input() private category: Category;
  @Input() private subCategories: Array<Category>;

  // View childs for proce radio buttons
  @ViewChild('bisZwanzig', { static: true }) bisZwanzig: ElementRef;
  @ViewChild('ZwanzigBisVierzig', { static: true }) zwanzigBisVierzig: ElementRef;
  @ViewChild('VierzigBisSechzig', { static: true }) vierzigBisSechzig: ElementRef;
  @ViewChild('SechzigBisAchtzig', { static: true }) sechzigBisAchtzig: ElementRef;
  @ViewChild('AbAchtzig', { static: true }) abAchtzig: ElementRef;

  // unified name of the price radio buttons. Needed for reseting the price filter
  private priceRadioName = "price";
  // Subcategories for filter
  private subCids: Array<string>;
  // All shops in the category to be displayed
  private shopsInCategory: Array<Shop>;
  // All geschmack in the category to be displayed
  private flavoursInCategory: Array<string>;
  // Subscriptions to item changes due to server loading
  private itemsServerSub: Subscription;
  // True if more flavours should be displayed
  private displayMoreFlavours = false;
  // Flavours that are displayed
  private flavoursToBeDisplayed: Array<string>;

  /**
   * Create filter panel
   * @param itemService 
   * @param categoryService 
   * @param shopService 
   * @param filterService 
   */
  constructor(
    private itemService: ItemService,
    private categoryService: CategoryService,
    private shopService: ShopService,
    private filterService: FilterService,
  ) { };

  /**
   * Load shops and subcategories from server
   */
  ngOnInit() {
    this.itemService.getItemsUpdateListener()
      .subscribe(items => {
        this.shopService.getShops(this.itemService.getShopsInItems())
          .subscribe(shops => {
            this.shopsInCategory = shops;
          });
        this.flavoursInCategory = this.itemService.getFlavoursInItems();
        this.flavoursToBeDisplayed = this.flavoursInCategory.slice(0, 10);
      });
  };

  ngOnDestroy() {
    if (this.itemsServerSub) {
      this.itemsServerSub.unsubscribe();
    }
  }

  /**
   * Is invoked, if a price range is selected. Updates filter property selectedMinPrice and updates item view for user by 
   * applying all filters in method updateItemsOnSelectedFitler.
   * @param minPrice 
   */
  onPriceSelected(minPrice: number) {
    this.filterService.setPriceFilterSelected(true);
    this.filterService.setSelectedMinPrice(minPrice);
    this.filterService.updateItemsOnSelectedFilter();
  };

  /**
   * Is invokes, if a category is selected. Updates filter property selectedCategories and updates item view for user by
   * applying all filters in method updateItemsOnSelectedFitler.
   * @param cid
   */
  onCategorySelected(cid: string) {
    let categories = this.filterService.getSelectedCategories();
    if (categories.has(cid)) {
      categories.delete(cid);
      this.filterService.setSelectedCategories(categories);
      this.filterService.updateItemsOnSelectedFilter();
    } else {
      categories.add(cid);
      this.filterService.setSelectedCategories(categories);
      this.filterService.updateItemsOnSelectedFilter();
    }
  };

  /**
   * Is invoked, if a geschmack is selected. Updates filter property selectedFlavour and updates item view for user by
   * applying all filters in method updateItemsOnSelectedFitler.
   * @param flavour 
   */
  onFlavourSelected(flavour: string) {
    let flavours = this.filterService.getSelectedFlavour();
    if (flavours.has(flavour)) {
      flavours.delete(flavour);
      this.filterService.setSelectedFlavour(flavours);
      this.filterService.updateItemsOnSelectedFilter();
    } else {
      flavours.add(flavour);
      this.filterService.setSelectedFlavour(flavours);
      this.filterService.updateItemsOnSelectedFilter();
    }
  };

  /**
   * Is invoked, if a hersteller is selected. Updates filter property selectedShop and updates item view for user by
   * applying all filters in method updateItemsOnSelectedFitler.
   * @param sid
   */
  onHerstellerSelected(sid: string) {
    let shops = this.filterService.getSelectedShop();
    if (shops.has(sid)) {
      shops.delete(sid);
      this.filterService.updateItemsOnSelectedFilter();
    } else {
      shops.add(sid);
      this.filterService.setSelectedShop(shops);
      this.filterService.updateItemsOnSelectedFilter();
    }
  };

  /**
   * Is invoked, if an allergen is selected. Updates filter property selectedAllergene and updates item view for user by
   * applying all filters in method updateItemsOnSelectedFitler.
   * @param allergen 
   */
  onAllergeneSelected(allergen: string) {
    let allergens = this.filterService.getSelectedAllergens();
    if (allergens.has(allergen)) {
      allergens.delete(allergen);
      this.filterService.setSelectedAllergens(allergens);
      this.filterService.updateItemsOnSelectedFilter();
    } else {
      allergens.add(allergen);
      this.filterService.setSelectedAllergens(allergens);
      this.filterService.updateItemsOnSelectedFilter();
    }
  };

  /**
   * Is invoked, if the price is reseted. Sets isPriceFilterSelected and all checked property of the price radio buttons to false. 
   * Sets name of all radio buttons to null. Updates item view for user by applying all filters in method updateItemsOnSelectedFitler.
   */
  onPriceReset() {
    // Set price filter selected to false
    this.filterService.setPriceFilterSelected(false);

    // Set checked property of all radio buttons to false
    this.bisZwanzig.nativeElement.checked = false;
    this.zwanzigBisVierzig.nativeElement.checked = false;
    this.vierzigBisSechzig.nativeElement.checked = false;
    this.sechzigBisAchtzig.nativeElement.checked = false;
    this.abAchtzig.nativeElement.checked = false;

    // Set name attribute of all radio buttons to null
    this.priceRadioName = null;

    // Update items
    this.filterService.updateItemsOnSelectedFilter();
  };

  onSetPrice(price: number) {
    // TODO
    this.filterService.setPriceFilterSelected(true);
    this.filterService.setSelectedMinPrice(price);
    this.filterService.updateItemsOnSelectedFilter();
  };

  onMoreFlavours() {
    this.flavoursToBeDisplayed = this.flavoursInCategory;
  };

  equals(array1, array2) {
    return array1.length === array2.length && array1.sort().every(function (value, index) { return value === array2.sort()[index] });
  };

  flavoursContainElements() {
    for (const flavour of this.flavoursInCategory) {
      if (flavour !== 'null' && flavour !== '') {
        return true;
      }
    }
    return false;
  };

}
