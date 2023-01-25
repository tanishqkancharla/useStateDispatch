# useStateDispatch

Essentially a replacement for `useReducer` that offers better ergonomics.

## Usage

`npm install use-state-dispatch`

```tsx
const initialState = 5

const reducers = {
  increment(state: number) {
    return state+1
  },

  decrement(state: number) {
    return state -1
  }
}

const [state, dispatch] = useStateDispatch(initialState, reducers)

dispatch.increment()
dispatch.decrement()
```

## Why it's nicer than useReducer

This is a nice alternative to `useReducer` because it gives you back a stable object with typed reducers.

I.e. `dispatch.inc` will autocomplete in Typescript to `dispatch.increment`.

This also lets you pass a stable refence to a function in e.g. an event handler to prevent unnecessary rerenders

```tsx
const [state, dispatch] = useStateDispatch(initialState, reducers)

return (
  <button
    onClick={dispatch.increment}
  >
  </button>
)

```

In spirit, this is similar to the [`useEvent` RFC](https://github.com/reactjs/rfcs/pull/220) in that dispatch functions are stable references to reducer functions with access to the latest state.

## Return value

The return value of a dispatcher is a boolean notifying if a state update actually happened or not: if the returned state from a reducer is "shallow equal" to the current state, then no state update will happen, and the dispatcher will return false. Otherwise, it will return true. The notion of shallow equal does an `Object.is` check, unless its an array or object, in which case it performs the `Object.is` check on its elements (so it's not recursive and only updates one-level deep). This is same check that React uses.

```tsx
const reducers = {
  tryIncrement(state: number) {
    if(state >= 1) return state
    return state+1
  },
}

const [state, dispatch] = useStateDispatch(0, reducers)

// Returns true, state is updated to 1
dispatch.increment()
// Returns false, state stays at 0
dispatch.increment()
```

This is nice if you're in a chaining flow for reducers: try reducers in sequence until one succeeds/is valid, like for keyboard shortcuts. Reducers often also have the reponsibility to validate a state update, so this can end up being useful.

## The reducer form

The reducer form also has less boilerplate and is more straightforward:

```tsx
// useReducer
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

// useStateDispatch
const reducers = {
  increment(state: number) {
    return state+1
  },
  decrement(state: number) {
    return state -1
  }
}
```

In the `useStateDispatch` reducers, the first argument always needs to be the state. And any other arguments to a reducer function will need to be provided when dispatching.

```tsx
const reducers = {
  increment(state: number, by: number) {
    return state+by
  },
}
...
const [state, dispatch] = useStateDispatch(initialState, reducers)

dispatch.increment(10)
dispatch.increment(20)
```

## Typing the reducers object

> Unfortunately, with Typescript, you can't place a type annotation hint on the reducers without collapsing its type.

This used to be the case, but with `satisfies` in Typescript 4.9, you can do this:

```tsx
const reducers = {
  increment(state: number, by: number) {
    return state+by
  },
} satisfies AnyReducers<number>

const [state, dispatch] = useStateDispatch(initialState, reducers)

// Reducer functions and arguments still autocomplete
dispatch
```

If you can't use TS 4.9, you can use the `AssertReducers` type helper instead that asserts a type without collapsing it:

```tsx
const reducers= {
  increment(state: number, by: number) {
    return state+by
  },
}

type ReducerTest = AssertReducers<number, typeof reducers>
```

The first generic type is the type of the state.
