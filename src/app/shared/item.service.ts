import { Item } from "./item.model";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Subject, forkJoin, Observable } from "rxjs";

@Injectable()
export class ItemService {
  // Current loaded items from backend that are available to user
  private items: Item[] = [];

  // Subject to update components interested in loaded items
  private itemsUpdated = new Subject<Item[]>();

  // Api base url for category requests
  private url = 'http://localhost:3000/api/items?';

  /**
   * Create categoryService class
   * @param http 
   */
  constructor(private http: HttpClient) { };

  /**
   * Notify that items changed due to filtering
   */
  getItemsUpdateListener() {
    return this.itemsUpdated.asObservable();
  };

  /**
   * Return currently fetched items
   */
  getItems() {
    return this.items.slice();
  }

  /**
   * Get items in category with cid
   * @param cid 
   */
  getItemsInCategory(cid: string) {
    this.items = [];
    const query = "cid=" + cid;
    this.http
      .get<{ items: Item[] }>(
        this.url + query
      )
      .subscribe((data) => {
        this.items = data.items;
        this.itemsUpdated.next(this.items.slice());
      });
  };

  /**
   * Just returns items in category but doesn't set global items
   * @param cid 
   */
  private getItemsInCategoryHelper(cid: string) {
    const query = "cid=" + cid;
    return this.http
      .get<{ items: Item[] }>(
        this.url + query
      )
      .pipe(
        map(data => {
          return data.items;
        })
      );
  };

  /**
   * Get items in multiple categories
   * @param cids 
   */
  getItemsInCategories(cids: string[]) {
    this.items = [];
    cids.forEach((cid) => {
      this.getItemsInCategoryHelper(cid)
        .subscribe((items) => {
          this.items = this.items.concat(items);
          this.itemsUpdated.next(this.items.slice());
        })
    });
  };

  /**
   * Get single item with iid in category with cid
   * @param cid 
   * @param iid 
   */
  getItemInCategory(cid: string, iid: string) {
    this.items = [];
    const query = "cid=" + cid + "&iids[]=" + iid;
    return this.http
      .get<{ items: Item[] }>(
        this.url + query
      )
      .pipe(
        map(data => {
          this.items = data.items;
          return this.items[0];
        })
      );

  };

  /**
   * Get single item with iid in categories with cid in cids
   * @param cids 
   * @param iid 
   */
  getItemInCategories(cids: string[], iid: string) {
    let observableBatch = [];
    let query = "";

    cids.forEach((category, key) => {
      query = "cid=" + category + "&iids[]=" + iid;
      observableBatch.push(this.http
        .get<{ items: Item[] }>(
          this.url + query
        )
        .pipe(
          map(data => {
            if (data.items[0]) {
              this.items = data.items;
            }
            return data.items[0];
          })
        )
      );
    });

    return forkJoin(observableBatch);
  };

  /**
   * Returns item with given iid
   * @param iid
   */
  getItem(iid: string): Item {
    return this.items.find(i => i.iid === iid);
  };

  /**
   * Returns sids of all loaded items 
   */
  getShopsInItems() {
    let sids = new Set<string>([]);
    for (const item of this.items) {
      for (const sid of item.shops) {
        sids.add(sid);
      }
    }
    return Array.from(sids);
  };

  /**
   * Returns flavours of all loaded items
   */
  getFlavoursInItems() {
    let flavours = new Set<string>([]);
    for (const item of this.items) {
      for (const flavour of item.flavours) {
        flavours.add(flavour);
      }
    }
    return Array.from(flavours);
  };

  /**
   * Get price of item with iid in shop with sid 
   * @param iid 
   * @param sid 
   */
  getItemprice(iid: string, sid: string): number {
    const item = this.items.find(i => i.iid === iid);
    for (let priceToShop of item.pricesInShops) {
      if (sid === priceToShop.sid) {
        return priceToShop.price;
      }
    }
    return undefined;
  };

  /**
   * Get url of item with iid in shop with sid
   * @param iid 
   * @param sid 
   */
  getItemurl(iid: string, sid: string): string {
    const item = this.items.find(i => i.iid === iid);
    for (let urlToShop of item.urlsInShops) {
      if (sid === urlToShop.sid) {
        return urlToShop.url;
      }
    }
    return undefined;
  }
}
