import { Shop } from "./shop.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class ShopService {
  // Current loaded shops from backend that are available to user
  private shops: Shop[] = [];
  private shopsFetched = new Subject<Shop[]>();
  // Api base url for shop requests
  private url = 'http://localhost:3000/api/shops?';

  /**
   * Create shopService class
   * @param http 
   */
  constructor(private http: HttpClient) { };

  /**
   * Notifies observers when items are fetched from server
   */
  getShopsListener() {
    return this.shopsFetched.asObservable();
  };

  /**
   * Get shops with given sids
   * @param sids 
   */
  getShops(sids: string[]) {
    const query = "shops=" + sids;
    this.http.get<{ shops: Shop[] }>(this.url + query)
      .subscribe((data) => {
        this.shops = data.shops;
        this.shopsFetched.next(this.shops.slice());
      });
  };

  /**
   * Get shop with given shop id
   * @param sid
   */
  getShop(sid: string) {
    return this.shops.find(i => i.sid === sid);
  };
}
