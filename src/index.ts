export type VariableType = "Array" | "Date" | "RegExp" | "Buffer" | "string" | "number" | "boolean" | "object" | "null" | "undefined";

export type MysteryType = {
  "type": VariableType,
  "data": any,
  "name"?: string | null
};

function serialise(variable: any, name: string | null): MysteryType {
  if (variable === null) {
    return {
      "type": "null",
      "data": null,
      ...(name ? { name: name } : {})
    };
  } else if (variable === undefined) {
    return {
      "type": "undefined",
      "data": undefined,
      ...(name ? { name: name } : {})
    };
  } else if (variable.constructor === Array) {
    return {
      "type": "Array",
      "data": variable.map(v => serialise(v, null)),
      ...(name ? { name: name } : {})
    };
  } else if (variable.constructor === Date) {
    return {
      "type": "Date",
      "data": variable.toISOString(),
      ...(name ? { name: name } : {})
    }
  } else if (variable.constructor === RegExp) {
    return {
      "type": "RegExp",
      "data": variable.toString(),
      ...(name ? { name: name } : {})
    }
  } else if (variable.constructor === Buffer) {
    return {
      "type": "Buffer",
      "data": JSON.parse(JSON.stringify(variable)).data,
      ...(name ? { name: name } : {})
    }
  } else if (typeof variable === "string") {
    return {
      "type": "string",
      "data": variable,
      ...(name ? { name: name } : {})
    }
  } else if (typeof variable === "number") {
    return {
      "type": "number",
      "data": variable,
      ...(name ? { name: name } : {})
    }
  } else if (typeof variable === "boolean") {
    return {
      "type": "boolean",
      "data": variable,
      ...(name ? { name: name } : {})
    }
  } else if (typeof variable === "object") {
    return {
      "type": "object",
      "data": Object.entries(variable).map(
        ([name, data]) => serialise(data, name)
      ),
      ...(name ? { name: name } : {})
    }
  }
  throw ("Cannot mysterise data type");
}

function deserialise(variable: MysteryType) {
  if (variable.type === "null") {
    return null;
  } else if (variable.type === "undefined") {
    return undefined;
  } else if (variable.type === "Array") {
    return variable.data.map((d: MysteryType) => deserialise(d));
  } else if (variable.type === "Date") {
    return new Date(variable.data);
  } else if (variable.type === "RegExp") {
    const parts = /\/(.*)\/(.*)/.exec(variable.data);
    if (parts) {
      return new RegExp(parts[1], parts[2]);
    } else {
      return null;
    }
  } else if (variable.type === "Buffer") {
    return Buffer.from(variable.data);
  } else if (variable.type === "string") {
    return variable.data;
  } else if (variable.type === "number") {
    return variable.data;
  } else if (variable.type === "boolean") {
    return variable.data;
  } else if (variable.type === "object") {
    let obj = {};
    variable.data.forEach((v: MysteryType) => {
      if (v !== null && v !== undefined) {
        if (v.name) {
          obj = { ...obj, [v.name]: deserialise(v) };
        }
      }
    })
    return obj;
  }
  return;
}

export function mystify(variable: any): string {
  return JSON.stringify(serialise(variable, null));
}

export function clarify(variable: string) {
  return deserialise(JSON.parse(variable));
}