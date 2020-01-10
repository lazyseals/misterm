import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    @ViewChild('myDropProtein', { static: true }) myDropProtein: any;
    @ViewChild('myDropSupp', { static: true }) myDropSupp: any;
    @ViewChild('myDropFood', { static: true }) myDropFood: any;
    @ViewChild('myDropGetraenke', { static: true }) myDropGetraenke: any;
    private toggleButton: any;
    private sidebarVisible: boolean;
    private dropdownVisible: boolean[];
    private dropdownChildren: any[];

    constructor(public location: Location, private element: ElementRef) {
        this.sidebarVisible = false;
        this.dropdownVisible = [false, false, false, false];
    }

    ngOnInit() {
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.dropdownChildren = [this.myDropProtein, this.myDropSupp, this.myDropFood, this.myDropGetraenke];
    }
    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const html = document.getElementsByTagName('html')[0];
        // console.log(html);
        // console.log(toggleButton, 'toggle');

        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);
        html.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        // console.log(html);
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };
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
    close(i: number, mydrop) {
        if (this.dropdownVisible) {
            mydrop._open = false;
            this.dropdownVisible[i] = false;
        }
    }
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

        if (direction !== 'bottom') {
            for (let j = 0; j < this.dropdownVisible.length; j++) {
                this.dropdownVisible[j] = false;
                this.dropdownChildren[j]._open = false;
            }
        }
    };
    // Get direction data based on element and pointer positions
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


    // Gets an elements position - https://www.kirupa.com/html5/get_element_position_using_javascript.htm
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

    translateDirection = function (pos: number) {
        switch (pos) {
            case 0: return 'top';
            case 1: return 'right';
            case 2: return 'bottom';
            case 3: return 'left';
        }
    };
}
