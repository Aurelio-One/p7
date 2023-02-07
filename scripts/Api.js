/**
 * @function getRecipes
 * get the recipes data
 */
const getRecipes = async () => {
    try {
      const res = await fetch('./data/recipes.json')
      data = await res.json()
      return data
    } catch (err) {
      console.error(err.message)
      error_message.textContent = 'Erreur lors de la récupération des recettes.'
      error_message.style.display = 'inherit'
    }
  }