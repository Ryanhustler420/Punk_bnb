import {Component, OnInit, AfterViewInit, OnChanges, AfterContentInit, AfterContentChecked, AfterViewChecked} from '@angular/core';
import {RecipesService} from './recipes.service';
import {Recipe} from './recipe.model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage implements OnInit, AfterContentChecked {
  recipes: Recipe[];

  constructor(private recipesService: RecipesService) {}

  ngOnInit() {
    this.recipes = this.recipesService.getAllRecipes();
  }

  ngAfterContentChecked() {
    this.recipes = this.recipesService.getAllRecipes();
  }
}
