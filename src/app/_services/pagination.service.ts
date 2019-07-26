import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor() { }

  paginate(totalItems: number, currentPage: number, pageSize: number, maxPages: number) {

    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);

    // check if cuurentPage isn't out of range
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    // set the start and the end pages
    let startPage: number;
    let endPage: number;
    if (totalPages <= maxPages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      // total pages > max, so calculate start and end pages
      let maxPagesBeforeCurrentPage = Math.floor(maxPages / 2); // the largest integer
      let maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1; // rounds a number up to the next largest whole number or integer - 1

      if (currentPage <= maxPagesBeforeCurrentPage) {
        // current page is near the start
        startPage = 1;
        endPage = maxPages;
      } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
        // current page is near the end
        startPage = totalPages - maxPages;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxPagesBeforeCurrentPage;
        endPage = currentPage - maxPagesAfterCurrentPage;
      }
    }

    // calculate start and end indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an Array of pages for *ngFor
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };

  }
}
