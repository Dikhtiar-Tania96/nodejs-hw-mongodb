export async function errorHandler (err, req, res, next)  {
    res.status(500).json({
      status: 500,
      message: 'Something went wrong',
      data: { error: err.message }
    });
  };