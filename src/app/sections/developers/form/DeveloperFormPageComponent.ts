import { Component } from '@angular/core';
import { AbstractFormPageComponent } from '@common/forms/AbstractFormPageComponent';
import { PageContext } from '@common/PageContext';
import { Developer } from '@models/Developer';
import { DevelopersService } from '@services/DevelopersService';

@Component({
    selector: 'developer-form-page',
    template: `
        <developer-form
                class="model-form"
                #modelForm
                [model]="model"
        ></developer-form>
    `,
    providers: [PageContext]
})
export class DeveloperFormPageComponent extends AbstractFormPageComponent<Developer, DevelopersService> {
    constructor(
        protected _developerService: DevelopersService,
        context: PageContext
    ) {
        super(context);
    }

    protected _getNewModelTitle(): string {
        return 'Создание разработчика';
    }
    protected _getService(): DevelopersService {
        return this._developerService;
    }

    protected _getRoute(): string {
        return '/sections/developers';
    }
}
