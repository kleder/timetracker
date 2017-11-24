import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title = `Kleder Track App`;
  public youTrackName: string
  public username: string
  public password: string
  public loginCorrect: boolean = true
  constructor(
    public http: Http,
    public auth: AuthService,
    public api: ApiService,
    public router: Router
  ) {
    this.youTrackName = ""
    this.username = ""    
    this.password = ""
   }

  ngOnInit() {
  }

  public login = (youTrackName, username, password) => {
    this.auth.login(youTrackName, username, password).then(
      data => {
        console.log(data)
        if (data["status"] == 200) {
          if (data["url"].indexOf('instanceIsNotRegistered') > -1) {
            this.loginCorrect = false;
          } else {
            this.goToLogin()
          }
        } else {
          this.loginCorrect = false;
        }
      }, error => {
        this.loginCorrect = false;
        console.log(error)
      }
    )
  }

  goToLogin() {
    this.router.navigateByUrl('/boards');
  }

}
