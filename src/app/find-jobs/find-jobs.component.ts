import { Component, OnInit, Input } from '@angular/core';
import { JobOffersService } from '../_services/job-offers.service';
import { JobOfer } from '../_models/job-offfer';
import { first } from 'rxjs/operators';
import { PaginationService } from '../_services/pagination.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'find-jobs',
  templateUrl: './find-jobs.component.html',
  styleUrls: ['./find-jobs.component.css']
})
export class FindJobsComponent implements OnInit {
  @Input() pageSize = 10;
  @Input() maxPages: number = 5;
  @Input() initialPage: number = 1;

  filterJobsForm: FormGroup;
  selectedJobTitle: any;
  default: any;
  filterChosen = false;
  isFiltered = false;

  jobOffers: JobOfer[];
  jobOffersNumber: number;
  jobTitles: any[];

  pager: any = {};
  pageOfItems: any = {};

  constructor(
    private jobOffersService: JobOffersService,
    private paginationService: PaginationService,
  ) { }

  ngOnInit() {
    this.createFilterForm();
    this.setPage(this.initialPage);
    this.loadJobTitles();
  }

  private createFilterForm() {
    this.filterJobsForm = new FormGroup({

      field: new FormControl(),
    });
    this.removeFilters();
  }

  onSubmit() {
    if (this.filterJobsForm.invalid) {
      return;
    }
    this.selectedJobTitle = this.filterJobsForm.get('field').value;
    this.setPage(1, this.selectedJobTitle);
    this.filterChosen = true;
    this.isFiltered = true;
  }

  selectingFilters() {
    this.filterChosen = true;
  }

  removeFilters() {
    this.default = document.getElementById('selectDefaultOption');
    this.filterJobsForm.get('field').setValue(this.default.value);
    if (this.isFiltered) {
      this.setPage(1);
      this.isFiltered = false;
    }
    this.filterChosen = false;
  }

  private loadJobOffers(startIndex?: string, endIndex?: string) {
    this.jobOffersService.getJobOffers(startIndex, endIndex)
      .pipe(first())
      .subscribe(jobOffers => {
        this.jobOffers = jobOffers;
      });
  }

  private loadJobTitles() {
    this.jobOffersService.getJobTitles()
      .subscribe(x => {
        this.jobTitles = x;
      });
  }

  private setPage(page: number, jobTitle?: string) {
    this.jobOffers = [];

    this.jobOffersService.getJobOffersNumber(jobTitle)
      // .pipe(first())
      .subscribe(jobOffersNumber => {
        this.jobOffersNumber = jobOffersNumber;

        // get new pager object for a specified page
        this.pager = this.paginationService.paginate(this.jobOffersNumber, page, this.pageSize, this.maxPages);
        this.loadJobOffers(this.pager.startIndex.toString() , this.pager.endIndex.toString());
      });
  }

}
