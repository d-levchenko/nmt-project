export const validate = schema => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) next(result.error);

  req.validated = result.data;
  next();
};
