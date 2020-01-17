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
  private items: Item[] = [];
  private itemsSub: Subscription;

  constructor(private itemService: ItemService) { };

  ngOnInit() {
    this.itemService.getItemsInCategory('c2002');
    this.itemService.getItemsUpdateListener()
      .subscribe(items => {
        this.items = items.slice(0, 4);
      });
  };

  ngOnDestroy() {
    if (this.itemsSub) {
      this.itemsSub.unsubscribe();
    }
  }

}
