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
  const search = searchbar.value.toLowerCase()
  const data = await getRecipes()

  // if the search input is empty or less than 3 characters long, return the whole data list
  if (!search || search.length < 3) {
    filteredRecipes = [...data]
    return
  } else {
    filteredRecipes = []
  }
  // if not, check if the searched character are found in the recipe name,
  // ingredients or description and push the return results into the filteredRecipes array
  data.forEach((recipe) => {
    if (
      recipe.name.toLowerCase().includes(search) ||
      recipe.ingredients.find((ing) =>
        ing.ingredient.toLowerCase().includes(search)
      ) ||
      recipe.description.toLowerCase().includes(search)
    ) {
      filteredRecipes.push(recipe)
    }
  })
}

/**
 * @function filterRecipesWithTags
 * filter recipes using the tags
 */
const filterRecipesWithTags = () => {
  const selectedIngredients = selectedTags.ingredients
  const selectedAppliances = selectedTags.appliances
  const selectedUstensils = selectedTags.ustensils

  if (
    !selectedIngredients.length &&
    !selectedAppliances.length &&
    !selectedUstensils.length
  ) {
    return displayRecipes()
  } else {
    filteredRecipes = filteredRecipes.filter(
      (recipe) =>
        (!selectedIngredients.length ||
          selectedIngredients.every((selectedIngredient) =>
            recipe.ingredients
              .map((ingr) => ingr.ingredient.toLowerCase())
              .includes(selectedIngredient)
          )) &&
        (!selectedAppliances.length ||
          selectedAppliances.includes(recipe.appliance.toLowerCase())) &&
        (!selectedUstensils.length ||
          selectedUstensils.every((selectedUstensil) =>
            recipe.ustensils
              .map((ust) => ust.toLowerCase())
              .includes(selectedUstensil)
          ))
    )
  }
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
  filteredRecipes.forEach((recipe) => {
    const newRecipe = new Recipe(
      recipe.id,
      recipe.name,
      recipe.servings,
      recipe.ingredients,
      recipe.time,
      recipe.description,
      recipe.appliance,
      recipe.ustensils
    )
    recipes.appendChild(newRecipe.createRecipe())
  })

  // update displayed tags
  updateLists()
}

/**
 * @function updateLists
 * update the dropdowns lists (ingredients, appliances, ustenils according to the filtered recipes
 */
const updateLists = () => {
  // retrieve ingredients from all remaining (filtered) recipes
  let ingredientsOptions = filteredRecipes.map((recipe) => recipe.ingredients)

  ingredientsOptions = ingredientsOptions
    .map(([{ ingredient }]) => ingredient.toLowerCase())
    .sort((a, b) => a.localeCompare(b))

  // remove duplicated ingredients
  ingredientsOptions = [...new Set(ingredientsOptions)]

  // retrieve appliances from all remaining (filtered) recipes
  let appliancesOptions = filteredRecipes
    .map((recipe) => recipe.appliance.toLowerCase())
    .sort((a, b) => a.localeCompare(b))
  // remove duplicated appliances
  appliancesOptions = [...new Set(appliancesOptions)]

  // retrieve ustensils from all remaining (filtered) recipes
  let ustensilsOptions = filteredRecipes.map((recipe) => recipe.ustensils)
  ustensilsOptions = ustensilsOptions
    .map(([ustensil]) => ustensil.toLowerCase())
    .sort((a, b) => a.localeCompare(b))
  // remove duplicated ustensils
  ustensilsOptions = [...new Set(ustensilsOptions)]

  // display remaining ingredients inside the dropdown list
  const ingredientsSearch = ingredientsMenuDropdown
    .querySelector('.search input')
    .value.toLowerCase()
  ingredientsList.innerHTML = ''
  ingredientsOptions.forEach((ingredient) => {
    if (
      ingredient.toLowerCase().includes(ingredientsSearch) ||
      !ingredientsSearch.length
    ) {
      const ingredientElement = document.createElement('div')
      ingredientElement.textContent = ingredient
      ingredientElement.addEventListener('click', () => {
        !selectedTags.ingredients.includes(ingredient) &&
          createTag('ingredients', ingredient)
      })
      ingredientsList.appendChild(ingredientElement)
    }
  })

  // display remaining appliances inside the dropdown list
  const appliancesSearch = appliancesMenuDropdown
    .querySelector('.search input')
    .value.toLowerCase()
  appliancesList.innerHTML = ''
  appliancesOptions.forEach((appliance) => {
    if (
      appliance.toLowerCase().includes(appliancesSearch) ||
      !appliancesSearch.length
    ) {
      const applianceElement = document.createElement('div')
      applianceElement.textContent = appliance
      applianceElement.addEventListener('click', () => {
        !selectedTags.appliances.includes(appliance) &&
          createTag('appliances', appliance)
      })
      appliancesList.appendChild(applianceElement)
    }
  })

  // display remaining ustensils inside the dropdown list
  const ustensilsSearch = ustensilsMenuDropdown
    .querySelector('.search input')
    .value.toLowerCase()
  ustensilsList.innerHTML = ''
  ustensilsOptions.forEach((ustensil) => {
    if (
      ustensil.toLowerCase().includes(ustensilsSearch) ||
      !ustensilsSearch.length
    ) {
      const ustensilElement = document.createElement('div')
      ustensilElement.textContent = ustensil
      ustensilElement.addEventListener('click', () => {
        !selectedTags.ustensils.includes(ustensil) &&
          createTag('ustensils', ustensil)
      })
      ustensilsList.appendChild(ustensilElement)
    }
  })
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
  menus.forEach((menu) => {
    menu.addEventListener('click', (e) => {
      const dropdownMenu = eval(menu.id + 'Dropdown')
      if (dropdownMenu.classList.contains('hidden')) {
        dropdownMenu.classList.remove('hidden')
      } else if (e.target.tagName !== 'INPUT') {
        dropdownMenu.classList.add('hidden')
        dropdownMenu.querySelector('.search input').value = ''
      }
      // close the menu when clicked outside of it
      document.addEventListener('mouseup', function (e) {
        if (!menu.contains(e.target)) {
          dropdownMenu.classList.add('hidden')
          dropdownMenu.querySelector('.search input').value = ''
        }
      })
    })
  })

  searchRecipes()
}

init()
