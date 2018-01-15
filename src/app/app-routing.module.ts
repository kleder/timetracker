import { BoardsChoiceComponent } from './components/boards-choice/boards-choice.component';
import { TrackingComponent } from './components/tracking/tracking.component';
import { DashboardComponent } from './components/tracking/dashboard/dashboard.component';
import { ActivityComponent } from './components/tracking/activity/activity.component';
import { AddAccountComponent } from './components/add-account/add-account.component';
import { SwitchAccountComponent } from './components/switch-account/switch-account.component';
import { EditAccountComponent } from './components/edit-account/edit-account.component';
import { EditBoardComponent } from './components/edit-board/edit-board.component';
import { ChangeAccountTokenComponent } from './components/change-account-token/change-account-token.component';
import { AboutTrecComponent } from './components/about-trec/about-trec.component';
import { LicensesComponent } from './components/licenses/licenses.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountService } from './services/account.service'
import { ApiService } from './services/api.service'

const routes: Routes = [
    {
        path: '',
        redirectTo: 'add-account',
        pathMatch: 'full',
    },
    {
        path: 'add-account',
        component: AddAccountComponent,
    },
    {
        path: 'switch-account',
        component: SwitchAccountComponent,
    },
    {
        path: 'edit-account',
        component: EditAccountComponent
    },
    {
        path: 'change-account-token',
        component: ChangeAccountTokenComponent
    },
    {
        path: 'edit-board',
        component: EditBoardComponent
    },
    {
        path: 'boards',
        component: BoardsChoiceComponent
    },
    {
        path: 'about-trec',
        component: AboutTrecComponent
    },
    {
        path: 'licenses',
        component: LicensesComponent
    },
    {
        path: 'tracking',
        component: TrackingComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'activity',
                component: ActivityComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule],
    providers: [
        AccountService,
        ApiService
    ]
})
export class AppRoutingModule { }
