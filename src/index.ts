export type VariableType = "Array" | "Date" | "RegExp" | "Buffer" | "string" | "number" | "boolean" | "object" | "null" | "undefined";

export type MysteryType = {
  "t": VariableType,
  "d": any,
  "n"?: string | null
};

function serialise(variable: any, name: string | null): MysteryType {
  if (variable === null) {
    return {
      "t": "null",
      "d": null,
      ...(name ? { name: name } : {})
    };
  } else if (variable === undefined) {
    return {
      "t": "undefined",
      "d": undefined,
      ...(name ? { name: name } : {})
    };
  } else if (variable.constructor === Array) {
    return {
      "t": "Array",
      "d": variable.map(v => serialise(v, null)),
      ...(name ? { name: name } : {})
    };
  } else if (variable.constructor === Date) {
    return {
      "t": "Date",
      "d": variable.toISOString(),
      ...(name ? { name: name } : {})
    }
  } else if (variable.constructor === RegExp) {
    return {
      "t": "RegExp",
      "d": variable.toString(),
      ...(name ? { name: name } : {})
    }
  } else if (variable.constructor === Buffer) {
    return {
      "t": "Buffer",
      "d": JSON.parse(JSON.stringify(variable)).data,
      ...(name ? { name: name } : {})
    }
  } else if (typeof variable === "string") {
    return {
      "t": "string",
      "d": variable,
      ...(name ? { name: name } : {})
    }
  } else if (typeof variable === "number") {
    return {
      "t": "number",
      "d": variable,
      ...(name ? { name: name } : {})
    }
  } else if (typeof variable === "boolean") {
    return {
      "t": "boolean",
      "d": variable,
      ...(name ? { name: name } : {})
    }
  } else if (typeof variable === "object") {
    return {
      "t": "object",
      "d": Object.entries(variable).map(
        ([name, data]) => serialise(data, name)
      ),
      ...(name ? { name: name } : {})
    }
  }
  throw ("Cannot mysterise data type");
}

function deserialise(variable: MysteryType) {
  if (variable["t"] === "null") {
    return null;
  } else if (variable["t"] === "undefined") {
    return undefined;
  } else if (variable["t"] === "Array") {
    return variable["d"].map((d: MysteryType) => deserialise(d));
  } else if (variable["t"] === "Date") {
    return new Date(variable["d"]);
  } else if (variable["t"] === "RegExp") {
    const parts = /\/(.*)\/(.*)/.exec(variable["d"]);
    if (parts) {
      return new RegExp(parts[1], parts[2]);
    } else {
      return null;
    }
  } else if (variable["t"] === "Buffer") {
    return Buffer.from(variable["d"]);
  } else if (variable["t"] === "string") {
    return variable["d"];
  } else if (variable["t"] === "number") {
    return variable["d"];
  } else if (variable["t"] === "boolean") {
    return variable["d"];
  } else if (variable["t"] === "object") {
    let obj = {};
    variable["d"].forEach((v: MysteryType) => {
      if (v !== null && v !== undefined) {
        if (v["n"]) {
          obj = { ...obj, [v["n"]]: deserialise(v) };
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