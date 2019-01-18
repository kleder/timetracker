import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../../services/database.service'
import { ToasterService } from '../../services/toaster.service'
import { ApiProviderService } from '../../services/api/api-provider.service';
import { ApiService } from '../../services/api/api.service';
import { Priority } from '../../models/Priority';
import { TrecOnInit } from '../TrecOnInit';
import { AccountService } from '../../services/account.service';
import { ApiInitService } from '../../services/api/api-init.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent extends TrecOnInit {
  private projectId: string;
  public projectName: string
  public accountId: string
  public accountName: string
  public accountUrl: string
  public boardStates: any
  public priorities: Priority[];
  
  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public databaseService: DatabaseService,
    public toasterService: ToasterService,
    protected apiProviderService: ApiProviderService,
    protected apiInitService: ApiInitService,
    protected accountService: AccountService,
    private zone: NgZone
  ) {
    super(apiProviderService, apiInitService, accountService);
  }

  async ngOnInit() {
    let that = this;
    this.activatedRoute
    .queryParams
    .subscribe(params => {
      this.projectName = params['projectName'];
      this.accountId = params['accountId'];
      this.projectId = params['projectId'];
      that.getPriorities(that);
    });
  }

  private getPriorities(that){
    that.databaseService.getPriorities(that.accountId, that.projectId).then(priorities => {
      that.zone.run(() => that.priorities = priorities);
 
    })
  }

  updateStatesColors(priorites) {
    for (let i = 0; i < priorites.length; i++) {
      if (!/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(priorites[i].hexColor)) {
        this.toasterService.error('It isn\'t hex format!')          
        return false        
      }
    }
    priorites.forEach((state) => {
      this.databaseService.updatePriority(state, this.accountId, this.projectId);
    })
    this.toasterService.success('Color has been changed!')      

    this.goBack()
  }

  changeBackground(bgColor) {
    return { 'color': bgColor };
  }

  goBack() {
    this.router.navigate(['/accounts/edit-account'], { queryParams: { projectId: this.projectId , accountId: this.accountId } });    
  }

}
