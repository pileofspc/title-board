import type { H3Event } from "h3";
import { ZodError } from "zod";

export class BaseError extends Error {
    name = "BaseError";
    message: string;
    issues: string[];
    response: string = "Это показываем пользователю";
    constructor(issues: string[], cause?: Error) {
        super();
        this.cause = cause;
        this.issues = issues;
        this.message = this.name + ": " + this.issues.join("; ");
    }
}
export class DataAccessError extends BaseError {
    name = "DataAccessError";
}
export class ValidationError extends BaseError {
    name = "ValidationError";
}
export class DomainError extends BaseError {
    name = "DomainError";
}

export function withErrorHandling<A extends unknown[], R>(
    func: (event: H3Event, ...args: A) => Promise<R>
) {
    return async (event: H3Event, ...args: A) => {
        try {
            return await func(event, ...args);
        } catch (error) {
            if (error instanceof ValidationError) {
                setResponseStatus(event, 500, error.name);
                // return null;
            }

            throw error;
        }
    };
}

export function withRethrowingAsValidationError<A extends unknown[], R>(
    fn: (...args: A) => R
) {
    return function (...args: A): R {
        try {
            return fn(...args);
        } catch (e) {
            const error = e as ZodError;
            throw new ValidationError(
                error.issues.map((issue) => issue.message),
                error
            );
        }
    };
}
