import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { ApiService } from '../../services/api.service';
import { AccountService } from '../../services/account.service';

import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
export class AddAccountComponent implements OnInit {
  public correctLoginData = true;
  public loader = false;
  public name = ""
  public youTrackUrl = "";
  public token = "";
  constructor(
    public http: Http,
    public account: AccountService,
    public router: Router, 
    public activatedRoute: ActivatedRoute  
  ) { }

  async ngOnInit() {
    var current = await this.account.Current();
    if (current!= undefined){
      this.router.navigate(['/boards'], { queryParams: {isLogged: false} });
    }
    this.activatedRoute
    .queryParams
    .subscribe(async params => { })

  }

  public login = () => {
    this.loader = true;
    var account = this.account.add(this.name, this.youTrackUrl, this.token);
    this.account.user(account).then(
      data => {
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
    this.router.navigate(['/boards'], { queryParams: {isLogged: true, name: this.name} });
  }

}
