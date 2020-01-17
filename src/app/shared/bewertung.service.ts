import { Bewertung } from "./bewertung.model";
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from "rxjs/operators";

@Injectable()
export class BewertungService {
  // Current loaded bewertungen from backend that are available to user
  private bewertungen: Bewertung[] = [];
  // Api base url for category requests
  private url = 'http://localhost:3000/api/bewertungen?';

  /**
   * Create bewertungService class
   * @param http 
   */
  constructor(private http: HttpClient) { };

  /**
   * Get bewertungen with given bids
   * @param bids 
   */
  getBewertungen(bids: string[]) {
    let query: string = "";
    for (const bid of bids) {
      query += "bids[]=" + bid + "&";
    }
    // Remove last question mark
    query = query.substring(0, query.length - 1);
    return this.http
      .get<{ bewertungen: Bewertung[] }>(
        this.url + query
      )
      .pipe(
        map(data => {
          this.bewertungen = data.bewertungen;
          return this.bewertungen.slice();
        })
      );
  };

  /**
   * Returns bid with given bid
   * @param bid 
   */
  getBewertung(bid: string) {
    return this.bewertungen.find(i => i.bid === bid);
  }
};
