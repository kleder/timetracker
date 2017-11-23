import { Injectable } from '@angular/core';
import {
  Http,
  RequestOptions,
  RequestOptionsArgs,
  Response,
  Request,
  Headers,
  XHRBackend,
  ConnectionBackend
} from '@angular/http';
import { AuthService } from '../services/auth.service'
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class HttpService extends Http {
  public loader = false
  constructor(
    backend: XHRBackend,
    defaultOptions: RequestOptions
  ) { 
    super(backend, defaultOptions)
  }

  get(url: string, options?: RequestOptions): Observable<any> { 
    this.loader = true
    return super.get(this.getFullUrl(url))
    .catch(this.onCatch)
    .do((res: Response) => {
        this.onSuccess(res);
    }, (error: any) => {
        this.onError(error);
    })
    .finally(() => {
        this.onEnd();
    });
  }

  private getFullUrl(url: string): string {
    return AuthService.youtrackUrl + url;
  }

  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    return Observable.throw(error);
  }

  private onSuccess(res: Response): void {
    console.log('Request successful');
  }

  private onError(res: Response): void {
    console.log('Error, status code: ' + res.status);
  }

  private onEnd(): void {
    this.loader = false
  }

}
