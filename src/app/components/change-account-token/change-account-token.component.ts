import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DatabaseService } from '../../services/database.service'
import { ToasterService } from '../../services/toaster.service'

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
    public toasterService: ToasterService
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
    console.log(accountId)
    console.log(newToken)
    this.databaseService.changeAccountToken(accountId, newToken).then(data => {
      console.log(data)
      this.toasterService.showToaster('Token has been changed successfully', 'success')
      this.router.navigate(['/edit-account'], { queryParams: {accountId: this.accountId, accountName: this.accountName, accountUrl: this.accountUrl }});              
    }, err => {
      console.log(err)
    })
  }

  goBack() {
    this.router.navigate(['/edit-account'], { queryParams: { accountId: this.accountId, accountName: this.accountName, accountUrl: this.accountUrl }});        
  }

}
