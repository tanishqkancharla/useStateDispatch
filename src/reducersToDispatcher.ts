import { AnyReducers } from "./AnyReducers";

export type TupleRest<T extends unknown[]> = T extends [any, ...infer U]
	? U
	: never;

export type Dispatcher<R extends AnyReducers<any>, O = void> = {
	[K in keyof R]: (...args: TupleRest<Parameters<R[K]>>) => O;
};

export function keys<T>(obj: T): Array<keyof T> {
	return Object.keys(obj) as any;
}

export function reducersToDispatcher<
	S,
	R extends AnyReducers<S>,
	O = void
>(props: { dispatch: (state: S) => O; getState: () => S; reducers: R }) {
	const { dispatch, getState, reducers } = props;

	keys(reducers).reduce((result, reducerKey) => {
		result[reducerKey as keyof R] = (...args: any[]) => {
			const state = getState();
			const reducer = reducers[reducerKey];
			const newState = reducer(state, ...args);
			return dispatch(newState);
		};
		return result;
	}, {} as any) as Dispatcher<R, O>;
}
