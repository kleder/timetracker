import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service'
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { HttpService } from '../../services/http.service'

@Component({
  selector: 'app-boards-choice',
  templateUrl: './boards-choice.component.html',
  styleUrls: ['./boards-choice.component.scss']
})
export class BoardsChoiceComponent implements OnInit {
  public agiles: any
  constructor(
    public router: Router,
    private dataService: DataService,
    private auth: AuthService,
    private api: ApiService,
    public httpService: HttpService
  ) { 
  }

  ngOnInit() {
    this.getAllAgiles()
  }

  public getAllAgiles() {
    this.api.getAllAgiles().then(
      data => {
        this.agiles = data
      }
    )
  }

  agilesChoose() {
    this.agiles.forEach(agile => {
      if (!agile.hasOwnProperty('checked')) {
        agile.checked = false
      }
    })
    this.dataService.sentChoosenAgiles(this.agiles)
    this.router.navigateByUrl('/tracking');
  }
  
}
