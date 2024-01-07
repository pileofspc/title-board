// function deepCopy<T extends Record<PropertyKey, any>>(target: T): DeepCopy<T> {
//     return JSON.parse(JSON.stringify(target));
// }
class ApiResponse<T> {
    success: boolean;
    data: T;
    constructor(success: boolean, data: T) {
        this.success = success;
        this.data = data;
    }
}
