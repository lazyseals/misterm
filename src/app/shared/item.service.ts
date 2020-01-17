import { Item } from "./item.model";
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { throwError, Observable } from "rxjs";

@Injectable()
export class ItemService {
  // Current loaded items from backend that are available to user
  private items: Item[] = [];
  // Api base url for category requests
  private url = 'http://localhost:3000/api/items?';

  /**
   * Create categoryService class
   * @param http 
   */
  constructor(private http: HttpClient) { };

  /**
   * Get items in category with cid
   * @param cid 
   */
  getItemsInCategory(cid: string) {
    const query = "cid=" + cid;
    return this.http
      .get<{ items: Item[] }>(
        this.url + query
      )
      .pipe(
        map(data => {
          this.items = data.items;
          return this.items.slice();
        })
      );
  };

  getItemInCategory(cid: string, iid: string) {
    const query = "cid=" + cid + "&iid[]=" + iid;
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
