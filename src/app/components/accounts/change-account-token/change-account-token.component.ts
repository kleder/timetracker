import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DatabaseService } from '../../../services/database.service'
import { ToasterService } from '../../../services/toaster.service'
import { RemoteAccount } from 'app/models/RemoteAccount';
import { ApiService } from 'app/services/api.service';

@Component({
  selector: 'app-change-account-token',
  templateUrl: './change-account-token.component.html',
  styleUrls: ['./change-account-token.component.scss']
})
export class ChangeAccountTokenComponent implements OnInit {
  public accountId: number
  public accountName: string
  public accountUrl: string
  public newToken: string
  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public databaseService: DatabaseService,
    public toasterService: ToasterService,
    public api: ApiService
  ) { }

  ngOnInit() {
    this.activatedRoute
    .queryParams
    .subscribe(params => {
      this.accountId = params['accountId']
      this.accountName = params['accountName']
      this.accountUrl = params['accountUrl']
    });
  }

  changeToken(accountId, newToken) {
    let rAccount = new RemoteAccount()
    rAccount.name = this.accountName
    rAccount.url = this.accountUrl
    rAccount.token = newToken
    this.api.getCurrentUser(rAccount).then((res) => {
      this.databaseService.changeAccountToken(accountId, newToken).then(data => {
        this.toasterService.success('Token has been changed successfully')
        this.goBack()
      }, err => {
        this.toasterService.error('An error occoured!')
      })
    }, (err) => {
      this.toasterService.error('An error occoured! This token doesn\'t match any account')
    })
  }

  goBack() {
    this.router.navigate(['/accounts/edit-account'], { queryParams: { accountId: this.accountId, accountName: this.accountName, accountUrl: this.accountUrl }});        
  }

}
