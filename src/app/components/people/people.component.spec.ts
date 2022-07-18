import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Person } from 'src/app/models/person.model';
import { PersonComponent } from '../person/person.component';

import { PeopleComponent } from './people.component';

fdescribe('PeopleComponent', () => {
  let component: PeopleComponent;
  let fixture: ComponentFixture<PeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeopleComponent, PersonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list app-person components', () => {
    // Arrange
    component.people = [
      new Person('Leonardo', 'Arias', 23, 1, 1),
      new Person('Valentina', 'Rodriguez', 12, 2, 3),
      new Person('Santiago', 'Dolores', 12, 2, 3),
    ];
    // Act
    fixture.detectChanges();
    const debugElement = fixture.debugElement.queryAll(By.css('app-person'));
    // Assert
    expect(debugElement.length).toEqual(3);
  });

  it('should raise selected event when clicked', () => {
    // Arrange
    component.people = [
      new Person('Leonardo', 'Arias', 23, 1, 1),
      new Person('Valentina', 'Rodriguez', 12, 2, 3),
      new Person('Santiago', 'Dolores', 12, 2, 3),
    ];
    const idx = 1;
    //Act
    fixture.detectChanges();
    const debugElement = fixture.debugElement.queryAll(By.css('app-person'));
    const btnDe = debugElement[idx].query(By.css('.btn-choose'));
    btnDe.triggerEventHandler('click', null);
    fixture.detectChanges();
    //
    expect(component.selectedPerson).toEqual(component.people[idx]);
  });
  
});
