import { Nutrition } from "./nutrition.model";

export interface Item {
  iid: string;
  name: string;
  allergens: string[];
  averageBewertung: number;
  descriptionLong: string;
  descriptionShort: string;
  flavours: string[]
  img: string;
  nutritionImg: string;
  nutritionText: Nutrition;
  minPrice: number;
  minSize: string;
  popularity: number;
  shops: string[];
  categories: string[];
  bewertungen: string[];
  flavoursInShops: [{ sid: string, flavours: string[] }];
  pricesInShops: [{ sid: string, price: number }];
  urlsInShops: [{ sid: string, url: string }];
}