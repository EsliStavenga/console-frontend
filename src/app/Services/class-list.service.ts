import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export abstract class ClassListService {

    public static toggleClass(element: HTMLElement, _class: string) {
        if (!this.containsClass(element, _class)) {
            this.addClass(element, _class);
        } else {
            this.removeClass(element, _class);
        }
    }

    public static addClass(element: HTMLElement, _class: string) {
        if (!this.containsClass(element, _class)) {
            element.classList.add(_class);
        }
    }

    public static removeClass(element: HTMLElement, _class: string) {
        if (this.containsClass(element, _class)) {
            element.classList.remove(_class);
        }
    }

    public static containsClass(element: HTMLElement, _class: string) {
        return element.classList.contains(_class);
    }
}
