import { AnyReducers } from "./AnyReducers";
import { shallowEqual } from "./shallowEqual";

/**
 * @public
 */
type TupleRest<T extends unknown[]> = T extends [any, ...infer U] ? U : never;

/**
 * The type of a dispatch function
 * @public
 */
export type Dispatcher<R extends AnyReducers<any>, O = void> = {
	[K in keyof R]: (...args: TupleRest<Parameters<R[K]>>) => O;
};

export function keys<T extends object>(obj: T): Array<keyof T> {
	return Object.keys(obj) as any;
}

export function reducersToDispatcher<S, R extends AnyReducers<S>>(props: {
	dispatch: (state: S) => void;
	getState: () => S;
	reducers: R;
}) {
	const { dispatch, getState, reducers } = props;

	const dispatcher = keys(reducers).reduce((result, reducerKey) => {
		result[reducerKey as keyof R] = (...args: any[]) => {
			const state = getState();
			const reducer = reducers[reducerKey];
			const newState = reducer(state, ...args);
			if (shallowEqual(state, newState)) return false;
			dispatch(newState);
			return true;
		};
		return result;
	}, {} as any) as Dispatcher<R, boolean>;

	return dispatcher;
}
