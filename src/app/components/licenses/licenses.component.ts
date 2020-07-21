import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service'

@Component({
  selector: 'licenses-trec',
  templateUrl: './licenses.component.html',
  styleUrls: ['./licenses.component.scss']
})
export class LicensesComponent implements OnInit {

  constructor(
    public http: HttpClient,
    public router: Router,
    public dataService: DataService
   ){}
   

  ngOnInit() {
  }

  goBack() {
    this.router.navigate([this.dataService.routeBeforeMenu], { queryParams: { returnUrl: this.router.url } })
  }

}
  