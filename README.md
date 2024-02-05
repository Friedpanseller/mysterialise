# Mysterialise
### Mysterious Serialisation of JavaScript data
Mysterialise will serialise a variety of NodeJS data types into a string to then deserialise later. This expands on the functionality of `JSON.stringify` as it does not handle `Buffer` and `Date` types very elegantly.

This supports nested objects and nested arrays.

Supported data types include:
- `Array`
- `Date`
- `RegExp`
- `Buffer`
- `string`
- `number`
- `boolean`
- `object`
- `null`
- `undefined`

## Usage
```ts
import { mystify, clarify } from "mysterialise";

// Some complex or simple object
const obj = [{
    bird: "parrot",
    feet: 4,
    firstSeen: new Date()
}, "cage", {
    contents: [
        1,
        {
            name: "dog",
            sound: undefined,
            video: Buffer.from([12,24,48])
        },
        null
    ]
}]

// String version of the above object
const seralised = mystify(obj);
// {"type":"Array","data":[{"type":"obj...
console.log(serialised);

// Original object version of the above object
const unserialised = clarify(serialised);
// dog
console.log(unserialised[2].contents[1].name);
```

## Install
```
npm i mysterialise
```