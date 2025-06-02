import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ProductsComponentAdmin } from '../products/products.component';
import { ProductService } from '../../shared/services/product.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HttpClientModule,ProductsComponentAdmin],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
