import type { H3Event } from "h3";

export class DomainError extends Error {
    name = "Business Error";
    issues: string[];
    response: string = "Это показываем пользователю";
    constructor(issues: string[]) {
        super();
        this.issues = issues;
        this.message = this.name + ": " + this.issues.join("; ");
    }
}
export class ValidationError extends Error {
    name = "Validation Error";
    issues: string[];
    response: string = "Это показываем пользователю";
    constructor(issues: string[]) {
        super();
        this.issues = issues;
        this.message = this.name + ": " + this.issues.join("; ");
    }
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
