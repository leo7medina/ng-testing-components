import { Component, OnInit } from '@angular/core';
import { Person } from 'src/app/models/person.model';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {

  person: Person = new Person('Leonardo', 'Arias', 1, 1, 23);
  people: Person[] = [
    new Person('Leonardo', 'Arias', 23, 1, 1),
    new Person('Valentina', 'Rodriguez', 12, 2, 3),
  ];
  selectedPerson: Person | null = null;
  constructor() { }

  ngOnInit(): void {
  }

  onChoose(person: Person) {
    this.selectedPerson = person;
  }

}
