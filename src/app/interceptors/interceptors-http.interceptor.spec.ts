import { TestBed } from '@angular/core/testing';

import { InterceptorsHttpInterceptor } from './interceptors-http.interceptor';

describe('InterceptorsHttpInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      InterceptorsHttpInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: InterceptorsHttpInterceptor = TestBed.inject(InterceptorsHttpInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
