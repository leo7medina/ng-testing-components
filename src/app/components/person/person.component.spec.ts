import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Person } from 'src/app/models/person.model';

import { PersonComponent } from './person.component';

fdescribe('PersonComponent', () => {
  let component: PersonComponent;
  let fixture: ComponentFixture<PersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should the name be "Leonardo"', () => {
    component.person = new Person('Leonardo', 'Arias', 28, 89, 1.4);
    expect(component.person.name).toEqual('Leonardo');
  });

  it('should have <h3> with "Hola, {person.name}"', () => {
    // Arrange
    component.person = new Person('Valentina', 'Arias', 28, 89, 1.4);
    const expectMsg = `Hola, ${component.person.name}`;
    const personDebug: DebugElement = fixture.debugElement;
    const h3Debug: DebugElement = personDebug.query(By.css('h3'));
    const h3: HTMLElement = h3Debug.nativeElement;
    // Act
    fixture.detectChanges();
    // Assert
    expect(h3?.textContent).toEqual(expectMsg);
  });

  it('should have <p> with "Mi altura es {person.height}"', () => {
    // Arrange
    component.person = new Person('Valentina', 'Arias', 28, 89, 1.4);
    const personDebug: DebugElement = fixture.debugElement;
    const pDebug: DebugElement = personDebug.query(By.css('p'));
    const pElement: HTMLElement = pDebug.nativeElement;
    // Act
    fixture.detectChanges();
    // Assert
    expect(pElement?.textContent).toContain(component.person.height);
  });

  it('should display a text with IMC when call calcIMC', () => {
    // Arrange
    const expectMsg = 'overweight level 3';
    component.person = new Person('Juan', 'Perez', 1.65, 120, 30);
    const button = fixture.debugElement.query(By.css('button.btn-imc')).nativeElement;
    // Act
    component.calcIMC();
    fixture.detectChanges();
    // Assert
    expect(button.textContent).toContain(expectMsg);
  });

  it('should display a text with IMC when do click', () => {
    // Arrange
    const expectMsg = 'overweight level 3';
    component.person = new Person('Juan', 'Perez',1.65, 120, 30);
    const buttonDe = fixture.debugElement.query(By.css('button.btn-imc'));
    const buttonEl = buttonDe.nativeElement;
    // Act
    buttonDe.triggerEventHandler('click', null);
    fixture.detectChanges();
    // Assert
    expect(buttonEl.textContent).toContain(expectMsg);
  });

  it('should raise selected event when do click', () => {
    const expectPerson = new Person('Juan', 'Perez',1.65, 120, 30);
    component.person = expectPerson;
    const buttonDe = fixture.debugElement.query(By.css('button.btn-choose'));
    let selectedPerson: Person | undefined;
    component.onSelected.subscribe(person => {
      selectedPerson = person;
    })
    // Act
    buttonDe.triggerEventHandler('click', null);
    fixture.detectChanges();
    //Assert
    expect(selectedPerson).toEqual(expectPerson);
  });
});
