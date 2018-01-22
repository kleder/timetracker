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
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { RemoteAccount } from 'app/models/RemoteAccount';

@Injectable()
export class HttpService extends Http {
  public loader = false
  private remoteAccount: RemoteAccount;

  constructor(
    backend: XHRBackend,
    defaultOptions: RequestOptions
  ) { 
    super(backend, defaultOptions)
  }

  public UseAccount(remoteAccount : RemoteAccount) {
    this.remoteAccount = remoteAccount;
  }

  get(url: string, options?: RequestOptionsArgs): Observable<any> {
    this.loader = true
    return super.get(this.getFullUrl(url), this.getOptions(options));
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<any>{
    return super.post(this.getFullUrl(url), body, this.getOptions(options))
  }

  private getOptions(options?: RequestOptionsArgs){
    
    if (options != undefined){
      options.headers.append('Authorization', 'Bearer '+ this.remoteAccount.token)
      return options;
    }

    return {headers: new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer '+ this.remoteAccount.token
    })} 
  }
  private getFullUrl(url: string): string {
    return  this.remoteAccount.url + url;
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
