import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (err?.name === 'ZodError') {
    return res.status(400).json({
      message: 'Validation failed.',
      details: err.issues.map(
        issue => `${issue.path.join('.')}: ${issue.message}`,
      ),
    });
  }

  if (err instanceof HttpError || err?.statusCode) {
    return res
      .status(err.statusCode ?? err.status)
      .json({ message: err.message });
  }

  const isProd = process.env.NODE_ENV === 'production';

  res.status(500).json({
    message: isProd
      ? 'Something went wrong. Please try again later.'
      : err.message,
  });
};
