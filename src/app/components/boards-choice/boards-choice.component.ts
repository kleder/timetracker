import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { DataService } from '../../services/data.service'
import { AccountService } from '../../services/account.service';
import { ApiService } from '../../services/api.service';
import { HttpService } from '../../services/http.service'
import { RemoteAccount } from 'app/models/RemoteAccount';
import { ToasterService } from '../../services/toaster.service'

@Component({
  selector: 'app-boards-choice',
  templateUrl: './boards-choice.component.html',
  styleUrls: ['./boards-choice.component.scss']
})
export class BoardsChoiceComponent implements OnInit {
  public agiles: any
  private justLoggedIn: boolean
  private remoteAccount: RemoteAccount
  public accountName: string  
  constructor(
    public router: Router,
    private dataService: DataService,
    private auth: AccountService,
    private api: ApiService,
    public httpService: HttpService,
    public activatedRoute: ActivatedRoute,
    public toasterService: ToasterService
  ) { 
  }

  ngOnInit() {
    this.activatedRoute
    .queryParams
    .subscribe(async params => {
      this.justLoggedIn = (params['justLoggedIn']) === "true" ? true : false  
      this.accountName = (params['name'])
      this.getAllAgiles()
    });
  }

  public getAllAgiles() {
    console.log('getAllAgiles()')
    this.api.getAllAgiles().then(
      data => {
        this.httpService.loader = false
        this.agiles = data
        if (this.justLoggedIn) {
          this.toasterService.showToaster("Account " + this.accountName + " is synced!", "success")
        }
      }
    )
  }

  agilesChoose() {
    this.agiles.forEach(agile => {
      if (!agile.hasOwnProperty('checked')) {
        agile.checked = false
      }
    })
    this.dataService.sentChosenAgiles(this.agiles)
    this.router.navigateByUrl('/tracking');
  }
  
}
