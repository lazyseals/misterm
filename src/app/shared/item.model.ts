import { Category } from './category.model';
import { Bewertung } from './bewertung.model';
import { Shop } from './shop.model';
import { Naehrwert } from './naehrwert.model';
import { ShopService } from './shop.service';
import { OnInit } from '@angular/core';

export class Item {
  private shopService: ShopService = new ShopService();

  // Properties that are fetched from ShopService on constructing 
  public price: number;
  public shops: number[]

  constructor(
    public id: number,
    public name: string,
    public description_short: string,
    public description_long: string,
    public bewertungen: Bewertung[],
    public imagePath: string,
    public labelImagePath: string,
    public category: Category,
    public geschmack: string[],
    public allergene: string[],
    public naehrwerte: Naehrwert,
    public popularity: number
  ) {
    this.shops = this.getShops();
    this.price = this.getLowestPrice();
  }

  private getShops() {
    return this.shopService.getShopIDsByItemID(this.id);
  }

  private getLowestPrice() {
    let round: number = 0;
    let lowestPrice: number;
    for (var shopID of this.shops) {
      if (round === 0) {
        lowestPrice = this.shopService.getItempriceByShopID(this.id, shopID);
      } else {
        lowestPrice = Math.min(lowestPrice, this.shopService.getItempriceByShopID(this.id, shopID));
      }
    }
    return lowestPrice;
  }
}