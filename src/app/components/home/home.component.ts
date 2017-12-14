import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { ApiService } from '../../services/api.service';
import { AccountService } from '../../services/account.service';

import { Router, ActivatedRoute } from '@angular/router';
import { RemoteAccount } from 'app/models/RemoteAccount';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title = `Kleder Track App`;
  
  public correctLoginData = true;
  public loader = false;
  public youTrackName = "";
  public token = "";

  constructor(
    public http: Http,
    public account: AccountService,
    public router: Router, 
    public activatedRoute: ActivatedRoute,
    public apiService: ApiService
  ) {
    console.log("Home")
    console.log(process.env)
   }

  async ngOnInit() {
    var current = await this.account.Current();
    if (current!= undefined){
      this.router.navigate(['/boards'], { queryParams: {isLogged: false} });
    }
    this.activatedRoute
    .queryParams
    .subscribe(async params => { })

  }

  public login = async () => {
    this.loader = true;
    var account = new RemoteAccount;
    account.token = this.token;
    account.url = this.youTrackName;
    awiat = this.apiService.UseAccount(account);
    this.apiService.getCurrentUser(account).then(
      data => {
        this.account.add(account.url, account.token);
        this.loader = false;
        this.goToBoard()
      }, error => {
        this.loader = false;
        this.correctLoginData = false;
        console.log(error)
      }
    )
  }

  goToBoard() {
    this.router.navigate(['/boards'], { queryParams: {isLogged: true} });
  }

}
