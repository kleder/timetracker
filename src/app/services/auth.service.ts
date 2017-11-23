import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  title = `Kleder Track App`;
  loader = false
  public static youtrackUrl = ""
  constructor(
    public http: Http
  ) { }

  login = (youTrackName, username, password) => {
    console.log(youTrackName, username)
    AuthService.youtrackUrl = youTrackName
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Accept', 'application/json')
    return new Promise(resolve => {
      this.loader = true
      this.http.post(youTrackName + '/rest/user/login?login=' + username + '&password=' + password, {headers: headers}).subscribe(
        response => {
          this.loader = false
          resolve(response)
        }, error => {
          this.loader = false          
          resolve(error)
        }
      )
    })
  }

}
