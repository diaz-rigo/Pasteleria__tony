import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  imports:[CommonModule],
  selector: 'app-rating-stars',
  standalone: true,
  template: `
    <div class="flex">
      <span *ngFor="let star of [1,2,3,4,5]" 
            [class.text-yellow-400]="star <= rating" 
            [class.text-gray-300]="star > rating">
        ★
      </span>
    </div>
  `,
  styles: []
})
export class RatingStarsComponent {
  @Input() rating: number = 0;
    @Input() size: string = 'md'; // Add this line to define the size input

}