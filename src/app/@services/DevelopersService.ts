import { Injectable } from '@angular/core';
import { Developer } from '@models/Developer';
import { AbstractContentEntityService, RestClient } from 'bioengine.core.api.client';

@Injectable()
export class DevelopersService extends AbstractContentEntityService<Developer> {

  constructor(httpClient: RestClient) {
    super(httpClient);
  }

  protected _getResource(): string {
    return 'developers';
  }
}
