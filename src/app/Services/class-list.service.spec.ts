import {TestBed} from '@angular/core/testing';

import {ClassListService} from './class-list.service';

describe('ClassListService', () => {
    let service: ClassListService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ClassListService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add a class', () => {
        //arrange
        const elem = document.createElement('div');
        const className = 'active';

        //act
        ClassListService.addClass(elem, className);

        //assert
        expect(elem.classList).toContain(className);
    });

    it('should continue when adding a class that\'s in the classList', () => {
        //arrange
        const elem = document.createElement('div');
        const className = 'active';
        elem.classList.add(className);

        //act
        ClassListService.addClass(elem, className);

        //assert
        expect(elem.classList).toContain(className);
    });


    it('should remove a class', () => {
        //arrange
        const elem = document.createElement('div');
        const className = 'active';
        elem.classList.add(className);

        //act
        ClassListService.removeClass(elem, className);

        //assert
        expect(elem.classList).not.toContain(className);
    });

    it('should continue when removing a class that\'s not in the classlist', () => {
        //arrange
        const elem = document.createElement('div');
        const className = 'active';

        //act
        ClassListService.removeClass(elem, className);

        //assert
        expect(elem.classList).not.toContain(className);
    });

    it('should add a class via toggle', () => {
        //arrange
        const elem = document.createElement('div');
        const className = 'active';

        //act
        ClassListService.toggleClass(elem, className);

        //assert
        expect(elem.classList).toContain(className);
    });

    it('should remove a class via toggle', () => {
        //arrange
        const elem = document.createElement('div');
        const className = 'active';
        elem.classList.add(className);

        //act
        ClassListService.toggleClass(elem, className);

        //assert
        expect(elem.classList).not.toContain(className);
    });

    it('should not contain the class', () => {
        //arrange
        const elem = document.createElement('div');
        const className = 'active';

        //act

        //assert
        expect(elem.classList).not.toContain(className);
    });

    it('should contain the class', () => {
        //arrange
        const elem = document.createElement('div');
        const className = 'active';
        elem.classList.add(className);

        //act

        //assert
        expect(elem.classList).toContain(className);
    });


});
