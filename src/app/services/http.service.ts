import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHandler,
  HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { RemoteAccount } from 'app/models/RemoteAccount';

@Injectable()
export class HttpService extends HttpClient {
  public loader = false
  private remoteAccount: RemoteAccount;

  constructor(
    handler: HttpHandler
  ) { 
    super(handler)
  }

  public UseAccount(remoteAccount : RemoteAccount) {
    this.remoteAccount = remoteAccount;
  }

  public rawGet(url: string, options: any){
    return super.get(url, options)
  }

  put(url: string, body:any, options?: any): Observable<any> {
    return super.put(this.getFullUrl(url), body, this.getOptions(options));
  }

  get(url: string, options?: any, loader=true): Observable<any> {
    this.loader = loader
    return super.get(this.getFullUrl(url), this.getOptions(options));
  }

  post(url: string, body: any, options?: any): Observable<any>{
    return super.post(this.getFullUrl(url), body, this.getOptions(options))
  }

  private getOptions(options?: any){
    
    if (options != undefined){
      options.headers.set('Authorization', 'Bearer '+ this.remoteAccount.token)
      return options;
    }

    return {headers: new HttpHeaders({
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
    console.error('Error, status code: ' + res.status);
  }

  private onEnd(): void {
    this.loader = false
  }

}
