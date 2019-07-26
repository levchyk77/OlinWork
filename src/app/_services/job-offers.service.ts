import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JobOfer } from '../_models/job-offfer';

@Injectable({
  providedIn: 'root'
})
export class JobOffersService {

  constructor(
    private http: HttpClient,
  ) { }

  getJobOffers(startIndex?: string, endIndex?: string) {
    if (startIndex && endIndex) {
      return this.http.get<JobOfer[]>('/job-offers', { params: {startIndex: `${startIndex}`, endIndex: `${endIndex}`} });
    }
    return this.http.get<JobOfer[]>('/job-offers');
  }
  getJobOffersNumber() {
    return this.http.get<number>('/job-offers/totalItems');
  }
}
