import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ItemService } from 'app/shared/item.service';
import { Item } from 'app/shared/item.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  // Items to be displayed on home page
  private items: Item[] = [];

  // Subscribe to items fetching from server
  private itemsSub: Subscription;

  // True if home component is fetching items from server
  private isFetching = false;

  /**
   * Constructor
   * @param itemService 
   */
  constructor(private itemService: ItemService) { };

  /**
   * Fetches most popular items from server
   */
  ngOnInit() {
    // TODO: Fetch c1001 ('Beliebteste') instead of c2002 ('Whey Protein')
    // At the moment no items in c1001
    this.itemService.getItemsInCategory('c1001');
    // Set isFetching to true
    this.isFetching = true;
    this.itemService.getItemsUpdateListener()
      .subscribe(items => {
        // Set isFetching to false
        this.isFetching = false;
        // Display only 4 elements
        this.items = items.slice(0, 4);
      });
  };

  /**
   * Unsibscribe from subscriptions
   */
  ngOnDestroy() {
    if (this.itemsSub) {
      this.itemsSub.unsubscribe();
    }
  }

}
