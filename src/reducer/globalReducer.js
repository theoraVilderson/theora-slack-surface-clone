export const initialValue = {
	user: null,
};

export const actionTypes = {
	SET_USER: "SET_USER",
	LOGOUT_USER: "LOGOUT_USER",
};

const reducer = (state, { type, payload } = {}) => {
	const { SET_USER, LOGOUT_USER } = actionTypes;

	switch (type) {
		case SET_USER:
			window.localStorage.setItem("userId", payload.user.id);

			return {
				...state,
				user: payload.user,
			};

		case LOGOUT_USER:
			window.localStorage.removeItem("userId");

			return {
				...state,
				user: null,
			};

		default:
			return state;
	}
};
export default reducer;
