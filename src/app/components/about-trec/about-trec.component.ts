import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-about-trec',
  templateUrl: './about-trec.component.html',
  styleUrls: ['./about-trec.component.scss']
})
export class AboutTrecComponent implements OnInit {

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute
   ){}
   

  ngOnInit() {
    }
  }

