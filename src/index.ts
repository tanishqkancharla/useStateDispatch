import { useMemo, useRef, useState } from "react";
import { AnyReducers, AssertReducers } from "./AnyReducers";
import { Dispatcher, reducersToDispatcher } from "./reducersToDispatcher";

export type { AnyReducers, Dispatcher, AssertReducers };

function useRefCurrent<T>(value: T) {
	const ref = useRef<T>(value);
	ref.current = value;
	return ref;
}

/**
 * useState with a dispatch function
 * @public
 */
export function useStateDispatch<S, R extends AnyReducers<S>>(
	initialState: S,
	reducers: R
) {
	const [state, setState] = useState(initialState);

	const stateRef = useRefCurrent(state);

	const dispatch = useMemo(
		() =>
			reducersToDispatcher({
				dispatch: setState,
				getState: () => stateRef.current,
				reducers,
			}),
		[]
	);

	return [state, dispatch] as const;
}
