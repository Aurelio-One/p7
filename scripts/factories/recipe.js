/**
 * Class representing a recipe.
 * */
class Recipe {
  /**
   * Create a recipe.
   * @param {number} id - The recipe id.
   * @param {string} name - The recipe name.
   * @param {number} servings - The recipe servings.
   * @param {array} ingredients - The recipe ingredients.
   * @param {number} time - The recipe time.
   * @param {string} description - The recipe description.
   * @param {string} appliance - The recipe appliance.
   * @param {array} ustensils - The recipe ustensils.
   *
   */
  constructor(
    id,
    name,
    servings,
    ingredients,
    time,
    description,
    appliance,
    ustensils
  ) {
    this.id = id
    this.name = name
    this.servings = servings
    this.ingredients = ingredients
    this.time = time
    this.description = description
    this.appliance = appliance
    this.ustensils = ustensils
  }

  createRecipe() {
    /**
     * Create a recipe component.
     */
    const article = document.createElement('article')
    article.classList.add('recipe')
    const ingredientsList = document.createElement('div')

    for (let i = 0; i < this.ingredients.length; i++) {
      ingredientsList.innerHTML += `
      <div class="ingredients">
         <span>${this.ingredients[i].ingredient}</span>
         <span>${
           !this.ingredients[i].quantity
             ? ''
             : this.ingredients[i].unit
             ? ': ' +
               this.ingredients[i].quantity +
               ' ' +
               this.ingredients[i].unit
             : ': ' + this.ingredients[i].quantity
         }</span>
      </div>
      `
    }
    const recipeHours = Math.floor(this.time / 60)
    const recipeMinutes = this.time % 60

    article.innerHTML = `
    <div class="recipe_img"></div>
    <div class="recipe_content">
        <div class="recipe_header">
            <h2>${this.name}</h2>
            <div class="time">
                <i class="fa-regular fa-clock"></i>
                <span>
                ${recipeHours > 0 ? recipeHours + 'h' : ''} 
                ${recipeMinutes > 0 ? recipeMinutes + 'min' : ''}
                </span>
            </div>
        </div>
        <div class="recipe_body">
            <div>
            ${ingredientsList.innerHTML}
            </div>
            <div>
                <div class="description">${this.description}</div>
            </div>
        </div>
    </div>
    `
    return article
  }
}
