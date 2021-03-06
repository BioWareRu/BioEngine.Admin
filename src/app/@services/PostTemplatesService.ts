import { Injectable } from '@angular/core';
import { AbstractBaseTemplatesService } from '@common/AbstractBaseTemplatesService';
import { Post, RestClient } from 'bioengine-angular';

@Injectable()
export class PostTemplatesService extends AbstractBaseTemplatesService<Post> {
    constructor(httpClient: RestClient) {
        super(httpClient);
    }

    protected _getResource(): string {
        return 'posts/templates';
    }

}
