import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private recipes: Recipe[] = [{
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

  getRecipes() {
    return [...this.recipes];
  }

  getRecipe(id: string) {
    return { ...this.recipes.find(recipe => recipe.id === id) };
  }
}
