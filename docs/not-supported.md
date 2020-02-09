---
id: not-supported
title: Open Features
---

| Feature                  | Status               | Description                                                                                                                                                                                          |
| ------------------------ | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Support `disabled`       | Implemented in 2.0.0 | Support the disabled attribute inside FormControls.                                                                                                                                                  |
| Async validators         | -                    |  Support the implemenation of async validators, which have side effects. _Can currently be implemented using the `additionalErrors` parameter of `getFormGroupSummary` and `getFormControlSummary`._ |
| `<input type="radio" />` | -                    | Support the usage of radio control groups. \*                                                                                                                                                        |
| `<select>`               | -                    | Support the usage of the basic `select` html tag. \*                                                                                                                                                 |
| `<select multiple>`      | -                    | Support the usage of the `multiple` attribute within the `select` tag. \*                                                                                                                            |

\*For now you can create a [custom component](b#inding-to-custom-input-components), which wraps the unsupported group.
