import { Component } from '@angular/core';
import { AbstractFormPageComponent } from '@common/forms/AbstractFormPageComponent';
import { PageContext } from '@common/PageContext';
import { Site, SitesService } from 'bioengine-angular';

@Component({
    selector: 'site-form-page',
    template: `
        <site-form class="model-form" #modelForm [model]="model"></site-form>
    `,
    providers: [PageContext]
})
export class SiteFormPageComponent extends AbstractFormPageComponent<Site, SitesService> {
    constructor(protected _sitesService: SitesService, context: PageContext) {
        super(context);
    }

    protected _getNewModelTitle(): string {
        return 'Создание сайта';
    }

    protected _getService(): SitesService {
        return this._sitesService;
    }

    protected _getRoute(): string {
        return '/sites';
    }
}
