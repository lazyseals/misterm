import { Component, OnInit } from '@angular/core';
import { Item } from '../shared/item.model';
import { ItemService } from '../shared/item.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Shop } from '../shared/shop.model';
import { ShopService } from '../shared/shop.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {
  /**************************************************************************************************************
   * Class variables
   **************************************************************************************************************/
  // Item displayed
  private item: Item;
  // All shops that an item is available in 
  private shops: Shop[];
  // avaerage rating of the loaded item
  private durchschnittsBewertung: number;
  // HTML string representing stars between 0/5 to 5/5 depending on the average rating og the item
  private stars: string;
  // Matching of shopID to item price
  private shopItemPrice: Map<number, number>;

  /**
   * Constructor
   * @param route 
   * @param itemService 
   * @param shopService 
   */
  constructor(private route: ActivatedRoute, private itemService: ItemService, private shopService: ShopService) { }

  /**
   * Initialiser
   */
  ngOnInit() {
    let item_id = +this.route.snapshot.params['item_id'];
    this.route.params.subscribe(
      (params: Params) => {
        let item_id = +params['item_id'];
        this.item = this.itemService.getItemById(item_id);
        this.shops = this.shopService.getShopsByShopIDs(this.item.shops);
        this.durchschnittsBewertung = this.itemService.getDurchschnittsBewertung(item_id);
        this.stars = this.getStars(this.durchschnittsBewertung);
        this.shopItemPrice = this.setShopItemPrice();
        this.shops = this.sortShopsByPrice(this.shops);
      }
    );
    this.item = this.itemService.getItemById(item_id);
    this.shops = this.shopService.getShopsByShopIDs(this.item.shops);
    this.durchschnittsBewertung = this.itemService.getDurchschnittsBewertung(item_id);
    this.stars = this.getStars(this.durchschnittsBewertung);
    this.shops = this.sortShopsByPrice(this.shops);
  }

  sortShopsByPrice(shops: Shop[]) {
    shops.sort((a, b) => (this.getShopItemPriceByShopID(a.id) > this.getShopItemPriceByShopID(b.id) ? 1 : -1));
    return shops;
  }

  getShopItemPriceByShopID(id: number) {
    for (var shop of Array.from(this.shopItemPrice.values())) {
      if (id === shop[0]) {
        return shop[1];
      }
    }
  }

  private setShopItemPrice() {
    let shopIdToItemPrice = new Map<number, number>();

    for (var shop of this.shops) {
      shopIdToItemPrice.set(shop.id, this.shopService.getItempriceByShopID(this.item.id, shop.id));
    }

    return shopIdToItemPrice;
  }

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
  }

  /**
   * Redirects user to shop that he clicked
   * @param shop 
   */
  onShopClick(shop: Shop) {
    window.location.href = shop.url;
  }

}
