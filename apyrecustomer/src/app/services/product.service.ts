import { Injectable, OnInit } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { Product } from '../structure/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
// data: string = fs.readFileSync('src/app/structure/product.ts', 'utf8');
testData!: Product[]
products$!: Observable<Product[]>
productArray!: Product[]

  constructor() {
    this.testData = [
     {
      "title": "Emerson I Poplar Cremation Casket with Cherry Finish",
      "sku": "SKU-123",
      "price": "745.00",
      "status": "available",
      "category": "caskets",
      "desc": "Emerson II Composite Cloth Covered/ Ivory Crepe/ Swing Bar Handle. Medicaid Approved",
      "material": "wood",
      "color": "blue"
    },
    {
      "title": "South East Florida Gulfstream Premier Unattended Scattering",
      "sku": "SKU-124",
      "price": "295.00",
      "status": "sold",
      "category": "memorial items",
      "desc": "Gulfstream unattended Premier Scattering of Cremated Remains. Our Captain will take your loved one out to the Gulf Stream, and will scatter the Cremated Remains into the Atlantic Ocean in the Gulf Stream. Upon completion we will provide a Certificate that identifies the date, time and latitude and longitude of the scattering. We will also complete the EPA report that identifies the exact coordinates of the scattering when the scattering is complete."
    },
    {
      "title": "Rosewood Urn",
      "sku": "SKU-1235",
      "price": "745.00",
      "status": "available",
      "category": "urns",
      "desc": "Beautifully designed Rosewood is a hand-crafted, timeless urn with beautiful natural Rosewood lines. A perfect choice for both traditional and non-traditional tastes, but is also a perfect choice because of its timelessness and durability.",
      "material": "stainless steel",
      "color": "gold"
    }
    ]
    this.products$ = of(Object.values(this.testData))
   }

   // push the keys and values of each object to product array which defines a product 



   
   getData(term?: string): Observable<Product[]> {
    if (!term) {
        return this.products$;
    } else {
        return this.products$.pipe(
            map((products) => {
                const filteredProducts = products.filter((item) =>
                    item.title.toLowerCase().includes(term.toLowerCase()) || item.category.toLowerCase().includes(term.toLowerCase())
                );
                return filteredProducts;
            })
        );
    }
}

    

}
