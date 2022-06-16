import { useMemo, useRef, useState } from "react";
import { AnyReducers } from "./AnyReducers";
import { reducersToDispatcher } from "./reducersToDispatcher";

function useRefCurrent<T>(value: T) {
	const ref = useRef<T>(value);
	ref.current = value;
	return ref;
}

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
