import { SizeStock } from "./size-stock.model";

export interface Variant {
  flavor?: string;
  color?: string;
  texture?: string;
  shape?: string;
  description?: string;
  availabilityStatus?: string;
  sizeStock?: SizeStock[];
  images: string[];
  _id?: string;
}