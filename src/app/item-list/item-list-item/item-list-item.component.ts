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
    console.log(this.item);
  }

}
