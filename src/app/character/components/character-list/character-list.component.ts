import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CharactersService } from '../../../services/characters.service';
import { Characters } from '../../../models/characters';
import {switchAll, debounceTime, map, tap, startWith} from 'rxjs/operators';
import { of, BehaviorSubject } from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css']
})
export class CharacterListComponent implements OnInit {

  characters: Characters;
  form: FormGroup;
  loading$ = new BehaviorSubject<boolean>(true);

  constructor(private fb: FormBuilder, private characterService: CharactersService) { }

  get query() { return this.form.get('query'); }

  ngOnInit(): void {
    this.form = this.fb.group({
      query: null
    });

    this.query.valueChanges
      .pipe(
        startWith(''),
        tap(() => this.loading$.next(true)),
        map(query => this.characterService.getCharacters(query)),
        switchAll()
      ).subscribe(characters => {
        this.characters = characters;
        this.loading$.next(false);
    });

  }
}
