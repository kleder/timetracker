import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute} from '@angular/router';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'privacy-policy-trec',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(
    public http: Http,
    public account: AccountService,
    public router: Router,
    public activatedRoute: ActivatedRoute
   ){}
   

  ngOnInit() {
    }
  showMenu() {
    this.router.navigate(["/header"], { queryParams: { returnUrl: this.router.url } })
    }
  }
