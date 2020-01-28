import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar.component';

@Component({
  selector: 'app-nav-responsive',
  templateUrl: './nav-responsive.component.html',
  styleUrls: ['./nav-responsive.component.scss']
})
export class NavResponsiveComponent implements OnInit {

  private displayMainMenu = true;
  private displayFirstSubmenu = false;
  private displaySecondSubmenu = false;

  private categoryToDisplay = null;

  private firstSubmenus = [
    {
      main: 'Proteine', sub: [
        { name: 'Milchproteine', cid: 'c2001' },
        { name: 'Pflanzliches Protein', cid: 'c2005' },
        { name: 'Weitere Proteine', cid: 'c2011' }
      ]
    },
    {
      main: 'Supplements', sub: [
        { name: 'Aminosäuren', cid: 'c3001' },
        { name: 'Vitalstoffe', cid: 'c3020' },
        { name: 'Pre-Workout', cid: 'c3016' },
        { name: 'Diätnahrung', cid: 'c3043' },
        { name: 'Masseaufbau', cid: 'c3038' },
        { name: 'Creatin', cid: 'c3047' }
      ]
    },
    {
      main: 'Food', sub: [
        { name: 'Alltägliche Lebensmittel', cid: 'c4015' },
        { name: 'Riegel & Snacks', cid: 'c4001' },
        { name: 'Superfoods', cid: 'c4008' },
        { name: 'Backen', cid: 'c4031' }
      ]
    },
    {
      main: 'Getränke', sub: [
        { name: 'Protein Drinks', cid: 'c5001' },
        { name: 'Mahlzeitenersatz Shakes', cid: 'c5002' },
        { name: 'Isotonische Getränke', cid: 'c5003' },
        { name: 'Ohne Kalorien', cid: 'c5004' },
        { name: 'Tee & Kaffee', cid: 'c5005' },
      ]
    }
  ];

  private firstSubmenu = [];

  constructor(private mainNav: NavbarComponent) { }

  ngOnInit() {
  }

  whichSubmenu() {
    for (const submenu of this.firstSubmenus) {
      if (submenu.main === this.categoryToDisplay) {
        return submenu.sub;
      }
    }
  }

  onClickMain(category: string) {
    this.displayMainMenu = false;
    this.displayFirstSubmenu = true;
    this.categoryToDisplay = category;
  }

  onClickFirstSubmenuBack() {
    this.displayMainMenu = true;
    this.displayFirstSubmenu = false;
    this.categoryToDisplay = null;
  }

  closeNav() {
    this.displayMainMenu = true;
    this.displayFirstSubmenu = false;
    this.categoryToDisplay = null;
    this.mainNav.sidebarClose();
  }

}
