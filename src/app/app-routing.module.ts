import { BoardsChoiceComponent } from './components/boards-choice/boards-choice.component';
import { TrackingComponent } from './components/tracking/tracking.component';
import { DashboardComponent } from './components/tracking/dashboard/dashboard.component';
import { ActivityComponent } from './components/tracking/activity/activity.component';
import { AddAccountComponent } from './components/add-account/add-account.component';
import { MenuComponent } from './components/menu/menu.component';
import { EditAccountComponent } from './components/edit-account/edit-account.component';
import { EditBoardComponent } from './components/edit-board/edit-board.component';
import { AboutTrecComponent } from './components/about-trec/about-trec.component';

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
        path: 'menu',
        component: MenuComponent,
    },
    {
        path: 'edit-account',
        component: EditAccountComponent
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
