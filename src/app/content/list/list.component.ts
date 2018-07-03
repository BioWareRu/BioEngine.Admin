import {Component} from '@angular/core';
import {ListComponent} from "../../@common/list/ListComponent";
import {ServicesProvider} from "../../@services/ServicesProvider";
import {
  ListTableColumn,
  SectionsTableColumn,
  SitesTableColumn,
  TagsTableColumn
} from "../../@common/list/ListTableColumn";
import {ListTableColumnType} from "../../@common/list/ListEnums";
import {ListTableColumnAction} from "../../@common/list/ListTableColumnAction";
import {BaseSection} from "../../@models/Section";
import {Site} from "../../@models/Site";
import {map} from "rxjs/operators";
import {BaseContentItem, ContentItemType} from "../../@models/ContentItem";
import {Observable} from "rxjs/Observable";
import {PageContext} from "../../@common/PageComponent";
import "rxjs-compat/add/observable/forkJoin";
import {Tag} from "../../@models/Tag";

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './list.component.html',
  providers: [
    PageContext
  ]
})
export class ContentListComponent extends ListComponent<BaseContentItem> {
  private sites: Site[];
  private sections: BaseSection[];
  private tags: Tag[];

  constructor(context: PageContext, private servicesProvider: ServicesProvider) {
    super(context, servicesProvider.ContentService);

    context.StateService.setTitle('Список контента');
    this.addUrl = '/sections/developers/add';
    this.provider.itemsPerPage = 20;
  }

  ngOnInit() {
    this.Route.params.pipe(map(p => p.type)).subscribe(type => {
      switch (type) {
        case "posts":
          this.provider.setService(this.servicesProvider.PostsService);
          this.StateService.setTitle("Посты");
          break;
        case "gallery":
          this.provider.setService(this.servicesProvider.GalleryService);
          this.StateService.setTitle("Галерея");
          break;
        default:
          break;
      }
      Observable.forkJoin(
        this.servicesProvider.SitesService.getAll(1, 100, 'id'),
        this.servicesProvider.SectionsService.getAll(1, 100, 'id'),
        this.servicesProvider.TagsService.getAll(1, 100, 'id')
      ).subscribe(res => {
        this.sites = res[0].Data;
        this.sections = res[1].Data;
        this.tags = res[2].Data;
        this.Init();
      });
    });

  }

  protected GetColumns(): ListTableColumn<BaseContentItem>[] {
    return [
      new ListTableColumn<BaseContentItem>('Id', '#').setSortable(),
      new ListTableColumn<BaseContentItem>('TypeTitle', 'Тип'),
      new ListTableColumn<BaseContentItem>('Title', 'Заголовок').setSortable()
        .setLinkGetter(content => {
          let route;
          switch (content.Type) {
            case ContentItemType.Post:
              route = "posts";
              break;
            case ContentItemType.File:
              route = "files";
              break;
            case ContentItemType.Gallery:
              route = "gallery";
              break;
          }
          return ['/content/' + route, content.Id, 'edit'];
        }),
      new ListTableColumn<BaseContentItem>('DateAdded', 'Дата', ListTableColumnType.TimeAgo).setSortable(),
      new SitesTableColumn<BaseContentItem>('SiteIds', 'Сайты', this.sites),
      new SectionsTableColumn<BaseContentItem>('SectionIds', 'Разделы', this.sections),
      new TagsTableColumn<BaseContentItem>('TagIds', 'Тэги', this.tags),
      new ListTableColumn<BaseContentItem>('Actions', '')
        .AddAction(
          new ListTableColumnAction<BaseContentItem>('Просмотреть на сайте', 'globe').setExternal(content => content.Url),
        )
        .AddAction(
          new ListTableColumnAction<BaseContentItem>('Удалить', 'trash').setClick(content => this.deleteItem(content.Id)),
        ),
    ];
  }
}
