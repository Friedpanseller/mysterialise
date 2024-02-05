export type VariableType =
  // Array 1
  "A" |
  // Date 2
  "D" |
  // RegExp 3
  "R" |
  // Buffer 4
  "B" |
  // string 5
  "s" |
  // number 6
  "n" |
  // boolean 7
  "b" |
  // object 8
  "o" |
  // null 9
  "l" |
  // undefined 0
  "u"
  ;

export type MysteryType = {
  1: VariableType,  // Type
  2: any,           // Data
  3?: string | null // Name
};

function serialise(variable: any, name: string | null): MysteryType {
  if (variable === null) {
    return {
      1: "l",
      2: null,
      ...(name ? { 3: name } : {})
    };
  } else if (variable === undefined) {
    return {
      1: "u",
      2: undefined,
      ...(name ? { 3: name } : {})
    };
  } else if (variable.constructor === Array) {
    return {
      1: "A",
      2: variable.map(v => serialise(v, null)),
      ...(name ? { 3: name } : {})
    };
  } else if (variable.constructor === Date) {
    return {
      1: "D",
      2: variable.toISOString(),
      ...(name ? { 3: name } : {})
    }
  } else if (variable.constructor === RegExp) {
    return {
      1: "R",
      2: variable.toString(),
      ...(name ? { 3: name } : {})
    }
  } else if (variable.constructor === Buffer) {
    return {
      1: "B",
      2: JSON.parse(JSON.stringify(variable)).data,
      ...(name ? { 3: name } : {})
    }
  } else if (typeof variable === "string") {
    return {
      1: "s",
      2: variable,
      ...(name ? { 3: name } : {})
    }
  } else if (typeof variable === "number") {
    return {
      1: "n",
      2: variable,
      ...(name ? { 3: name } : {})
    }
  } else if (typeof variable === "boolean") {
    return {
      1: "b",
      2: variable,
      ...(name ? { 3: name } : {})
    }
  } else if (typeof variable === "object") {
    return {
      1: "o",
      2: Object.entries(variable).map(
        ([name, data]) => serialise(data, name)
      ),
      ...(name ? { 3: name } : {})
    }
  }
  throw ("Cannot mysterise data type");
}

function deserialise(variable: MysteryType) {
  if (variable[1] === "l") {
    return null;
  } else if (variable[1] === "u") {
    return undefined;
  } else if (variable[1] === "A") {
    return variable[2].map((d: MysteryType) => deserialise(d));
  } else if (variable[1] === "D") {
    return new Date(variable[2]);
  } else if (variable[1] === "R") {
    const parts = /\/(.*)\/(.*)/.exec(variable[2]);
    if (parts) {
      return new RegExp(parts[1], parts[2]);
    } else {
      return null;
    }
  } else if (variable[1] === "B") {
    return Buffer.from(variable[2]);
  } else if (variable[1] === "s") {
    return variable[2];
  } else if (variable[1] === "n") {
    return variable[2];
  } else if (variable[1] === "b") {
    return variable[2];
  } else if (variable[1] === "o") {
    let obj = {};
    variable[2].forEach((v: MysteryType) => {
      if (v !== null && v !== undefined) {
        if (v[3]) {
          obj = { ...obj, [v[3]]: deserialise(v) };
        }
      }
    })
    return obj;
  }
  return;
}

function Uint8Array2String(u8a: Uint8Array) {
  var hex = [];
  for (var i = 0; i < u8a.length; i++) {
    hex.push(u8a[i].toString(36));
  }
  return hex.join(",");
}

function String2Uint8Array(str: string) {
  return str.split(",").map(s => parseInt(s, 36));
}

export function mystify(variable: any): string {
  return JSON.stringify(serialise(variable, null));
}

export function clarify(variable: string) {
  return deserialise(JSON.parse(variable));
}