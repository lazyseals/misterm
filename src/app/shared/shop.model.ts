import { Item } from "./item.model";

export interface Shop {
  sid: string;
  name: string;
  img: string;
  shipping: number;
  shippingFree: number;
  deliveryTime: string;
  affiliateLink: string;
  itemPrices: Map<string, number>;
  itemUrls: Map<string, string>;
}