import { Bewertung } from "./bewertung.model";
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class BewertungService {
  // Current loaded bewertungen from backend that are available to user
  private bewertungen: Bewertung[] = [];
  private bewertungenFetched = new Subject<Bewertung[]>();
  // Api base url for category requests
  private url = 'http://localhost:3000/api/bewertungen?';

  /**
   * Create bewertungService class
   * @param http 
   */
  constructor(private http: HttpClient) { };

  /**
   * Notifies observers when items are fetched from server
   */
  getBewertungenListener() {
    return this.bewertungenFetched.asObservable();
  }

  /**
   * Get bewertungen with given bids
   * @param bids 
   */
  getBewertungen(bids: string[]) {
    const query = "bewertungen=" + bids;
    this.http.get<{ bewertungen: Bewertung[] }>(this.url + query)
      .subscribe((data) => {
        this.bewertungen = data.bewertungen;
        this.bewertungenFetched.next(this.bewertungen.slice());
      });
  };

  /**
   * Returns bid with given bid
   * @param bid 
   */
  getBewertung(bid: string) {
    return this.bewertungen.find(i => i.bid === bid);
  }
};
