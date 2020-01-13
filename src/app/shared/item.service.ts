import { Item } from "./item.model";
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class ItemService {
  // Current loaded items from backend that are available to user
  private items: Item[] = [];
  private itemsFetched = new Subject<Item[]>();
  // Api base url for category requests
  private url = 'http://localhost:3000/api/items?';

  /**
   * Create categoryService class
   * @param http 
   */
  constructor(private http: HttpClient) { };

  /**
   * Notfies observers when items are fetched from server
   */
  getItemsListener() {
    return this.itemsFetched.asObservable();
  };

  /**
   * Get items with given iids
   * @param iids 
   */
  getItems(iids: string[]) {
    const query = "items=" + iids;
    this.http.get<{ items: Item[] }>(this.url + query)
      .subscribe((data) => {
        this.items = data.items;
        this.itemsFetched.next(this.items.slice());
      });
  };

  /**
   * Get items in category with cid
   * @param cid 
   */
  getItemsInCategory(cid: string) {
    const query = "category=" + cid;
    this.http.get<{ items: Item[] }>(this.url + query)
      .subscribe((data) => {
        this.items = data.items;
        this.itemsFetched.next(this.items.slice());
      });
  };

  /**
   * Returns item with given iid
   * @param iid
   */
  getItem(iid: string) {
    return this.items.find(i => i.iid === iid);
  };

  /**
   * Returns sids of all loaded items 
   */
  getShopsInItems() {
    let sids = new Set<string>([]);
    for (const item of this.items) {
      for (const sid in item.shops) {
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
    item.pricesInShops.forEach((price, sID) => {
      if (sid === sID) {
        return price;
      }
    });
    return undefined;
  };

  /**
   * Get url of item with iid in shop with sid
   * @param iid 
   * @param sid 
   */
  getItemurl(iid: string, sid: string): string {
    const item = this.items.find(i => i.iid === iid);
    item.urlsInShops.forEach((url, sID) => {
      if (sid === sID) {
        return url;
      }
    });
    return undefined;
  }
}
