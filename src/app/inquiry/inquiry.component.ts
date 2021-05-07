import { Component, OnInit, Directive, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';

interface Country {
  id: number;
  name: string;
  area: string;
  population: number;
}

const COUNTRIES: Country[] = [
  {
    id: 1,
    name: '000010',
    area: 'COMPUTER-FORECAST BASED PLANNING-PD AND HELLO WORLD',
    population: 146989754
  },
  {
    id: 2,
    name: '000010',
    area: 'COMPUTER-FORECAST BASED PLANNING-PD AND HELLO WORLD',
    population: 36624199
  },
  {
    id: 3,
    name: '000010',
    area: 'COMPUTER-FORECAST BASED PLANNING-PD AND HELLO WORLD',
    population: 324459463
  },
  {
    id: 4,
    name: '000010',
    area: 'COMPUTER-FORECAST BASED PLANNING-PD AND HELLO WORLD',
    population: 1409517397
  },
  {
    id: 4,
    name: '000010',
    area: 'COMPUTER-FORECAST BASED PLANNING-PD AND HELLO WORLD',
    population: 1409517397
  },
  {
    id: 4,
    name: '000010',
    area: 'COMPUTER-FORECAST BASED PLANNING-PD AND HELLO WORLD',
    population: 1409517397
  },
  {
    id: 4,
    name: '000010',
    area: 'COMPUTER-FORECAST BASED PLANNING-PD AND HELLO WORLD',
    population: 1409517397
  },
  {
    id: 4,
    name: '000010',
    area: 'COMPUTER-FORECAST BASED PLANNING-PD AND HELLO WORLD',
    population: 1409517397
  },
  {
    id: 4,
    name: '000010',
    area: 'COMPUTER-FORECAST BASED PLANNING-PD AND HELLO WORLD',
    population: 1409517397
  },
  {
    id: 4,
    name: '000010',
    area: 'COMPUTER-FORECAST BASED PLANNING-PD AND HELLO WORLD',
    population: 1409517397
  },
  {
    id: 4,
    name: '000010',
    area: 'COMPUTER-FORECAST BASED PLANNING-PD AND HELLO WORLD',
    population: 1409517397
  },
  {
    id: 4,
    name: '000010',
    area: 'COMPUTER-FORECAST BASED PLANNING-PD AND HELLO WORLD',
    population: 1409517397
  },
  {
    id: 4,
    name: '000010',
    area: 'COMPUTER-FORECAST BASED PLANNING-PD AND HELLO WORLD',
    population: 1409517397
  },
  {
    id: 4,
    name: '000010',
    area: 'COMPUTER-FORECAST BASED PLANNING-PD AND HELLO WORLD',
    population: 1409517397
  },
  {
    id: 4,
    name: '000010',
    area: 'COMPUTER-FORECAST BASED PLANNING-PD AND HELLO WORLD',
    population: 1409517397
  },
  {
    id: 4,
    name: '000010',
    area: 'COMPUTER-FORECAST BASED PLANNING-PD AND HELLO WORLD',
    population: 1409517397
  },
  {
    id: 4,
    name: '000010',
    area: 'COMPUTER-FORECAST BASED PLANNING-PD AND HELLO WORLD',
    population: 1409517397
  },
  {
    id: 4,
    name: '000010',
    area: 'COMPUTER-FORECAST BASED PLANNING-PD AND HELLO WORLD',
    population: 1409517397
  },
  {
    id: 4,
    name: '000010',
    area: 'COMPUTER-FORECAST BASED PLANNING-PD AND HELLO WORLD',
    population: 1409517397
  },
  {
    id: 4,
    name: '000010',
    area: 'COMPUTER-FORECAST BASED PLANNING-PD AND HELLO WORLD',
    population: 1409517397
  },
  {
    id: 4,
    name: '000010',
    area: 'COMPUTER-FORECAST BASED PLANNING-PD AND HELLO WORLD',
    population: 1409517397
  },
  {
    id: 4,
    name: '000010',
    area: 'COMPUTER-FORECAST BASED PLANNING-PD AND HELLO WORLD',
    population: 1409517397
  },
];

export type SortColumn = keyof Country | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})

export class NgbdSortableHeader {

  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}

@Component({
  selector: 'app-inquiry',
  templateUrl: './inquiry.component.html',
  styleUrls: ['./inquiry.component.css']
})
export class InquiryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  countries = COUNTRIES;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  onSort({column, direction}: SortEvent) {

    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting countries
    if (direction === '' || column === '') {
      this.countries = COUNTRIES;
    } else {
      this.countries = [...COUNTRIES].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
}
