import { BoardsChoiceComponent } from './components/boards-choice/boards-choice.component';
import { TrackingComponent } from './components/tracking/tracking.component';
import { DashboardComponent } from './components/tracking/dashboard/dashboard.component';
import { ActivityComponent } from './components/tracking/activity/activity.component';
import { AddAccountComponent } from './components/add-account/add-account.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountService } from './services/account.service'
import { ApiService } from './services/api.service'
import { AboutAuthorsComponent } from 'app/components/about-authors/about-authors.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: AddAccountComponent
    },
    {
        path: 'boards',
        component: BoardsChoiceComponent
    },
    {
        path: 'authors',
        component: AboutAuthorsComponent
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
