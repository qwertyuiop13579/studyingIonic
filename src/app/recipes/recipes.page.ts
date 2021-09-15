import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe.model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage implements OnInit {

  recipes: Recipe[] = [{
    id: 'r1',
    title: 'Pizza',
    imageURL: 'https://static.toiimg.com/thumb/56933159.cms?width=1200&height=900',
    ingredients: ['Dough', 'Tomato', 'Cheese']
  },
  {
    id: 'r2',
    title: 'Pizza2',
    imageURL: 'https://static.toiimg.com/thumb/56933159.cms?width=1200&height=900',
    ingredients: ['Dough', 'Meat', 'Milk']
  }];

  constructor() { }

  ngOnInit() {
  }

}
