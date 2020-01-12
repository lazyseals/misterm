import { Category } from './category.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class CategoryService {
  // Current loaded categories from backend that are available to user
  private categories: Category[] = [];
  private categoriesFetched = new Subject<Category[]>();
  // Api base url for category requests
  private url = 'http://localhost:3000/api/categories?';

  /**
   * Create categoryService class
   * @param http 
   */
  constructor(private http: HttpClient) { };

  /**
   * Notfies observers when categories are fetched from server
   */
  getCategoriesListener() {
    return this.categoriesFetched.asObservable();
  };

  /**
   * Get categories with given cids
   * @param cids
   */
  getCategories(cids: string[]) {
    const query = "categories=" + cids;
    this.http.get<{ categories: Category[] }>(this.url + query)
      .subscribe((data) => {
        this.categories = data.categories;
        this.categoriesFetched.next(this.categories.slice());
      });
  };

  /**
   * Returns category with given cid
   * @param cid 
   */
  getCategory(cid: string) {
    return this.categories.find(i => i.cid === cid);
  }
}
