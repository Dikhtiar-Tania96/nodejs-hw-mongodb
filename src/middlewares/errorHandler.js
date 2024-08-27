import {HttpError} from 'http-errors';

export async function errorHandler (err, req, res, next)  {
  if(err instanceof HttpError){
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      data: err,
    });
  }
console.error(err);

    res.status(500).json({
      status: 500,
      message: 'Something went wrong',
      data: err.message , // конкретне повідомлення про помилку, отримане з об'єкта помилки
    });       

  };