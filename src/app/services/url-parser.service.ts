import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class UrlParserService {
  private parser;
  constructor(@Inject(DOCUMENT) private document: any){
      this.parser = document.createElement('a');
  }

  public setUrl(url: string){
      this.parser.href = url;
  }

  public getProtocol() : string{
      return this.parser.protocol.substring(0, this.parser.protocol-1);
  }

  public getHost(): string{
      return this.parser.host;
  }

  public getPort(): string {
      return this.parser.port;
  }

  public getHostname() : string {
      return this.parser.hostname;
  }

}
