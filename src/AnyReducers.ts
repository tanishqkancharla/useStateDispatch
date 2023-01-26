/**
 * Type-erased reducers
 * @public
 */
export type AnyReducers<S> = { [key: string]: (state: S, ...args: any[]) => S };

/**
 * Assert reducers extend the given type
 * @public
 */
export type AssertReducers<State, Actual extends AnyReducers<State>> = {};
