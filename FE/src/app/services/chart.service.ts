import {Injectable, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';




@Injectable()
export class ChartService implements OnInit {
  private baseUrl = `${environment.apiUrl}/charts`;
  constructor(
    private http: HttpClient
  ) {
  }
  ngOnInit() {
  }

  getShotsForMatch(match_source_and_id: string, callback) {
  }
}
