import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-nav-regular',
  templateUrl: './nav-regular.component.html',
  styleUrls: ['./nav-regular.component.scss']
})
export class NavRegularComponent implements OnInit {
  // Viewchilds to open dropdowns of main categories on hovering
  @ViewChild('myDropProtein', { static: true }) myDropProtein: any;
  @ViewChild('myDropSupp', { static: true }) myDropSupp: any;
  @ViewChild('myDropFood', { static: true }) myDropFood: any;
  @ViewChild('myDropGetraenke', { static: true }) myDropGetraenke: any;

  // Toggle button is navbar toggler from bootstrap
  private toggleButton: any;

  // Sidebar only visible if screensize is small enough
  private sidebarVisible: boolean;

  // Array of which dropdowns of the main categories are visible
  // At the beginning all false, means not visible
  private dropdownVisible: boolean[];

  // Holds view children of the main categories
  private dropdownChildren: any[];

  /**
   * Constructor
   * @param location 
   * @param element 
   */
  constructor(
    public location: Location,
    private element: ElementRef
  ) {
    // Default: Sidebar not visible
    this.sidebarVisible = false;
    // Default: Dropdowns not visible
    this.dropdownVisible = [false, false, false, false];
  }

  /**
   * Assigns values to toggle button and dropdown children
   */
  ngOnInit() {
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    this.dropdownChildren = [this.myDropProtein, this.myDropSupp, this.myDropFood, this.myDropGetraenke];
  }

  /**
   * Opens dropdown i
   * @param i 
   * @param mydrop 
   */
  open(i: number, mydrop) {
    if (!this.dropdownVisible[i]) {
      mydrop._open = true;
      this.dropdownVisible[i] = true;
    }
    for (let j = 0; j < this.dropdownVisible.length; j++) {
      if (j != i) {
        this.dropdownVisible[j] = false;
        this.dropdownChildren[j]._open = false;
      }
    }
  };

  /**
   * Closes dropdown i
   * @param i 
   * @param mydrop 
   */
  close(i: number, mydrop) {
    if (this.dropdownVisible) {
      mydrop._open = false;
      this.dropdownVisible[i] = false;
    }
  };

  /**
   * Opens dropdown menu which is currently hovered
   * @param event 
   * @param menu 
   */
  handleMenuOpen(event, menu: string) {
    event.stopPropagation();

    if (menu === 'protein') {
      this.open(0, this.myDropProtein);
    } else if (menu === 'supp') {
      this.open(1, this.myDropSupp);
    } else if (menu === 'food') {
      this.open(2, this.myDropFood);
    } else if (menu === 'getraenke') {
      this.open(3, this.myDropGetraenke);
    }
  };

  /**
   * Closes dropdown menu which is left
   * @param event 
   * @param menu 
   */
  handleMenuClose(event, menu: string) {
    event.stopPropagation();

    if (menu === 'protein') {
      this.close(0, this.myDropProtein);
    } else if (menu === 'supp') {
      this.close(1, this.myDropSupp);
    } else if (menu === 'food') {
      this.close(2, this.myDropFood);
    } else if (menu === 'getraenke') {
      this.close(3, this.myDropGetraenke);
    }
  };

  /**
   * Closes all dropdown menus based on direction
   * @param event 
   * @param menu 
   */
  closeAll(event, menu: string) {
    event.stopPropagation();
    let direction: string;
    let menuItem: any;

    if (menu === 'protein') {
      menuItem = this.element.nativeElement.getElementsByClassName('menubtn')[0];
      direction = this.translateDirection(this.getDirection(event, menuItem));
    } else if (menu === 'supp') {
      menuItem = this.element.nativeElement.getElementsByClassName('menubtn')[1];
      direction = this.translateDirection(this.getDirection(event, menuItem));
    } else if (menu === 'food') {
      menuItem = this.element.nativeElement.getElementsByClassName('menubtn')[2];
      direction = this.translateDirection(this.getDirection(event, menuItem));
    } else if (menu === 'getraenke') {
      menuItem = this.element.nativeElement.getElementsByClassName('menubtn')[3];
      direction = this.translateDirection(this.getDirection(event, menuItem));
    }

    console.log(direction);

    if (direction !== 'bottom') {
      for (let j = 0; j < this.dropdownVisible.length; j++) {
        this.dropdownVisible[j] = false;
        this.dropdownChildren[j]._open = false;
      }
    }
  };

  /** 
   * Get direction data based on element and pointer positions
   **/
  getDirection = function (e, item) {
    // Width and height of current item
    let w = item.offsetWidth;
    let h = item.offsetHeight;
    let position = this.getPosition(item);

    // Calculate the x/y value of the pointer entering/exiting, relative to the center of the item.
    let x = (e.pageX - position.x - (w / 2)) * (w > h ? (h / w) : 1);
    let y = (e.pageY - position.y - (h / 2)) * (h > w ? (w / h) : 1);

    // Calculate the angle the pointer entered/exited and convert to clockwise format (top/right/bottom/left = 0/1/2/3). - https://stackoverflow.com/a/3647634
    let d = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;

    // console.table([x, y, w, h, e.pageX, e.pageY, item.offsetLeft, item.offsetTop, position.x, position.y]);

    return d;
  };


  /** 
  * Gets an elements position - https://www.kirupa.com/html5/get_element_position_using_javascript.htm
  */
  getPosition = function (el) {
    let xPos = 0;
    let yPos = 0;

    while (el) {
      xPos += (el.offsetLeft + el.clientLeft);
      yPos += (el.offsetTop + el.clientTop);

      el = el.offsetParent;
    }
    return {
      x: xPos,
      y: yPos
    };
  };

  /**
   * Translates coordinates into human readable directions
   */
  translateDirection = function (pos: number) {
    switch (pos) {
      case 0: return 'top';
      case 1: return 'right';
      case 2: return 'bottom';
      case 3: return 'left';
    }
  };

}
