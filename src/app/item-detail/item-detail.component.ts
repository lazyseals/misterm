import { Component, OnInit, OnDestroy } from '@angular/core';
import { Item } from '../shared/item.model';
import { ActivatedRoute, Params } from '@angular/router';
import { Shop } from '../shared/shop.model';
import { ItemService } from 'app/shared/item.service';
import { Subscription } from 'rxjs';
import { ShopService } from 'app/shared/shop.service';
import { Bewertung } from 'app/shared/bewertung.model';
import { BewertungService } from 'app/shared/bewertung.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit, OnDestroy {
  /**************************************************************************************************************
   * Class variables
   **************************************************************************************************************/
  // Item displayed
  private item: Item;
  // All shops that an item is available in 
  private shops: Shop[];
  // All bewertungen for item
  private bewertungen: Bewertung[];
  // HTML string representing stars between 0/5 to 5/5 depending on the average rating og the item
  private stars: string;
  // Matching of shopID to item price
  private shopItemPrice: Map<string, number>;
  // Waiting for shops to be loaded from backend
  private shopsSub: Subscription;
  // Waiting for bewertungen to be loaded from backend
  private bewertungenSub: Subscription;

  /**
   * Constructor
   * @param route 
   * @param itemService 
   * @param shopService 
   */
  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private shopService: ShopService,
    private bewertungService: BewertungService
  ) { };

  /**
   * Loads items, shops and bewertungen from server
   */
  ngOnInit() {
    const cid: string = this.route.snapshot.params['cid'];
    const iid: string = this.route.snapshot.params['iid'];
    this.route.params.subscribe(
      (params: Params) => {
        const iid: string = params['iid'];
        const cid: string = this.route.snapshot.params['cid'];
        this.item = this.itemService.getItem(iid);
        this.shopService.getShops(this.item.shops);
        this.shopsSub = this.shopService.getShopsListener()
          .subscribe((shops: Shop[]) => {
            this.shops = this.sortShopsByPrice(shops);
          });
        this.shopItemPrice = this.setShopItemPrice();
        this.bewertungService.getBewertungen(this.item.bewertungen);
        this.bewertungenSub = this.bewertungService.getBewertungenListener()
          .subscribe((bewertungen: Bewertung[]) => {
            this.bewertungen = bewertungen;
          });
        this.stars = this.getStars(this.item.averageBewertung);
      }
    );
    this.item = this.itemService.getItem(iid);
    this.shopService.getShops(this.item.shops);
    this.shopsSub = this.shopService.getShopsListener()
      .subscribe((shops: Shop[]) => {
        this.shops = this.sortShopsByPrice(shops);
      });
    this.shopItemPrice = this.setShopItemPrice();
    this.bewertungService.getBewertungen(this.item.bewertungen);
    this.bewertungenSub = this.bewertungService.getBewertungenListener()
      .subscribe((bewertungen: Bewertung[]) => {
        this.bewertungen = bewertungen;
      });
    this.stars = this.getStars(this.item.averageBewertung);
  };

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy() {
    this.bewertungenSub.unsubscribe();
    this.shopsSub.unsubscribe();
  };

  /**
   * Sorts loaded shops by price ascending
   * @param shops 
   */
  private sortShopsByPrice(shops: Shop[]) {
    shops.sort((a, b) => (this.getShopItemPrice(a.sid) > this.getShopItemPrice(b.sid) ? 1 : -1));
    return shops;
  };

  /**
   * 
   * @param sid
   */
  private getShopItemPrice(sid: string) {
    this.shopItemPrice.forEach((price: number, _sid: string) => {
      if (sid === _sid) {
        return price;
      }
    });
  };

  private setShopItemPrice() {
    let sidToItemPrice = new Map<string, number>();

    for (var shop of this.shops) {
      sidToItemPrice.set(shop.sid, this.shopService.getItemprice(this.item.iid, shop.sid));
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
    window.location.href = this.shopService.getItemurl(this.item.iid, sid);
  };

}
