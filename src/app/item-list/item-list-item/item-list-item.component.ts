import { Component, OnInit, Input } from '@angular/core';
import { Item } from 'app/shared/item.model';

@Component({
  selector: 'app-item-list-item',
  templateUrl: './item-list-item.component.html',
  styleUrls: ['./item-list-item.component.scss']
})
export class ItemListItemComponent implements OnInit {
  // Item of card
  @Input() private item: Item;
  constructor() { }

  ngOnInit() {
  }

  /**
   * Shortens name. 
   * Display only first 4 words of name.
   * If word contains more than 4 words, The first 3 are displayed followed by '...'.
   * @param name 
   */
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
