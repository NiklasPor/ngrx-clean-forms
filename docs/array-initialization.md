---
id: array-initialization
title: Initialization
---

A FormArray is a simple array of controls. All of its controls are of the **same** type. The controls can be initialized with either the [tuple](control-initialization#tuple-initialization) or [update](control-initialization#update-initialization) method.

**Example Initialization:**

```typescript
initFormArray([
    ['first'],
    {
        value: 'second',
    },
]);
```
