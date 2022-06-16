export type AnyReducers<S> = { [key: string]: (state: S, ...args: any[]) => S };

export type AssertReducers<State, Actual extends AnyReducers<State>> = {};
