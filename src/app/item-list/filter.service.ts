import { Item } from "../shared/item.model";
import { Subject } from "rxjs";
import { SortService } from "./sort.service";
import { Injectable } from "@angular/core";

@Injectable()
export class FilterService {
  // map from min price to max price for price ranges in filter bar
  private minToMaxPrice = new Map<number, number>([
    [0, 20],
    [20, 40],
    [40, 60],
    [60, 80]
  ]);
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
  // Items that will be filtered somehow
  private items: Item[] = [];
  private itemsUpdated = new Subject<Item[]>();

  constructor(
    private sortService: SortService
  ) { };

  /**
   * Notify that items changed due to filtering
   */
  getItemsUpdateListener() {
    return this.itemsUpdated.asObservable();
  };

  /**
   * Invoked by all click listener methods. Applies all filters and updates items that are seen by user.
   */
  updateItemsOnSelectedFilter() {
    // Save the filtered items
    let filtered_items: Item[] = [];

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
    this.items = this.sortService.sortItems(this.sortService.getSortProperty(), filtered_items);
    this.itemsUpdated.next(this.items.slice());
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

  setSelectedCategories(selectedCategories: Set<string>) {
    this.selectedCategories = selectedCategories;
  };

  setPriceFilterSelected(priceFilerSelected: boolean) {
    this.isPriceFilterSelected = priceFilerSelected;
  };

  setSelectedMinPrice(minPrice: number) {
    this.selectedMinPrice = minPrice;
  };

  setSelectedFlavour(flavour: Set<string>) {
    this.selectedFlavour = flavour;
  };

  setSelectedShop(shop: Set<string>) {
    this.selectedShop = shop;
  };

  setSelectedAllergens(allergens: Set<string>) {
    this.selectedAllergens = allergens;
  };

  setItems(items: Item[]) {
    this.items = items;
  };

  getSelectedCategories() {
    return this.selectedCategories;
  };

  getPriceFilterSelected() {
    return this.isPriceFilterSelected;
  };

  getSelectedMinPrice() {
    return this.selectedMinPrice;
  };

  getSelectedFlavour() {
    return this.selectedFlavour;
  };

  getSelectedShop() {
    return this.selectedShop;
  };

  getSelectedAllergens() {
    return this.selectedAllergens;
  };

  getItems() {
    return this.items;
  };
}