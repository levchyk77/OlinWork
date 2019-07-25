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

  getJobOffers() {
    return this.http.get<JobOfer[]>('/job-offers');
  }
}
