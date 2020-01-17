import { Category } from './category.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class CategoryService {
  // Current loaded categories from backend that are available to user
  private categories: Category[] = [];
  // Api base url for category requests
  private url = 'http://localhost:3000/api/categories?';

  /**
   * Create categoryService class
   * @param http 
   */
  constructor(private http: HttpClient) { };

  /**
   * Get categories with given cids
   * @param cids
   */
  getCategories(cids: string[]) {
    let query: string = "";
    for (const cid of cids) {
      query += "cids[]=" + cid + "&";
    }
    // Remove last question mark
    query = query.substring(0, query.length - 1);
    return this.http
      .get<{ categories: Category[] }>(
        this.url + query
      )
      .pipe(
        map(data => {
          this.categories = data.categories;
          return this.categories.slice();
        })
      );
  };

  /**
   * Returns category with given cid
   * @param cid 
   */
  getCategory(cid: string) {
    return this.categories.find(i => i.cid === cid);
  }
}
