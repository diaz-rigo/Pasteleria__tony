import { Rating } from "./rating.model";
import { Variant } from "./variant.model";

export interface Product {
  _id?: string;
  name?: string;
  brand?: string;
  category?: string;
  ingredientes?: string;
  description?: string;
  isFeatured?: boolean;
  availabilityStatus?: string;
  variants?: Variant[];
  ratings?: Rating;
  dateAdded?: string;
  __v?: number;
}
