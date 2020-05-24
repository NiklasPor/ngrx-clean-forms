---
id: array-adding-controls
title: Addition & Removal
---

The dynamic addition and removal of controls is the primary concern when choosing a FormArray over a FormGroup. Therefore the manipulation is as simple as editing any array inside the state.

The following examples will build on the following FormArray:

```typescript
initFormArray([['first'], ['second']]);
```

## Addition

To append a new FormControl to a FormArray the state can be updated as in the following example:

```typescript
const internalExampleReducer = createReducer(
    initialState,
    on(ExampleActions.appendControlToArray, (state) => ({
        ...state,
        array: {
            ...state.array,
            controls: [...state.array.controls, initFormControl(['new'])],
        },
    }))
);
```

## Removal

To remove the last FormControl of a FormArray the state can be updated as in the following example:

```typescript
const internalExampleReducer = createReducer(
    initialState,
    on(ExampleActions.removeLastControlFromArray, (state) => ({
        ...state,
        array: {
            ...state.array,
            controls: [...state.array.controls.slice(0, state.array.controls.length - 1)],
        },
    }))
);
```
