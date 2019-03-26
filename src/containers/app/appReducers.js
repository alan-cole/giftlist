import { CLICK_NAVIGATION_BUTTON } from './appConstants.js'

const initialState = {
	screenDisplayed: ""
}

export const screenNavigation = (state=initialState, action={}) => {
	switch(action.type) {
		case CLICK_NAVIGATION_BUTTON:
			return Object.assign({}, state, { screenDisplayed: action.payload })
		default:
			return state;
	}
}