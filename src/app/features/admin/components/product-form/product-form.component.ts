import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../public/services/product.service';
// import { Product } from '../../../public/models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {
// export class ProductFormComponent implements OnInit {
  // product: Product = {
  //   id: '',
  //   name: '',
  //   description: '',
  //   variants: [{
  //     sizeStock: [{ price: 0, stock: 0 }],
  //     images: []
  //   }]
  // };
  // isEditMode: boolean = false;

  // constructor(
  //   private route: ActivatedRoute,
  //   private productService: ProductService,
  //   private router: Router
  // ) {}

  // ngOnInit(): void {
  //   const id = this.route.snapshot.paramMap.get('id');
  //   if (id) {
  //     this.isEditMode = true;
  //     // this.productService.getProductById(id).subscribe((data: Product) => {
  //     //   this.product = data;
  //     // });
  //   }
  // }

  // submitForm() {
  //   if (this.isEditMode) {
  //     // this.productService.updateProduct(this.product.id, this.product).subscribe(() => {
  //     //   this.router.navigate(['/admin/products']);
  //     // });
  //   } else {
  //     // this.productService.createProduct(this.product).subscribe(() => {
  //     //   this.router.navigate(['/admin/products']);
  //     // });
  //   }
  // }
}
