import {Component} from '@angular/core';

@Component({
    templateUrl: './home.html'
})
export class HomePage {

    constructor(public welcomeTxt: string) {
        this.welcomeTxt = 'Hi, greetings';
    }
}
