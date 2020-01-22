import { Component, OnInit } from '@angular/core';
import { Item } from '../shared/item.model';
import { ActivatedRoute, Params } from '@angular/router';
import { Shop } from '../shared/shop.model';
import { ItemService } from 'app/shared/item.service';
import { ShopService } from 'app/shared/shop.service';
import { Bewertung } from 'app/shared/bewertung.model';
import { BewertungService } from 'app/shared/bewertung.service';
import { CategoryService } from 'app/shared/category.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {
  // Item to be displayed
  private item: Item;

  // All shops that an item is available in 
  private shops: Shop[];

  // All bewertungen for item
  private bewertungen: Bewertung[];

  // HTML string representing stars between 0/5 to 5/5 depending on the average rating og the item
  private stars: string;

  // Matching of shopID to item price
  private shopItemPrice: Map<string, number>;

  // True if component fetches data from backend
  private isFetching = false;

  /**
   * Constructor
   * @param route 
   * @param itemService 
   * @param shopService 
   * @param bewertungService 
   */
  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private shopService: ShopService,
    private bewertungService: BewertungService,
    private categoryService: CategoryService
  ) { };

  /**
   * Loads items, shops and bewertungen from server
   */
  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        const iid: string = params['iid'];
        const cid: string = this.route.snapshot.params['cid'];
        this.fetchData(cid, iid);
      }
    );
  };

  /**
   * Fetches item, its category and its shop from server. 
   * Calculates star based on item avaerage bewertung.
   * @param cid 
   * @param iid 
   */
  fetchData(cid: string, iid: string) {
    // Set isFetching to true
    this.isFetching = true;
    // Check if item is undefined => Only if invoked directly
    if (this.itemService.getItem(iid)) {
      // Get fetched item from item service
      this.item = this.itemService.getItem(iid);
      // Set is Fetching to false
      this.isFetching = false;
      // Get shops and bewertungen
      this.fetchAdditionalItemData();
    }
    else {
      // Item needs to be loaded from one of the subcategories
      this.fetchItemInSubcategories(cid, iid);
    }
  };

  /**
   * Fetches item and necessary data in subCategories of category 
   * @param cid 
   */
  private fetchItemInSubcategories(cid: string, iid: string) {
    // Get categories from backend
    this.categoryService.getCategories([cid])
      .subscribe(fetchedCategory => {
        // Set category at position 0, because only 1 catgory will be fetched, but is packed into array
        const category = fetchedCategory[0];
        // Check if category is main and has subcategories
        if (category.main && category.subCategories.length > 0) {
          // Category has subcategories => Fetch them
          this.categoryService.getSubcategories(category.subCategories)
            .subscribe(subCategories => {
              // Set subcategories
              let subCids = [];
              for (const subCategory of subCategories) {
                // Set subcategory cids
                subCids.push(subCategory.cid);
              }
              // Get item from one of the subcategories
              this.itemService.getItemInCategories(subCids, iid)
                .subscribe((items: Item[]) => {
                  for (let item of items) {
                    if (item) {
                      this.isFetching = false;
                      // Set fetched item
                      this.item = item;
                      // Get shops and bewertungen
                      this.fetchAdditionalItemData();
                    }
                  }
                });
            });
        }
      });
  }

  /**
   * Fetches shop and bewertungen from server for required item.
   */
  private fetchAdditionalItemData() {
    // Check if item is available in a shop
    if (this.item && this.item.shops && this.item.shops.length > 0) {
      // Item shop is available
      this.shopService.getShops(this.item.shops)
        .subscribe(shops => {
          // Set shops in which an item is available in
          this.shops = this.sortShopsByPrice(shops);
          // Set item price foreach shop
          this.shopItemPrice = this.setShopItemPrice();
        });
    } else {
      // No shop available for this item
      console.log('Shop undefined');
    }
    // Check if bewertung for item is available
    if (this.item && this.item.bewertungen && this.item.bewertungen.length > 0) {
      // Bewertung for item is available
      this.bewertungService.getBewertungen(this.item.bewertungen)
        .subscribe(bewertungen => {
          // Set fetched bewertungen
          this.bewertungen = bewertungen;
        });
    } else {
      // No bewertungen available for item
      console.log('Bewertungen undefined');
    }
    // Calculate html string stars for item bewertung
    if (this.item) {
      this.stars = this.getStars(this.item.averageBewertung);
    }
  }

  /**
   * Sorts loaded shops by price ascending
   * @param shops 
   */
  private sortShopsByPrice(shops: Shop[]) {
    shops.sort((a, b) => (this.getShopItemPrice(a.sid) > this.getShopItemPrice(b.sid) ? 1 : -1));
    return shops;
  };

  /**
   * Get price of item in shop with sid
   * @param sid
   */
  private getShopItemPrice(sid: string) {
    let shopPrice: Number;
    this.shopItemPrice.forEach((price: number, _sid: string) => {
      if (sid === _sid) {
        shopPrice = price;
      }
    });
    return shopPrice;
  };

  /**
   * Foreach fetched shop set item price. 
   * Fetched from item service.
   */
  private setShopItemPrice() {
    let sidToItemPrice = new Map<string, number>();

    for (var shop of this.shops) {
      sidToItemPrice.set(shop.sid, this.itemService.getItemprice(this.item.iid, shop.sid));
    }

    return sidToItemPrice;
  };

  /**
   * Returns HTML star string based on average rating
   * @param durchschnittsBewertung 
   */
  private getStars(durchschnittsBewertung: number) {
    if (durchschnittsBewertung < 1.0) {
      return "&#9734; &#9734; &#9734; &#9734; &#9734;";
    } else if (1.0 <= durchschnittsBewertung && durchschnittsBewertung < 2.0) {
      return "&#9733; &#9734; &#9734; &#9734; &#9734;";
    } else if (2.0 <= durchschnittsBewertung && durchschnittsBewertung < 3.0) {
      return "&#9733; &#9733; &#9734; &#9734; &#9734;";
    } else if (3.0 <= durchschnittsBewertung && durchschnittsBewertung < 4.0) {
      return "&#9733; &#9733; &#9733; &#9734; &#9734;";
    } else if (4.0 <= durchschnittsBewertung && durchschnittsBewertung < 5.0) {
      return "&#9733; &#9733; &#9733; &#9733; &#9734;";
    } else {
      return "&#9733; &#9733; &#9733; &#9733; &#9733;";
    }
  };

  /**
   * Redirects user to shop that he clicked
   * @param sid
   */
  onShopClick(sid: string) {
    window.open(this.itemService.getItemurl(this.item.iid, sid));
  };

  /**
   * Scroll to component
   * @param el 
   */
  scroll(el: HTMLElement) {
    el.scrollIntoView();
  };
}
