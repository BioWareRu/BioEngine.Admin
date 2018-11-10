import { FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { RestResult } from '../RestResult';
import {
    HostListener,
    Input,
    OnInit,
    ViewChild,
    EventEmitter
} from '@angular/core';
import { BioFormControl } from './BioFormControl';
import { plainToClass } from 'class-transformer';
import { ServicesProvider } from '../../@services/ServicesProvider';
import {
    ISiteEntity,
    ISingleSiteEntity
} from '../../@models/interfaces/ISiteEntity';
import { ISectionEntity } from '../../@models/interfaces/ISectionEntity';
import { AbstractControlOptions } from '@angular/forms/src/model';
import { ValidatorFn } from '@angular/forms/src/directives/validators';
import { PageComponent, PageContext } from '../PageComponent';
import { Utils } from '../Utils';
import { SaveModelResponse } from '../SaveModelResponse';
import { BaseService } from '../BaseService';
import { map } from 'rxjs/operators';
import { Model } from '../../@models/base/Model';
import {
    Properties,
    PropertiesElementType
} from '../../@models/base/Properties';
import { CustomValidators } from 'ng4-validators';
import { BaseSection } from '../../@models/Section';
import { Tag } from '../../@models/Tag';
import { Site } from '../../@models/Site';
import { SnackBarMessage } from '../snacks/SnackBarMessage';
import { SnackBarService } from '../snacks/SnackBarService';

export abstract class FormPageComponent<
    TModel extends Model,
    TResultModel extends SaveModelResponse<TModel>
> extends PageComponent implements OnInit {
    @Input() public Model: TModel;
    protected modelId: number;
    protected isPublished: boolean;
    protected isNew: boolean;
    @ViewChild('modelForm') protected Form: FormComponent<TModel, TResultModel>;

    ngOnInit(): void {
        const id: Observable<number> = this.Route.params.pipe(map(p => p.id));
        id.subscribe(modelId => {
            if (modelId > 0) {
                this.modelId = modelId;
                this.getService()
                    .get(modelId)
                    .subscribe(model => {
                        this.Model = model;
                        this.isPublished = model.IsPublished;
                        this.setTitle(model.Title);
                        this.loadFormData();
                    });
            } else {
                this.isNew = true;
                this.getService()
                    .new()
                    .subscribe(model => {
                        this.Model = model;
                        this.setTitle(this.getNewModelTitle());
                        this.loadFormData();
                    });
            }
        });
    }

    loadFormData(): void {
        this.Form.loadFormData(this.Model);
        this.Form.onSuccessSave.subscribe(result =>
            this.processSuccessSave(result)
        );
    }

    protected processSuccessSave(saveResult: SaveModelResponse<TModel>): void {
        if (!this.modelId) {
            this.Router.navigate([
                this.getRoute(),
                saveResult.Model.Id,
                'edit'
            ]);
        }
    }

    protected abstract getNewModelTitle(): string;
    protected abstract getService(): BaseService<TModel>;
    protected abstract getRoute(): string;
}

export abstract class BaseFormComponent {
    public success = false;
    public inProgress = false;
    public hasErrors = false;
    public hasChanges = false;

    public isNew = false;

    public formLoaded = false;

    @Input()
    public formGroup: FormGroup;
    protected controlsByProperty: { [p: string]: BioFormControl } = {};

    constructor(protected snackBarService: SnackBarService) {}

    initForm(): void {
        this.formGroup = this.formGroup || new FormGroup({});
        this.constructForm();
        this.formLoaded = true;
    }

    @HostListener('window:beforeunload', ['$event'])
    checkChanges($event): void {
        if (this.hasChanges) {
            $event.returnValue =
                'Форма не была сохранена. Данные будут потеряны!';
        }
    }

    public registerChange(key: string, oldValue: any, newValue: any): void {
        this.hasChanges = true;
        this.hasErrors = false;
        this.success = false;
        this.processChange(key, oldValue, newValue);
    }

    public processChange(key: string, oldValue: any, newValue: any): void {}

    registerFormControl(
        name: string,
        validatorOrOpts?:
            | ValidatorFn
            | ValidatorFn[]
            | AbstractControlOptions
            | null,
        property: string = null
    ): void {
        if (property == null) {
            property = name;
        }
        this.formGroup.controls[name] = this.controlsByProperty[
            property
        ] = new BioFormControl(
            <BaseFormComponent>this,
            name,
            this.getModel(),
            property,
            validatorOrOpts
        );
    }

    protected abstract constructForm(): void;

    protected handleSubmitError(response: HttpErrorResponse): void {
        if (response.status === 422) {
            const data: RestResult = plainToClass(
                RestResult,
                response.error as RestResult
            );
            data.Errors.forEach(error => {
                const control = this.controlsByProperty[error.Field];
                control.setServerError(error.Message);
            });
            this.snackBarService.error(
                new SnackBarMessage(
                    'Ошибка валидации',
                    'Произошла ошибка валидации, проверьте заполнение формы'
                )
            );
        }
    }

    protected afterInit(): void {}

    public loadFormData(): void {
        this.initForm();
        this.afterInit();
    }

    protected abstract getModel(): any;
}

export abstract class SimpleFormComponent<TModel> extends BaseFormComponent
    implements OnInit {
    @Input() public Model: TModel;
    ngOnInit(): void {
        this.loadFormData();
    }

    protected getModel(): TModel {
        return this.Model;
    }
}

export abstract class FormComponent<
    TModel extends Model,
    TResultModel extends SaveModelResponse<TModel>
> extends BaseFormComponent {
    @Input()
    public model: TModel;
    public PropertiesElementTypes = PropertiesElementType;
    public ModelProperties: Properties[] = [];
    protected modelId: number;
    protected isPublished: boolean;

    public onSuccessSave: EventEmitter<TResultModel> = new EventEmitter<
        TResultModel
    >();
    protected constructor(
        public servicesProvider: ServicesProvider,
        snackBarService: SnackBarService,
        protected service: BaseService<TModel>
    ) {
        super(snackBarService);
    }

    buildPropertiesForm(): any {
        if (this.model.PropertiesGroups) {
            this.model.PropertiesGroups.forEach((propertiesSet, groupIndex) => {
                if (!propertiesSet.IsEditable) {
                    return;
                }
                propertiesSet.Properties.forEach((prop, propIndex) => {
                    prop.Values.forEach((val, valIndex) => {
                        const fieldProperty = `PropertiesGroups.${groupIndex}.Properties.${propIndex}.Values.${valIndex}.Value`;
                        let fieldName = propertiesSet.Key + prop.Key;
                        if (val.SiteId) {
                            fieldName += val.SiteId;
                        }
                        const validators = [];
                        if (prop.IsRequired) {
                            validators.push(<any>Validators.required);
                        }
                        switch (prop.Type) {
                            case PropertiesElementType.Url:
                                validators.push(CustomValidators.url);
                                break;
                        }
                        this.registerFormControl(
                            fieldName,
                            validators,
                            fieldProperty
                        );
                    });
                });
                this.ModelProperties.push(propertiesSet);
            });
        }
    }

    public PropertiesOptions(
        groupKey: string,
        propertyKey: string
    ): Observable<any> {
        return this.servicesProvider.PropertiesService.getOptions(
            groupKey,
            propertyKey
        );
    }

    public save(): void {
        this.success = false;
        this.inProgress = true;
        let result;
        if (this.isNew) {
            result = this.doAdd();
        } else {
            result = this.doUpdate();
        }
        result.subscribe(
            (saveResult: TResultModel) => {
                this.hasChanges = false;
                this.success = true;
                this.onSuccessSave.emit(saveResult);
                this.snackBarService.success(
                    new SnackBarMessage('Успех!', 'Сохранение прошло успешно.')
                );
                this.inProgress = false;
            },
            e => {
                this.hasErrors = true;
                this.handleSubmitError(e);
                this.inProgress = false;
            }
        );
    }

    public changePublishState(): void {
        this.success = false;
        this.inProgress = true;
        let result;
        if (this.model.IsPublished) {
            result = this.service.unpublish(this.model.Id);
        } else {
            result = this.service.publish(this.model.Id);
        }
        result.subscribe(
            (saveResult: TModel) => {
                this.hasChanges = false;
                this.success = true;
                this.model = saveResult;
                if (saveResult.IsPublished) {
                    this.snackBarService.success(
                        new SnackBarMessage('Успех!', 'Опубликовано.')
                    );
                } else {
                    this.snackBarService.success(
                        new SnackBarMessage('Успех!', 'Публикация снята.')
                    );
                }
                this.inProgress = false;
            },
            e => {
                this.hasErrors = true;
                this.handleSubmitError(e);
                this.inProgress = false;
            }
        );
    }

    updateControlValue(name: string): void {
        (this.formGroup.controls[name] as BioFormControl).reloadValue();
    }

    protected doAdd(): Observable<SaveModelResponse<TModel>> {
        return this.service.add(this.model);
    }

    protected doUpdate(): Observable<SaveModelResponse<TModel>> {
        return this.service.update(this.modelId, this.model);
    }

    public loadFormData(model: TModel = null): void {
        this.model = model;
        this.initForm();
        this.buildPropertiesForm();
        this.afterInit();
    }

    protected getModel(): any {
        return this.model;
    }
}

export abstract class SiteEntityFormComponent<
    TModel extends ISiteEntity,
    TSaveModel extends SaveModelResponse<TModel>
> extends FormComponent<TModel, TSaveModel> {
    protected get Sites(): Observable<Site[]> {
        return this.servicesProvider.SitesService.getAll(1, 1000, 'id').pipe(
            map(list => list.Data)
        );
    }
}

export abstract class SingleSiteEntityFormComponent<
    TModel extends ISingleSiteEntity,
    TSaveModel extends SaveModelResponse<TModel>
> extends FormComponent<TModel, TSaveModel> {
    protected get Sites(): Observable<Site[]> {
        return this.servicesProvider.SitesService.getAll(1, 1000, 'id').pipe(
            map(list => list.Data)
        );
    }
}

export abstract class SectionFormComponent<
    TModel extends ISiteEntity,
    TSaveModel extends SaveModelResponse<TModel>
> extends SiteEntityFormComponent<TModel, TSaveModel> {
    public processChange(key: string, oldValue: any, newValue: any): void {
        if (key === 'Title') {
            const origSlug = Utils.slugifyUrl(oldValue);
            if (!this.model.Url || origSlug === this.model.Url) {
                this.model.Url = Utils.slugifyUrl(newValue);
                this.updateControlValue('Url');
            }
        }
    }

    protected constructForm(): void {
        this.registerFormControl('Title', [<any>Validators.required]);
        this.registerFormControl('Url', [<any>Validators.required]);
        this.registerFormControl('ShortDescription', [
            <any>Validators.required
        ]);
        this.registerFormControl('Hashtag', [<any>Validators.required]);
        this.registerFormControl('Logo', [<any>Validators.required]);
        this.registerFormControl('LogoSmall', [<any>Validators.required]);
        this.registerFormControl('SiteIds', [<any>Validators.required]);
    }
}

export abstract class ContentFormComponent<
    TModel extends ISectionEntity,
    TSaveModel extends SaveModelResponse<TModel>
> extends SiteEntityFormComponent<TModel, TSaveModel> {
    protected get Sections(): Observable<BaseSection[]> {
        return this.servicesProvider.SectionsService.getAll(1, 1000, 'id').pipe(
            map(list => list.Data)
        );
    }

    protected get Tags(): Observable<Tag[]> {
        return this.servicesProvider.TagsService.getAll(1, 1000, 'id').pipe(
            map(list => list.Data)
        );
    }

    protected constructForm(): void {
        this.registerFormControl('Title', [<any>Validators.required]);
        this.registerFormControl('Url', [<any>Validators.required]);
        this.registerFormControl('SectionIds', [<any>Validators.required]);
        this.registerFormControl('TagIds', [<any>Validators.required]);
        this.constructorDataFrom();
    }

    protected abstract constructorDataFrom(): void;
}
