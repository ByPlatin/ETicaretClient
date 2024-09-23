import { List_Product_Image } from './list_productImage';

export class List_Product {
  id: string;
  name: string;
  stock: number;
  price: number;
  createdDate: Date;
  updatedDate: Date;
  productImageFiles: List_Product_Image[];
  path: string;
}
