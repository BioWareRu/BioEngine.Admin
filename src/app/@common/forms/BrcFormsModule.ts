import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ContentFormLayoutComponent } from '@common/forms/ContentItemFormLayoutComponent';
import { FormLayoutComponent } from '@common/forms/FormLayoutComponent';
import { FormLayoutContentComponent } from '@common/forms/FormLayoutContentComponent';
import { BioFormsModule } from 'bioengine-angular';

@NgModule({
    imports: [BioFormsModule, MatTabsModule],
    declarations: [
        FormLayoutComponent,
        FormLayoutContentComponent,
        ContentFormLayoutComponent
    ],
    exports: [
        BioFormsModule,
        FormLayoutComponent,
        FormLayoutContentComponent,
        ContentFormLayoutComponent
    ]
})
export class BrcFormsModule {

}
