// set state
let selectedTags = {
  ingredients: [],
  appliances: [],
  ustensils: [],
}
let filteredRecipes = []

/**
 * @function searchRecipes
 * update the filtered recipes according to the user's selection and update the interface
 */
const searchRecipes = async () => {
  await filterRecipesWithSearchbar()
  filterRecipesWithTags()
  displayRecipes()
}

/**
 * @function filterRecipesWithSearchbar
 * filter recipes using the searchbar input
 */
const filterRecipesWithSearchbar = async () => {
  const data = await getRecipes()
  const search = searchbar.value.toLowerCase()

  // if the search input is empty or less than 3 characters long, return the whole data list
  if (!search || search.length < 3) {
    filteredRecipes = [...data]
    return
  } else {
    filteredRecipes = []
  }
  // if not, check if the searched character are found in the recipe name,
  // ingredients or description and push the return results into the filteredRecipes array
  for (let i = 0; i < data.length; i++) {
    let nameMatch = false
    let ingredientMatch = false
    let descriptionMatch = false
    const recipe = data[i]
    const recipeName = recipe.name.toLowerCase()
    const recipeDescription = recipe.description.toLowerCase()
    for (let j = 0; j < recipe.ingredients.length; j++) {
      const ingredient = recipe.ingredients[j].ingredient.toLowerCase()
      if (ingredient === search) {
        ingredientMatch = true
        break
      }
    }
    if (recipeName.indexOf(search) !== -1) {
      nameMatch = true
    }
    if (recipeDescription.indexOf(search) !== -1) {
      descriptionMatch = true
    }
    if (nameMatch || ingredientMatch || descriptionMatch) {
      filteredRecipes.push(recipe)
    }
  }
}

/**
 * @function filterRecipesWithTags
 * filter recipes using the tags
 */
const filterRecipesWithTags = () => {
  const selectedIngredients = selectedTags.ingredients
  const selectedAppliances = selectedTags.appliances
  const selectedUstensils = selectedTags.ustensils

  const RecipesArray = []

  for (let i = 0; i < filteredRecipes.length; i++) {
    const recipe = filteredRecipes[i]
    const ingredients = recipe.ingredients
    const appliances = [recipe.appliance]
    const ustensils = recipe.ustensils

    // check if all selected ingredients are in the recipe
    let hasSelectedIngredients = true
    for (let j = 0; j < selectedIngredients.length; j++) {
      const selectedIngredient = selectedIngredients[j]
      let hasIngredient = false
      for (let k = 0; k < ingredients.length; k++) {
        const ingredient = ingredients[k]
        if (
          ingredient.ingredient.toLowerCase() ===
          selectedIngredient.toLowerCase()
        ) {
          hasIngredient = true
          break
        }
      }
      if (!hasIngredient) {
        hasSelectedIngredients = false
        break
      }
    }

    // check if all selected appliances are in the recipe
    let hasSelectedAppliances = true
    for (let j = 0; j < selectedAppliances.length; j++) {
      const selectedAppliance = selectedAppliances[j]
      let hasAppliance = false
      for (let k = 0; k < appliances.length; k++) {
        const appliance = appliances[k]
        if (appliance.toLowerCase() === selectedAppliance.toLowerCase()) {
          hasAppliance = true
          break
        }
      }
      if (!hasAppliance) {
        hasSelectedAppliances = false
        break
      }
    }

    // check if all selected ustensils are in the recipe
    let hasSelectedUstensils = true
    for (let j = 0; j < selectedUstensils.length; j++) {
      const selectedUstensil = selectedUstensils[j]
      let hasUstensil = false
      for (let k = 0; k < ustensils.length; k++) {
        const ustensil = ustensils[k].toLowerCase()
        if (ustensil === selectedUstensil.toLowerCase()) {
          hasUstensil = true
          break
        }
      }
      if (!hasUstensil) {
        hasSelectedUstensils = false
        break
      }
    }

    // if the recipe has all the selected ingredients, appliances and ustensils, add it to the results
    if (
      hasSelectedIngredients &&
      hasSelectedAppliances &&
      hasSelectedUstensils
    ) {
      RecipesArray.push(recipe)
    }
  }

  filteredRecipes = RecipesArray
}

/**
 * @function displayRecipes
 * generate recipe components according to the user's filters
 */
const displayRecipes = () => {
  // reset the displayed recipes
  recipes.innerHTML = ''

  // case: no results are found
  if (!filteredRecipes.length) {
    error_message.textContent =
      'Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc'
    error_message.classList.remove('hidden')
    return
  }

  // case: results are found
  if (!error_message.style.display || error_message.style.display !== 'none') {
    error_message.classList.add('hidden')
  }

  // render the recipes components
  for (let i = 0; i < filteredRecipes.length; i++) {
    const newRecipe = new Recipe(
      filteredRecipes[i].id,
      filteredRecipes[i].name,
      filteredRecipes[i].servings,
      filteredRecipes[i].ingredients,
      filteredRecipes[i].time,
      filteredRecipes[i].description,
      filteredRecipes[i].appliance,
      filteredRecipes[i].ustensils
    )
    recipes.appendChild(newRecipe.createRecipe())
  }

  // update displayed tags
  updateLists()
}

/**
 * @function updateLists
 * update the dropdowns lists (ingredients, appliances, ustenils according to the filtered recipes
 */
const updateLists = () => {
  // retrieve ingredients from all remaining (filtered) recipes
  let ingredientsArray = new Array(filteredRecipes.length)
  for (let i = 0; i < filteredRecipes.length; ++i) {
    ingredientsArray[i] = filteredRecipes[i].ingredients
  }
  let ingredientsOptions = new Array(ingredientsArray.length)
  for (let i = 0; i < ingredientsArray.length; ++i) {
    ingredientsOptions[i] = ingredientsArray[i][0].ingredient.toLowerCase()
  }
  ingredientsOptions.sort((a, b) => a.localeCompare(b))
  // remove duplicated ingredients
  ingredientsOptions = [...new Set(ingredientsOptions)]

  // retrieve appliances from all remaining (filtered) recipes
  let appliancesOptions = new Array(filteredRecipes.length)
  for (let i = 0; i < filteredRecipes.length; ++i) {
    appliancesOptions[i] = filteredRecipes[i].appliance.toLowerCase()
  }
  appliancesOptions.sort((a, b) => a.localeCompare(b))
  // remove duplicated appliances
  appliancesOptions = [...new Set(appliancesOptions)]

  // retrieve ustensils dients from all remaining (filtered) recipes
  let ustensilsArray = new Array(filteredRecipes.length)
  for (let i = 0; i < filteredRecipes.length; ++i) {
    ustensilsArray[i] = filteredRecipes[i].ustensils
  }
  let ustensilsOptions = new Array(ustensilsArray.length)
  for (let i = 0; i < ustensilsArray.length; ++i) {
    ustensilsOptions[i] = ustensilsArray[i][0].toLowerCase()
  }
  ustensilsOptions.sort((a, b) => a.localeCompare(b))
  // remove duplicated ustensils
  ustensilsOptions = [...new Set(ustensilsOptions)]

  // display remaining ingredients inside the dropdown list
  const ingredientsSearch = ingredientsMenuDropdown
    .querySelector('.search input')
    .value.toLowerCase()
  ingredientsList.innerHTML = ''
  for (let i = 0; i < ingredientsOptions.length; i++) {
    if (
      ingredientsOptions[i].toLowerCase().includes(ingredientsSearch) ||
      !ingredientsSearch.length
    ) {
      const ingredientElement = document.createElement('div')
      ingredientElement.textContent = ingredientsOptions[i]
      ingredientElement.addEventListener('click', () => {
        !selectedTags.ingredients.includes(ingredientsOptions[i]) &&
          createTag('ingredients', ingredientsOptions[i])
      })
      ingredientsList.appendChild(ingredientElement)
    }
  }

  // display remaining appliances inside the dropdown list
  const appliancesSearch = appliancesMenuDropdown
    .querySelector('.search input')
    .value.toLowerCase()
  appliancesList.innerHTML = ''
  for (let i = 0; i < appliancesOptions.length; i++) {
    if (
      appliancesOptions[i].toLowerCase().includes(appliancesSearch) ||
      !appliancesSearch.length
    ) {
      const applianceElement = document.createElement('div')
      applianceElement.textContent = appliancesOptions[i]
      applianceElement.addEventListener('click', () => {
        !selectedTags.appliances.includes(appliancesOptions[i]) &&
          createTag('appliances', appliancesOptions[i])
      })
      appliancesList.appendChild(applianceElement)
    }
  }

  // display remaining ustensils inside the dropdown list
  const ustensilsSearch = ustensilsMenuDropdown
    .querySelector('.search input')
    .value.toLowerCase()
  ustensilsList.innerHTML = ''
  for (let i = 0; i < ustensilsOptions.length; i++) {
    if (
      ustensilsOptions[i].toLowerCase().includes(ustensilsSearch) ||
      !ustensilsSearch.length
    ) {
      const ustensilElement = document.createElement('div')
      ustensilElement.textContent = ustensilsOptions[i]
      ustensilElement.addEventListener('click', () => {
        !selectedTags.ustensils.includes(ustensilsOptions[i]) &&
          createTag('ustensils', ustensilsOptions[i])
      })
      ustensilsList.appendChild(ustensilElement)
    }
  }
}

/**
 * @function createTag
 * @param type - the tag's type
 * @param name - the tag's name
 * generate a tag component and add it to the DOM
 */
const createTag = (type, name) => {
  const searchedTag = selectedTags[type]
  searchedTag.push(name.toLowerCase())

  const newTag = new Tag(type, name)
  tags.appendChild(newTag.createTag(searchedTag, searchRecipes))

  searchRecipes()
}

/**
 * @function init
 * initialise the app
 */
const init = () => {
  // event listeners to search ingredients, appliances ans ustensils inside the dropdown lists
  const ingredientsSearch =
    ingredientsMenuDropdown.querySelector('.search input')
  const appliancesSearch = appliancesMenuDropdown.querySelector('.search input')
  const ustensilsSearch = ustensilsMenuDropdown.querySelector('.search input')

  ingredientsSearch.addEventListener('input', updateLists)
  appliancesSearch.addEventListener('input', updateLists)
  ustensilsSearch.addEventListener('input', updateLists)

  // event listener to search for recipes when typing in the search bar
  searchbar.addEventListener('input', searchRecipes)

  // event listeners to open/close each dropdown menu
  const menus = [
    document.querySelector('#ingredientsMenu'),
    document.querySelector('#appliancesMenu'),
    document.querySelector('#ustensilsMenu'),
  ]

  for (let i = 0; i < menus.length; i++) {
    menus[i].addEventListener('click', (e) => {
      const dropdownMenu = eval(menus[i].id + 'Dropdown')
      if (dropdownMenu.classList.contains('hidden')) {
        dropdownMenu.classList.remove('hidden')
      } else if (e.target.tagName !== 'INPUT') {
        dropdownMenu.classList.add('hidden')
        dropdownMenu.querySelector('.search input').value = ''
      }
      // close the menu when clicked outside of it
      document.addEventListener('mouseup', function (e) {
        if (!menus[i].contains(e.target)) {
          dropdownMenu.classList.add('hidden')
          dropdownMenu.querySelector('.search input').value = ''
        }
      })
    })
  }

  searchRecipes()
}

init()
