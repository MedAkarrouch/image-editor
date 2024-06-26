import { filters } from "./constants"

type StateType = {
  filterState: Record<string, string>
  imageType?: string
}
export const state: StateType = {
  filterState: filters.reduce((acc, filter) => {
    acc[filter.name] = `${filter.value}${filter.unit}`
    return acc
  }, {} as Record<string, string>),
  imageType: undefined
}
