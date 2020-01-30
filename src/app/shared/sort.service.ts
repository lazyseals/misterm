import { Item } from "./item.model";

export class SortService {
  // Defines how the items should be sorted. 
  // Can be from [popularity, priceAsc, priceDesc, proteinDesc, "caloriesAsc]
  // Default: popularity
  private sortProperty = "popularity";

  /**
   * Sets new sort property
   * @param sortProperty 
   */
  setSortProperty(sortProperty: string) {
    this.sortProperty = sortProperty;
  }

  /**
   * Returns currently set sort property
   */
  getSortProperty() {
    return this.sortProperty;
  }

  /**
   * Sorts items by selected property. 
   * Property must be from [popularity, priceAsc, priceDesc, proteinDesc, "caloriesAsc]
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
}