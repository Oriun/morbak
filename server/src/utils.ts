import { ArrayUpdate } from "./types/common.types.js";

export function arrayUpdate<T>(array: T[], payload: ArrayUpdate<T>) {
    if (payload.delete) {
        for (const item of array) {
            if (payload.delete(item)) {
                array.splice(array.indexOf(item), 1);
                return true;
            }
        }
    }
    if (payload.create) {
        array.push(payload.create);
    }

    if (payload.update) {
        for (const item of array) {
            if (payload.update.where(item)) {
                array.splice(array.indexOf(item), 1, payload.update.data(item));
            }
        }
    }
}

export function randomName() {
    return "Anonymous"
}