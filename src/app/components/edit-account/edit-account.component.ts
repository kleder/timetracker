import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service'
import { ApiService } from '../../services/api.service'
import { HttpService } from '../../services/http.service'

import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss']
})
export class EditAccountComponent implements OnInit {
  public accountName: any
  public accountUrl: any
  public accountToken: any
  public agiles: any
  constructor(
    public databaseService: DatabaseService,
    public activatedRoute: ActivatedRoute,
    public api: ApiService,
    public httpService: HttpService,
    public router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute
    .queryParams
    .subscribe(params => {
      this.accountName = params['accountName']
      this.accountUrl = params['accountUrl']
      this.accountToken = params['accountToken']
    });
    this.getAllAgiles()
  }

  public getAllAgiles() {
    console.log('getAllAgiles()')
    this.api.getAllAgiles().then(
      data => {
        this.httpService.loader = false
        this.agiles = data
      }
    )
  }

  editBoard(board) {
    this.router.navigate(['/edit-board'], { queryParams: {boardName: board.name, accountName: this.accountName } });    
  }

}
