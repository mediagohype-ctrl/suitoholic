/**
 * Parses req[source] with a zod schema and replaces it with the parsed value.
 * Express 5 makes req.query a getter, so parsed query values go on req.validQuery.
 */
export const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const parsed = schema.parse(req[source] ?? {});
    if (source === "query") req.validQuery = parsed;
    else req[source] = parsed;
    next();
  };
