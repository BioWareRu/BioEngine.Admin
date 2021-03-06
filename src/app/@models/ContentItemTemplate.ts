import { AbstractEntity, User } from 'bioengine-angular';

export class ContentItemTemplate extends AbstractEntity {
    public contentType: string;
    public sectionIds: string[];
    public tagIds: string[];
    public sections: any[];
    public tags: any[];
    public authorId: string;
    public author: User;
}
