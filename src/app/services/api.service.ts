import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestObjectDetection, ResponseObjectDetection } from '../models/nipa';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  api: string = "https://nvision.nipa.cloud/api/v1/object-detection";
  constructor(
    private http: HttpClient

  ) { }


  upload(params: RequestObjectDetection): Observable<any> {
    return this.http.post<ResponseObjectDetection>(this.api, params);
  }

}
