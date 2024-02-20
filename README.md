# Mysterialise
### Mysterious Serialisation of JavaScript data
Mysterialise will serialise a variety of NodeJS data types into a string to then deserialise later. This expands on the functionality of `JSON.stringify` as it does not handle `Buffer` and `Date` types very elegantly.

#### Issues with JSON Serialisation
1. `JSON.parse(JSON.stringify(new Date()))` becomes `"2024-02-05T00:58:08.999Z"` instead of `Date` object  
1. `JSON.parse(JSON.stringify(Buffer.from([16,24,36])))` becomes `{ type: 'Buffer', data: [ 16, 24, 36 ] }` instead of `Buffer` object  

#### Supported Data Types
Mysterialise supports nested objects and nested arrays, as well as the following types:
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
// {"t":1,"d":[{"t":"obj...
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
