export interface ArrayUpdate<T> {
    delete?(history: T): boolean;
    create?: T;
    update?: {
        where(history: T): boolean;
        data(history: T): T;
    }
}