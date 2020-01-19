import { Component, OnInit, Input } from '@angular/core';
import { Item } from 'app/shared/item.model';

@Component({
  selector: 'app-item-list-item',
  templateUrl: './item-list-item.component.html',
  styleUrls: ['./item-list-item.component.scss']
})
export class ItemListItemComponent implements OnInit {
  @Input() private item: Item;
  constructor() { }

  ngOnInit() {
  }

  shortenName(name: string) {
    let parts = name.split(' ');
    if (parts.length > 4) {
      let shortenedName = '';
      for (let i = 0; i < 4; i++) {
        shortenedName += parts[i] + ' ';
      }
      return shortenedName + '...';
    }
    return name;
  }

}
