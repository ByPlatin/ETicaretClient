import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/common/models/product.service';
import { List_Product } from '../../../../contracts/list_product';
import { ActivatedRoute } from '@angular/router';
import { FileService } from '../../../../services/common/models/file.service';
import { BaseUrl } from '../../../../contracts/base_url';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private fileService: FileService
  ) {}

  currentPageNo: number;
  totalProductCount: number;
  totalPageCount: number;
  pageSize: number = 12;
  pageList: number[] = [];
  baseUrl: BaseUrl;
  products: List_Product[];
  async ngOnInit() {
    this.baseUrl = await this.fileService.getBaseStorageUrl();

    this.activatedRoute.params.subscribe(async (params) => {
      this.currentPageNo = parseInt(params['pageNo'] ?? 1);
      const data: { totalProductCount: number; products: List_Product[] } =
        await this.productService.read(
          this.currentPageNo - 1,
          this.pageSize,
          () => {},
          (errorMessage) => {}
        );
      this.products = data.products;
      // console.log(this.products);

      // this.products.forEach((product, i) => {
      //   let p: any = {
      //     name: product.name,
      //     id: product.id,
      //     price: product.price,
      //     stock: product.stock,
      //     createdDate: product.createdDate,
      //     updatedDate: product.updatedDate,
      //     // image: product.productImageFiles?.find((x) => x.showcase).path,
      //     imagePath: product.path
      //   };
      // });

      this.totalProductCount = data.totalProductCount;
      this.totalPageCount = Math.ceil(this.totalProductCount / this.pageSize);

      this.pageList = [];
      if (this.currentPageNo - 3 <= 0) {
        for (let i = 1; i <= 7; i++) {
          this.pageList.push(i);
        }
      } else if (this.currentPageNo + 3 >= this.totalPageCount) {
        for (let i = this.totalPageCount - 6; i <= 7; i++) {
          this.pageList.push(i);
        }
      } else {
        for (let i = this.currentPageNo - 3; i <= this.currentPageNo + 3; i++) {
          this.pageList.push(i);
        }
      }
    });
  }
}
