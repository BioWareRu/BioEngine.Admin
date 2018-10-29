import {NgModule} from '@angular/core';
import {ListTableComponent} from './list/component/list.component';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MomentModule} from 'ngx-moment';
import 'moment/locale/ru';
import {BioFormsModule} from './forms/FormsModule';
import {
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatGridListModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule
} from '@angular/material';
import {BrcPerfectScrollbarDirective} from './scroll/scrollbar.component';
import {UserComponent} from './user/user.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NotificationComponent} from './snacks/NotificationComponent';

@NgModule({
    declarations: [
        ListTableComponent,
        BrcPerfectScrollbarDirective,
        UserComponent,
        NotificationComponent
    ],
    exports: [
        CommonModule,
        RouterModule,
        MomentModule,
        BioFormsModule,
        MatIconModule,
        MatGridListModule,
        MatMenuModule,
        MatCardModule,
        ListTableComponent,
        BrcPerfectScrollbarDirective,
        UserComponent,
        FlexLayoutModule
    ],
    providers: [],
    imports: [
        MatProgressSpinnerModule,
        MatTableModule,
        MatMenuModule,
        MatIconModule,
        MatPaginatorModule,
        MatButtonModule,
        MatChipsModule,
        MatCardModule,
        MatSnackBarModule,
        MomentModule,
        RouterModule,
        MatSortModule,
        CommonModule,
        FlexLayoutModule
    ],
    entryComponents: [
        NotificationComponent
    ]
})
export class BioCommonModule {

}
