export class ValidationError extends Error {
    issues: string[];
    constructor(issues: string[]) {
        super();
        this.issues = issues;
    }
}

export class ValidationErrorResponse {
    errorMessage = "Неправильно введены данные";
}

export async function handleErrors<T>(func: () => Promise<T>) {
    try {
        const result = await func();
        return result;
    } catch (error) {
        if (error instanceof ValidationError) {
            return new ValidationErrorResponse();
        }

        throw error;
    }
}
