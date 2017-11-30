import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { ApiService } from '../../services/api.service';
import { AccountService } from '../../services/account.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title = `Kleder Track App`;
  
  public youTrackName: string;
  public token: string;
  public loginCorrect: boolean = true;
  public loader = false;

  constructor(
    public http: Http,
    public account: AccountService,
    public api: ApiService,
    public router: Router,
  ) {
    this.youTrackName = ""
    this.token = ""    
   }

  ngOnInit() {
  }

  public login = () => {
    this.loader = true;
    var account = this.account.add(this.youTrackName, this.token);
    this.account.user(account).then(
      data => {
        console.log(data)
        this.loader = false;
        this.goToBoard()
      }, error => {
        this.loader = false;
        this.loginCorrect = false;
        console.log(error)
      }
    )
  }

  goToBoard() {
    this.router.navigate(['/boards'], { queryParams: {isLogged: true} });
  }

}
