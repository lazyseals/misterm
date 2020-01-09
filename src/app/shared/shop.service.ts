import { Shop } from './shop.model';

export class ShopService {
  // Current loaded items from backend that are available to user
  private shops: Shop[] = [
    new Shop(1, 'Body and Fit', new Map([
      [1, 6.5],
      [2, 7.6],
      [3, 5.3],
      [4, 3.6],
      [5, 7.8],
      [6, 2.5],
      [9, 1.5],
      [10, 1.8]
    ]), '../assets/img/body_and_fit.jpg', 'https://www.bodyandfit.com/de-de'),
    new Shop(2, 'Amazon', new Map([
      [2, 7.5],
      [3, 5.4],
      [7, 7.8],
      [8, 5.6]
    ]), '../assets/img/amazon.png', 'https://www.amazon.de/')
  ];

  /**
   * Get list of all loaded shops 
   */
  getShops() {
    return this.shops.slice();
  }

  /**
   * Get shop with given shop id
   * @param id 
   */
  getShopByShopID(id: number) {
    return this.shops.find(i => i.id === id);
  }

  /**
   * Get all shops with given list of shop ids
   * @param ids 
   */
  getShopsByShopIDs(ids: number[]) {
    let allShops = [];
    for (var id of ids) {
      allShops.push(this.getShopByShopID(id));
    }
    return allShops;
  }

  getItempriceByShopID(itemID: number, shopID: number) {
    let shop = this.getShopByShopID(shopID);
    for (var item of Array.from(shop.items.keys())) {
      if (item === itemID) {
        return shop.items.get(item);
      }
    }
  }

  /**
   * Get all shops that deliver item
   * @param id
   */
  getShopIDsByItemID(id: number) {
    let allShops = [];

    for (var shop of this.shops) {
      for (var item of Array.from(shop.items.keys())) {
        if (item === id) {
          allShops.push(shop.id);
          break;
        }
      }
    }

    return allShops;

  }
}