import { Component, OnInit } from '@angular/core';
import { JobOffersService } from '../_services/job-offers.service';
import { JobOfer } from '../_models/job-offfer';
import { first } from 'rxjs/operators';

@Component({
  selector: 'find-jobs',
  templateUrl: './find-jobs.component.html',
  styleUrls: ['./find-jobs.component.css']
})
export class FindJobsComponent implements OnInit {
  jobOffers: JobOfer[];

  constructor(
    private jobOffersService: JobOffersService,
  ) { }

  ngOnInit( ) {
    this.loadAllJobOffers();
  }

  private loadAllJobOffers() {
    this.jobOffersService.getJobOffers()
      .pipe(first())
      .subscribe(jobOffers => {
        this.jobOffers = jobOffers;
      });

  }

}
