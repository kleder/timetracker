import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-board',
  templateUrl: './edit-board.component.html',
  styleUrls: ['./edit-board.component.scss']
})
export class EditBoardComponent implements OnInit {
  public boardName: string
  public accountName: string
  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute
    .queryParams
    .subscribe(params => {
      this.boardName = params['boardName']
      this.accountName = params['accountName']
    });
  }

  goBack() {
    this.router.navigate(['/edit-account'], { queryParams: { boardName: this.boardName, accountName: this.accountName }});        
  }

}
