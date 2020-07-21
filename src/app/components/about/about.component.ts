import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { shell } from 'electron';
import { versions } from '../../../environments/versions';
import { DataService } from '../../services/data.service'

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  public version = versions;

  constructor(
    public http: HttpClient,
    public router: Router,
    public dataService: DataService
   ){}

   public async open(url : string){
    shell.openExternal(url);
   } 

  ngOnInit() {
    console.log("this.router.url", this.router.url)
  }

  goBack() {
    this.router.navigate([this.dataService.routeBeforeMenu], { queryParams: { returnUrl: this.router.url } })
  }

}

