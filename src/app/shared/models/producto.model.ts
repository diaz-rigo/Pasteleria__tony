export interface SizeStock {
    size: number;
    stock: number;
    price: number;
    availabilityStatus: "available" | "on_demand" | "out_of_stock";
  }
  
  export interface Variant {
    flavor: string;
    color: string;
    texture: string;
    shape: string;
    availabilityStatus: "available" | "on_demand" | "out_of_stock";
    sizeStock: SizeStock[];
    images: string[];
  }
  
  export interface Product {
    name: string;
    brand: string;
    category: string;
    material: string;
    description?: string;
    availabilityStatus: "available" | "on_demand" | "out_of_stock";
    variants: Variant[];
  }
  