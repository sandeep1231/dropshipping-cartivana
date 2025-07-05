import { TestBed } from '@angular/core/testing';
import { AuthService } from '../services/auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('User Authentication Flow', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should not login with invalid credentials', (done) => {
    service.login('invalid@example.com', 'wrongpass').subscribe({
      next: () => done.fail('Should not login with invalid credentials'),
      error: (err: any) => {
        expect(err).toBeTruthy();
        done();
      }
    });
    const req = httpMock.expectOne(req => req.url.includes('/login'));
    req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
  });

  // Add more tests for registration, valid login, logout, etc.
});
