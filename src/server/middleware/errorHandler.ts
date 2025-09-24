import type { Request, Response, NextFunction } from 'express';
import {
	BadRequestError,
	UserNotAuthenticatedError,
	UserForbiddenError,
	NotFoundError,
} from '../lib/classes/errors';
import { respondWithError } from '../lib/functions/json';

export async function errorHandler(
	err: Error,
	_: Request,
	res: Response,
	__: NextFunction
) {
	let message = 'There was an issue on our end.';
	let statusCode = 500;

	if (err instanceof BadRequestError) {
		message = err.message;
		statusCode = 400;
	} else if (err instanceof UserNotAuthenticatedError) {
		message = err.message;
		statusCode = 401;
	} else if (err instanceof UserForbiddenError) {
		message = err.message;
		statusCode = 403;
	} else if (err instanceof NotFoundError) {
		message = err.message;
		statusCode = 404;
	}

	if (statusCode >= 500) {
		console.log(err.message);
	}

	respondWithError(res, statusCode, message);
}
