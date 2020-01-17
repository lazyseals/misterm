import { Component, Input } from '@angular/core';
import { Item } from 'app/shared/item.model';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss']
})
export class ItemCardComponent {
  @Input() private item: Item;

  constructor() { };

}