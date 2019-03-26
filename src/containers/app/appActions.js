import { CLICK_NAVIGATION_BUTTON } from './appConstants.js'

export const clickNavigationButton = (screen) => ({
	type: CLICK_NAVIGATION_BUTTON,
	payload: screen
})