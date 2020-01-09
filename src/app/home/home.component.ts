import { Component, OnInit } from '@angular/core';
import { Item } from 'app/shared/item.model';
import { ItemService } from 'app/shared/item.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private items: Item[];

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.items = this.getMostPopularItems(this.itemService.getItems());
  }

  private getMostPopularItems(items: Item[]) {
    items.sort((a, b) => (a.popularity < b.popularity) ? 1 : -1);
    return items.slice(0, 4);
  }

}
