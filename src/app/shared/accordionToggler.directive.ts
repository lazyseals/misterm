import { Directive, ElementRef, Renderer2, HostListener } from "@angular/core";

@Directive({
  selector: '[appAccordionToggler]'
})
export class AccordionTogglerDirective {
  private isOpen = false;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  @HostListener('click', ['$event'])
  onClick(e) {
    const toShow = this.elementRef.nativeElement.nextSibling;
    if (!this.isOpen) {
      this.renderer.addClass(toShow, 'show');
    } else {
      this.renderer.removeClass(toShow, 'show');
    }
    this.isOpen = !this.isOpen;
  }
}