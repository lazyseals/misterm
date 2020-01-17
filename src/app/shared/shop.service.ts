import { Shop } from "./shop.model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";

@Injectable()
export class ShopService {
  // Current loaded shops from backend that are available to user
  private shops: Shop[] = [];
  // Api base url for shop requests
  private url = 'http://localhost:3000/api/shops?';

  /**
   * Create shopService class
   * @param http 
   */
  constructor(private http: HttpClient) { };

  /**
   * Get shops with given sids
   * @param sids 
   */
  getShops(sids: string[]) {
    let query: string = "";
    for (const sid of sids) {
      query += "sids[]=" + sid + "&";
    }
    // Remove last question mark
    query = query.substring(0, query.length - 1);
    return this.http
      .get<{ shops: Shop[] }>(
        this.url + query
      )
      .pipe(
        map(data => {
          this.shops = data.shops;
          return this.shops.slice();
        })
      );
  };

  /**
   * Get shop with given shop id
   * @param sid
   */
  getShop(sid: string) {
    return this.shops.find(i => i.sid === sid);
  };
}
