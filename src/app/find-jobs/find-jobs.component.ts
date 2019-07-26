import { Component, OnInit, Input } from '@angular/core';
import { JobOffersService } from '../_services/job-offers.service';
import { JobOfer } from '../_models/job-offfer';
import { first } from 'rxjs/operators';
import { PaginationService } from '../_services/pagination.service';

@Component({
  selector: 'find-jobs',
  templateUrl: './find-jobs.component.html',
  styleUrls: ['./find-jobs.component.css']
})
export class FindJobsComponent implements OnInit {
  @Input() pageSize = 2;
  @Input() maxPages: number = 5;
  @Input() initialPage: number = 1;


  jobOffers: JobOfer[];
  jobOffersNumber: number;

  pager: any = {};
  pageOfItems: any = {};

  constructor(
    private jobOffersService: JobOffersService,
    private paginationService: PaginationService
  ) { }

  ngOnInit() {
    this.setPage(this.initialPage);
  }

  private loadJobOffers(startIndex?: string, endIndex?: string) {
    this.jobOffersService.getJobOffers(startIndex, endIndex)
      .pipe(first())
      .subscribe(jobOffers => {
        this.jobOffers = jobOffers;
      });
  }

  private loadJobOffersNumber() {
    this.jobOffersService.getJobOffersNumber()
      .pipe(first())
      .subscribe(jobOffersNumber => {
        this.jobOffersNumber = jobOffersNumber;
      });
  }

  private setPage(page: number) {
    this.jobOffers = [];

    this.jobOffersService.getJobOffersNumber()
      // .pipe(first())
      .subscribe(jobOffersNumber => {
        this.jobOffersNumber = jobOffersNumber;

        // get new pager object for a specified page
        this.pager = this.paginationService.paginate(this.jobOffersNumber, page, this.pageSize, this.maxPages);
        this.loadJobOffers(this.pager.startIndex.toString() , this.pager.endIndex.toString());
      });
  }


}
