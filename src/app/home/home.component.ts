import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ItemService } from 'app/shared/item.service';
import { Item } from 'app/shared/item.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private items: Item[] = [];
  private itemsSub: Subscription;

  constructor(private itemService: ItemService) { };

  ngOnInit() {
    this.itemService.getItemsInCategory('c2002')
      .subscribe(items => {
        this.items = items.slice(0, 4);
      });
  };

}
