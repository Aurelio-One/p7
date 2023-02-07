/**
 * Class representing a tag.
 * */
class Tag {
  /**
   * Create a tag.
   * @param {string} type - The tag name.
   * @param {string} name - The tag name.
   * */
  constructor(type, name) {
    this.type = type
    this.name = name
  }

  createTag(searchedTag, searchRecipes) {
    /**
     * Create a tag component.
     */
    const tag = document.createElement('tag')
    tag.classList.add('tag', `${this.type}`)

    tag.innerHTML = `
    <span>${this.name}</span>
    <i class="fa-regular fa-circle-xmark"></i>
    `

    tag.querySelector('i').addEventListener('click', () => {
      searchedTag.splice(searchedTag.indexOf(this.name), 1)
      tag.remove()
      searchRecipes()
    })

    return tag
  }
}
