import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class InterceptorsHttpInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const apiKey = "cdb29f355cb4059995e054208f8cc73c327e9bbc3a0c290e7d88c58022f3e4f8a6c491cf8411c1b1291068c25c15042aac"
    request = request.clone({
      setHeaders: {
        'Authorization': `ApiKey ${apiKey}`,
      }
    });
    return next.handle(request);
  }
}
