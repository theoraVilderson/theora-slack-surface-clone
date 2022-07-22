import { useContext, createContext, useReducer } from "react";

export const GlobalContext = createContext([{}]);

export const GlobalStateProvider = ({ initialValue, reducer, children }) => {
	return (
		<GlobalContext.Provider value={useReducer(reducer, initialValue)}>
			{children}
		</GlobalContext.Provider>
	);
};

export function useGlobalContext() {
	return useContext(GlobalContext);
}
