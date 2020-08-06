import { hasData } from "../../utils/utils";
import { fullEntities } from "./constants";

/** Converts queries from the external java class structure to the one consumed by the QB component
 */
export const importQuery = obj => {
  if (!obj) return {};
  if (!!obj["@class"] && obj["@class"].endsWith("QueryObject")) {
    return {
      combinator: obj.condition.toLowerCase(),
      not: false,
      rules: importQuery(obj.rules)
    };
  }

  return obj.map(item => {
    if (item.rules !== undefined) return importQuery(item);
    return {
      field: `${item.entity}.${item.field}`,
      operator: item.operator,
      value: (item.value || [""]).join(",")
    };
  });
};

/** converts queries generated by the QB component to the external structure before sending to the backend
 */
export const exportQuery = (obj, level0 = false) => {
  if (!obj) return {};
  if (!Array.isArray(obj) && obj.id.substring(0, 2) === "g-") {
    return {
      "@class": level0 ? "gov.gtas.model.udr.json.QueryObject" : "QueryObject",
      condition: obj.combinator.toUpperCase(),
      rules: exportQuery(obj.rules)
    };
  }

  return obj
    .map(item => {
      if (item.rules !== undefined) return exportQuery(item);
      if (!hasData(item.field)) return;
      const entpart = getEntityPart(item.field);
      return {
        "@class": "QueryTerm",
        entity: entpart,
        field: getFieldPart(item.field),
        operator: item.operator,
        value: item.value
          .replace(" ", ",")
          .split(",")
          .filter(Boolean),
        uuid: null,
        type: getEntityType(entpart, item.field)?.type
      };
    })
    .filter(Boolean);
};

export const getEntityPart = str => {
  return (str || "").split(".")[0];
};

export const getFieldPart = str => {
  let strarray = (str || "").split(".");
  delete strarray[0];

  return strarray.filter(Boolean).join(".");
};

function getEntityType(entpart, fieldpart) {
  return fullEntities[entpart].columns.find(item => {
    // console.log(`${entpart}.${fieldpart}`);
    return item.id === fieldpart;
  });
}
