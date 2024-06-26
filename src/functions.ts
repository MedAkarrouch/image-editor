import { filters } from "./constants"
import {
  canvas,
  deleteBtn,
  downloadBtn,
  mainImgEl,
  uploadFileContainer,
  uploadFileInput
} from "./elements"
import { state } from "./state"

export const loadFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files) return
  const uploadedImg = target.files[0]
  if (!uploadedImg.type.startsWith("image")) return
  // Display image
  mainImgEl.src = URL.createObjectURL(uploadedImg)
  mainImgEl.style.display = "block"
  uploadFileContainer.style.display = "none"
  state.imageType = uploadedImg.type
  // remove disabled attributes drom buttons
  deleteBtn.removeAttribute("disabled")
  downloadBtn.removeAttribute("disabled")
}
export const deleteImage = () => {
  uploadFileInput.value = ""
  mainImgEl.src = ""
  resetState()
  mainImgEl.style.display = "none"
  uploadFileContainer.style.display = "flex"
  deleteBtn.setAttribute("disabled", "true")
  downloadBtn.setAttribute("disabled", "true")
}

export const updateImageFilter = () => {
  const filterString = Object.entries(state.filterState)
    .map(([name, value]) => `${name}(${value})`)
    .join(" ")
  mainImgEl.style.filter = filterString
}

export const getInitialAsideListHtml = () => `
            ${filters
              .map(
                (filter, index) => `<li>
                <p>
                <span>${filter.name}</span>
                <span id="filter-reset--${index}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                </span>
                <span id="filter-value--${index}">${filter.value}${filter.unit}</span>
                </p>
            <input type="range" min=${filter.min} max=${filter.max} step=${filter.step} value=${filter.value} id="filter-input--${index}" />
            </li>`
              )
              .join("")}
`

export const downloadImage = () => {
  const context = canvas.getContext("2d")
  if (!context || !state.imageType) return
  // Set canvas dimensions to the image dimensions
  canvas.width = mainImgEl.naturalWidth
  canvas.height = mainImgEl.naturalHeight

  // Apply the filters
  const filterString = Object.entries(state.filterState)
    .map(([name, value]) => `${name}(${value})`)
    .join(" ")

  // Draw the image with the filters applied
  context.filter = filterString
  context.drawImage(mainImgEl, 0, 0, canvas.width, canvas.height)

  // Convert canvas to data URL and trigger download
  const dataUrl = canvas.toDataURL(state.imageType)
  const link = document.createElement("a")
  link.href = dataUrl
  link.download = "filtered-image.png"
  link.click()
}

const resetState = () => {
  state.imageType = undefined
  state.filterState = filters.reduce((acc, filter) => {
    acc[filter.name] = `${filter.value}${filter.unit}`
    return acc
  }, {} as Record<string, string>)
  filters.forEach((filter, index) => {
    const inputEl = (document.getElementById(
      `filter-input--${index}`
    ) as HTMLInputElement)!
    const valueSpan = document.getElementById(`filter-value--${index}`)!
    valueSpan.textContent = filter.value + filter.unit
    inputEl.value = String(filter.value)
    updateImageFilter()
  })
}
