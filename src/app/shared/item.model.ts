import { Nutrition } from "./nutrition.model";

export interface Item {
  iid: string;
  name: string;
  allergens: string[];
  averageBewertung: number;
  descriptionLong: string;
  descriptionShort: string;
  flavours: string[];
  img: string;
  nutritionImg: string;
  nutritionText: Nutrition;
  minPrice: number;
  minSize: string;
  popularity: number;
  shops: string[];
  category: string;
  bewertungen: string[];
  pricesInShops: [{ sid: string, price: number }];
  urlsInShops: [{ sid: string, url: string }];
}