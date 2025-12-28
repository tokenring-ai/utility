
type ParametricObjectRequirements = Record<string, number | string | null | undefined>;

export default function parametricObjectFilter(requirements: ParametricObjectRequirements) {
  return (obj: Record<string,unknown>) => {
    for (const [key, condition] of Object.entries(requirements)) {
      const [, operator, value] = String(condition).match(/^([<>]?[=<>]?)([^=<>].*)$/) ?? [];

      const field = obj[key];
      if (typeof field === "number") {
        const numValue = Number(value);
        switch (operator) {
          case ">":
            if (!(field > numValue)) return false;
            break;
          case "<":
            if (!(field < numValue)) return false;
            break;
          case ">=":
            if (!(field >= numValue)) return false;
            break;
          case "<=":
            if (!(field <= numValue)) return false;
            break;
          case "":
          case "=":
            if (field !== numValue) return false;
            break;
          default:
            throw new Error(`Unknown operator '${operator}'`);
        }
      } else if (typeof field === "string") {
        switch (operator) {
          case "":
          case "=":
            if (key !== "name" && field !== value) return false;
            break;
          default:
            throw new Error(`Operator '${operator}' not supported for strings`);
        }
      } else {
        throw new Error(`Unsupported field type for '${key}'`);
      }
    }
    return true;
  };
}