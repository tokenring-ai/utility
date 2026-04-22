import { z } from "zod";
import type { JSONValue } from "./safeParse.ts";

export const JSONValueSchema: z.ZodType<JSONValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(JSONValueSchema),
    z.record(z.string(), JSONValueSchema),
  ]),
);
