import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MenuModule } from './menu/menu.module';
import { PagesModule } from './pages/pages.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SitesModule } from './sites/sites.module';
import { SectionsModule } from './sections/sections.module';
import { TagsModule } from './tags/tags.module';
import { PostsModule } from './posts/posts.module';
import { StorageModule } from './storage/storage.module';

const routes: Routes = [
    { path: 'dashboard', loadChildren: () => DashboardModule },
    { path: 'posts', loadChildren: () => PostsModule },
    { path: 'sites', loadChildren: () => SitesModule },
    { path: 'sections', loadChildren: () => SectionsModule },
    { path: 'tags', loadChildren: () => TagsModule },
    { path: 'pages', loadChildren: () => PagesModule },
    { path: 'menu', loadChildren: () => MenuModule },
    { path: 'storage', loadChildren: () => StorageModule },
    { path: '**', redirectTo: 'dashboard' }
];

const config: ExtraOptions = {};

@NgModule({
    imports: [RouterModule.forRoot(routes, config)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
