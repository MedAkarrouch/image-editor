import { filters } from "./constants"
import { asideList, deleteBtn, downloadBtn, uploadFileInput } from "./elements"
import {
  deleteImage,
  downloadImage,
  getInitialAsideListHtml,
  loadFile,
  updateImageFilter
} from "./functions"
import { state } from "./state"

asideList.innerHTML = getInitialAsideListHtml()
filters.forEach((filter, index) => {
  const inputEl = (document.getElementById(
    `filter-input--${index}`
  ) as HTMLInputElement)!
  const valueSpan = document.getElementById(`filter-value--${index}`)!
  const resetSpan = document.getElementById(`filter-reset--${index}`)!

  inputEl.addEventListener("input", (e) => {
    const value = (e.target as HTMLInputElement)!.value
    valueSpan.textContent = value + filter.unit
    state.filterState[filter.name] = `${value}${filter.unit}`
    updateImageFilter()
  })
  resetSpan.addEventListener("click", () => {
    valueSpan.textContent = filter.value + filter.unit
    inputEl.value = String(filter.value)
    state.filterState[filter.name] = `${filter.value}${filter.unit}`
    updateImageFilter()
  })
})
uploadFileInput.addEventListener("change", loadFile)
downloadBtn.addEventListener("click", downloadImage)
deleteBtn.addEventListener("click", deleteImage)
