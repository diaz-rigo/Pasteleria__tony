import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appToggle]',
  standalone: true
})
export class ToggleDirective {

  @HostListener('click') onClick() {
    // Lógica toggle
  }
}
