import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-board',
  templateUrl: './edit-board.component.html',
  styleUrls: ['./edit-board.component.scss']
})
export class EditBoardComponent implements OnInit {
  public boardName: string
  public accountId: number
  public accountName: string
  public accountUrl: string
  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute
    .queryParams
    .subscribe(params => {
      this.boardName = params['boardName']
      this.accountId = params['accountId']
      this.accountName = params['accountName']
      this.accountUrl = params['accountUrl']
    });
  }

  goBack() {
    this.router.navigate(['/edit-account'], { queryParams: { boardName: this.boardName, accountId: this.accountId, accountName: this.accountName, accountUrl: this.accountUrl }});        
  }

}
