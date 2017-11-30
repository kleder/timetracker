import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { DataService } from '../../services/data.service'
import { AccountService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { HttpService } from '../../services/http.service'

@Component({
  selector: 'app-boards-choice',
  templateUrl: './boards-choice.component.html',
  styleUrls: ['./boards-choice.component.scss']
})
export class BoardsChoiceComponent implements OnInit {
  public agiles: any
  public notificationText: string
  private justLoggedIn: boolean
  constructor(
    public router: Router,
    private dataService: DataService,
    private auth: AccountService,
    private api: ApiService,
    public httpService: HttpService,
    public activatedRoute: ActivatedRoute
  ) { 
  }

  ngOnInit() {
    this.getAllAgiles()
    this.activatedRoute
    .queryParams
    .subscribe(params => {
      this.justLoggedIn = (params['isLogged'])
    });
  }

  public getAllAgiles() {
    this.api.getAllAgiles().then(
      data => {
        this.agiles = data
        if (this.justLoggedIn) {
          this.welcomeNotification()          
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
    this.dataService.sentChoosenAgiles(this.agiles)
    this.router.navigateByUrl('/tracking');
  }

  public welcomeNotification() {
    let that = this
    setTimeout(function() { 
      that.notificationText = "You’re in! Select agile boards."
      let element = document.getElementById("default-notification")
      element.className = "show";
      setTimeout(function() { 
        element.className = element.className.replace("show", "")
      }, 2500);
    }, 300)
  }
  
}
