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
    description: string;
    shape: string;
    availabilityStatus: "available" | "on_demand" | "out_of_stock";
    sizeStock: SizeStock[];
    images: string[];
  }
  
  export interface Product {
    _id: string;
    name: string;
    category: string;
    ingredientes: string;
    description?: string;
    availabilityStatus: "available" | "on_demand" | "out_of_stock";
    variants: Variant[];
  }
  