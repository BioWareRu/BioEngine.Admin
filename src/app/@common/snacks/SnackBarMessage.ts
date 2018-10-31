import {MatSnackBarVerticalPosition} from '@angular/material';
import {MatSnackBarHorizontalPosition} from '@angular/material/typings/esm5/snack-bar';

export class SnackBarMessage {
    constructor(
        public title: string,
        public message: string,
        public action: string = null,
        public buttons: any[] = [],
        public duration: number = 5000,
        public imgUrl: string = null,
        public verticalPosition: MatSnackBarVerticalPosition = 'bottom',
        public horizontalPosition: MatSnackBarHorizontalPosition = 'right'
    ) {
    }
}
