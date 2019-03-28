import {Component, OnInit} from '@angular/core';
import {Recipe} from './recipe.model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage implements OnInit {
  recipes: Recipe[] = [
    {
      id: 'r1',
      title: 'Schnitzel',
      imageUrl: 'https://toriavey.com/images/2011/03/IMG_1544.jpg',
      ingredients: ['French Fries', 'Pork Meat', 'Salad'],
    },
    {
      id: 'r2',
      title: 'Spaghetti',
      imageUrl:
        'https://www.cookingclassy.com/wp-content/uploads/2018/01/instant-pot-spaghetti-12-500x500.jpg',
      ingredients: ['Spaghetti', 'Meat', 'Tomatoes'],
    },
  ];

  constructor() {}

  ngOnInit() {}
}
