import pg from "pg";

const pool = new pg.Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
});

export class CustomQuery<T = unknown> {
    text: string;
    values: unknown[];
    // приватное поле нужно только для того, чтобы дженерик не терялся
    // при некоторых операциях с этим классом
    #response = null as T;
    constructor(text: string, values: unknown[] = []) {
        this.text = text;
        this.values = values;
    }
}

export class QueryBatcher<T = []> {
    protected queries: CustomQuery<unknown>[] = [];

    batch<U>(
        querySource: CustomQuery<U>
    ): QueryBatcher<T extends any[] ? [...T, U] : [T, U]>;
    batch<U extends any[]>(querySource: {
        [K in keyof U]: CustomQuery<U[K]>;
    }): QueryBatcher<
        T extends any[]
            ? U extends any[]
                ? [...T, ...U]
                : [...T, U]
            : U extends any[]
              ? [T, ...U]
              : [T, U]
    >;
    batch<U extends any[]>(
        querySource: QueryBatcher<U>
    ): QueryBatcher<T extends any[] ? [...T, U] : [T, U]>;
    batch(querySource: CustomQuery | CustomQuery[] | QueryBatcher) {
        if (Array.isArray(querySource)) {
            querySource.forEach((customQuery) => {
                this.queries.push(customQuery);
            });
        } else if (querySource instanceof QueryBatcher) {
            querySource.queries.forEach((customQuery) => {
                this.queries.push(customQuery);
            });
        } else {
            this.queries.push(querySource);
        }

        return this as QueryBatcher<unknown[]>;
    }

    async executeConsecutively() {
        const results = [];
        for (const customQuery of this.queries) {
            results.push(await querySingle(customQuery));
        }
        return results as T;
    }

    async executeInParallel() {
        return Promise.allSettled(
            this.queries.map((customQuery) => querySingle(customQuery))
        ) as unknown as T;
    }

    async executeInTransaction() {
        return (await transactionOld(this.queries)) as T;
    }

    async execute() {
        if (this.queries.length === 1) {
            return this.executeConsecutively();
        }
        return this.executeInTransaction();
    }
}

// interface QueryBatcherConstructor {
//     new <T>(querySource: CustomQuery<T>): QueryBatcher<[T]>;
//     new <T extends any[]>(querySource: {
//         [K in keyof T]: CustomQuery<T[K]>;
//     }): QueryBatcher<T>;
//     new <T>(querySource: QueryBatcher<T>): QueryBatcher<T>;
//     new (): QueryBatcher<[]>;
// }
// export const QueryBatcherConstructor: QueryBatcherConstructor = QueryBatcher;

//      1) Так нельзя: return this as QueryBatcher<[T extends any[] ? ...T : T, U]>, а надо
// return this as QueryBatcher<T extends any[] ? [...T, U] : [T, U]>, но см. пункт 2
//      2) Так нельзя: return this as QueryBatcher<T extends any[] ? [...T, U] : [T, U]>, потому что
// T это юнион CustomQuery<U> | CustomQuery<U>[] | QueryBatcher<U> и нельзя прямо в типах это проверять(сужать тип),
// Надо именно до того как вернуть сузить тип рантайм проверками
//      3) Выбирать правильный параметр: return this as QueryBatcher<[T, U]> смотреть, может быть не T или U, а typeof arg
//      4) Если надо получить или принять что-то более конкретное, чем string[] или подобное, можно использовать mapped types
// function testUnion2<T>(arg: { [K in keyof T]: CustomQuery<T[K]> }) {
//     return arg;
// }
// Вернет что-то кортежеподобное [CustomQuery<string>, CustomQuery<number[]>], но при этом останутся методы push, pop и тд
//      5) Вспомнить, когда нужно использовать перегрузки:
// https://www.typescriptlang.org/play/?#code/C4TwDgpgBAwgrgZ2AewLYEU4QE4gDwAqUAvFHAHYDW5yA7uQHwlQDeAsAFBTdTAQAewAFxQk2AJbkA5gG5OPKADcAhgBssCAPwiAFGMlSoAHyjk4qAEY5jpuKtU2KAEwgAzSRCcBKANoBdOQ4AX0DXCgBjYHFkcihXZGRCBh1lbCkReCQ0TBx8AgZ-L1Z5HmwIYDhsWNTZTiDOcJikKDKEAEZmeOQdFj5BEQByZQQnAaCoYdhEFAwsXDx9aX8GLwam4BaIBAAmToSdHxLuFl4BYSgAImGnC6hxycyZnPnFqQYAGiPWU-7L67bbvcEFMsrNcngzJYcMtPhw-EUAPQIqC0bAxQygSAAOlMyA2EEUEGqZHI0VirxskKs2H8cWQ2FEaGgZWGMTW5GarQAzHtuiwgqsOJxhULRWFyJEyVALKlCFAzkSnMDlOQQMsUmkRCcfABpKCSKCUCAgZCuKAEPwZabZOZ5XV+JgC4pcUrlSrVNKBeocRocjatAAszBl2B6fXOQxGYwmwMeNvBr2Wgt9nK2AFZg6kDl8TuGRFcRoCYyCnraFsAJNIPjmfucC05tkWHtawfMqdCHbD4ezUwgAGyZ0P8wUikXiyUxaXKABeSQ16RL8fm+S8VtBzzyDFCESik5ls6ICvISomqvVNS1UF1+tiRpNZota9L4II9sdq++14Nd9N5sti9bO0dQdO5OHHXdYn3ecnyXEAbDjQDaRMDcACFlGAcIAAscCKdgXW4MoKiqCZPTqHt-S2AB2TNpzDM5BmuaNm3XMtEwdZN1k2BAAA4aOzfDvjzP5CzuYsEI3ctKzeWEFFzejhIbJtYxbCT2xpTtOG7H1ONaABOPjhyAA
// https://www.typescriptlang.org/play/?#code/PTAEBcE8AcFNQMIFcDO4D2BbAik2AnSAHgBVQBeUJAOwGtr0B3agPgtAG8BYAKBFAEDwsAB7gAXKDT4AltQDmAbl79BoAG4BDADZ4UAfkkAKaXPmgAPqGpJMAIwKXrSbdqc0AJrABmc2B4BKAG0AXWU+MABfcO8aAGNwGXRqUG90dFIWI018eUlkNCxcAmISFlCAzl41fFhwJHwUnKVeSN445LRQWpQARnY09CMOYTFJAHJNFA9xyNApxFQMHDxCIlMFUJYA9s7wbtgUACYB9KMg6sEOCFEJUAAiKY970DmFguXitY35FgAaS4Ca6jO6Paa9F5vFCLQorEpEGz2AhbAE8EKVfiMfDJcxQOAAOms6H2sHUsCaVGoSRSPyciIc+FCqXQ+CkWHgtSmyV21C6PQAzKchhxIjseLwJeKpbFqAlqaA7DlSKBbuSPNDNNRIFtsrlJNcggBpUByUC0WCQdDeUAkEL5JZFValI0hNiiqo8Gp1BpNXLhNo8Dq8-Y9AAs7EV+GGIImT1m82hH0d8J+WzFQb5hwArBGcudAZwbmMHk9IQmYZ8netwLIFP8C8DbpIwR4jmX3g64Wt6cjXaj0TzMygAGy5qMisWSyUyuXJBWaABemV1eQrybWZQC9thX1KLBi8USc8VS7Iquo6vmWp1zX1oCNJpS5st1tt28r8JILrdW8LD9Nz5Wjado2i6ry8DOR4pCeK7vuukBOEmXbauiHpevUjTzH6rSDiGhwAOy5gu0ZNqAkzTPGHY7lWqauumewHCgAAcRH5p6VxFqCpavOWSG7tWta-KiaiNsWLZtjxVEft2tgMiivADoGDE9AAnKxE6Sni8B8VWZCUDQ9BMKw7DcOxQikT84RqFouiHIYoAmDWZh0rJjhWDYrjuBePh+IEoRWYIwhoJIJCtOEEGHvKQXgKQfygAASlkt5-saAEWkBb5rshRCJa8lSmehPpYeYCzxThSnBox7DRWxImcc23FQll-E-PWZmFjGJbTBJTU6fCPaMn2CkBEAA
// https://www.typescriptlang.org/play/?#code/GYVwdgxgLglg9mABFApgZygCgIYCcDmAXIhrjGPgJTGnn4DcAsAFCiSwLLpZ5GJggAtgCMUuavyGjcTVuGjwkqDDgI0oZCogA+kkWMqIA3i0RnEMYIkxQAngAcUcK70QBeD4gDktCl8MmzObBiLz0iAD0EaEEFmgkGnSmIWa4KFAguEheAI4A7iheyWYAvogoADZoKMbFIWGR0a4w8QL6uHXBaRlZiACMAEwAzHUlLGPMLGwKnMpQA6p8vlTqmgxT8hxK3Au8xG3SEgdistNbXBi7aglrOnqHxLkFXneDQ7VB5pbWdo7OMfh3J4fIk-AFOuYGlEAXEbklPiluplsvlCqNylUaoEUmYoU1Yi17mIIal0sj+sNRuMWBt2IoLlAhotVnQJMtTpt6XMmXsieJ9lITrSZtsMDzrss7sd+XCtLppR9gt8bA4nC5Yh43N5lv5FTi8TDCcsSYgkb0nmiEYgypVqnqUgbmq1BR0rV0yb03lTmCUgA
// https://www.typescriptlang.org/play/?target=7#code/C4TwDgpgBAwgrgZ2AewLYEU4QE4gDwAqUAvFHAHYDW5yA7uQHwlQDeAsAFBTdTAQAewAFxQk2AJbkA5gG5OPKADcAhgBssCAPwiAFGMlSoAHyjk4qAEY5jpuKtU2KAEwgAzSRCcBKANoBdOQ4AX0CBMGRsYChlBBByAGMoVwp44HFkcigARyxcHXjEFAxckBF4JDRMHBAvEQAFbDRxBAg8ZXIQJnYuHmwIYDhsTIByGKdhziDOMIiomLjE5IS0jN5sdoRlVPTyPTgLHJxxCAQywsqS-1qoBqaWto7-fy75Xv7BzP9Jzk541RiEFAAPpVXAAIWUwHiAAscIRmM9WK9uGBGnxUp5srljqdYOditU8BRqHRGP4EQEfj1uPEMmI4KkIjpDrgAMrIQbxCBnCoE3A2cpFUEgckmEElCFQ2HYLxI6kKKB9AZDXjQ5oAOgskJhzJK7M50Bi0Q6sqN4uqkphcIIDGRUCmHDtWqleAAqgwdHaFCyQPrsFyeUKSm7bfLrubwdrpfCBHxyE5Ae0RX4oJooD51ZmCAAaKCulMiHw5vN+BiBBTOmFuqCxiDxxOPUu66p+gNyhU8HwAaSgkiglAgIGQrhLgYuhNd3dL5Z4QXDwst0a9PCItfrxuTy47addNcEdYTG6+8o72-TmfVxYv+a3p+4hYvxZvJ9PIl3a8PSePd7PRdz178W8O0LJ9APlMsnSjENPRfbgfVbblgQXKM4XdO15wlFDsBjfd1y-FM0wzLNc3zKAQJI6dIKlGC73gjl-UQwVx35EwmL5ZMbAjEBFxwdCRC4njsOJGh6BeWCkhSFZMmaZCpRwHRgDVaQx3YgV8WFUUkMwuSZRERSDF7QEBKw9sf24JUPixFt6K5XtyCQdouWHLSLSw28HVvcQRx0ABBbB1hAdVmj8gLmzZGyIC8WVujMuC9Qi9VXAiABRLZoR0fJ1JKWViDE2KFX0hB1RZHF1TARB0oKXlhS8GczLnOqFSCGtVBaXtvJk7SrWwMLfQiqLTLMuiDWK7ETkSlK0oyqqg2qHK8vynhCtGo5xvKhBKqyubGrvBr3JatqYti5aSrWireoQ2r3KpO8LJVQroiM2TuqJKgRMYRqPPleYEj3CACj4GA6X+uA0kUCBVBAHRotvWl7KiPoEDsYBAVIfwdp4JLsCgfI6SiGbmJAKBnJOsaEBh8SFER5GivW9LlFoZRxCiH1Muq7KrvEh1bveFVqdUFHHqgAhPpungfsSAQQb4ABJcg6mUdZ7Ah6HBoVO7MluVBmggdU1FUVl+mAVRPBo461SK06itQZQwGmrbcHmqy8gJ9iotvU1ARFu0voUCW-oBiA5YIdZ7K2KTVaOjsNZxhmmaiYBQ82bYMgUi2VokE4BqNb35V98XYl+qXA8j28Y+W4vQaD8gQ42cOdmh0XgipSQ+GwVwtmgZ7pSB+HsAZFBsaj0wIFoKBCA9YaGJU4UJ4w1ydLwItSztchR-H1dcM-RtJ-ig0RGHhRuzs-tB2cgg-Bn4MCCnCC8-nyNF5tVf14ni6Iv47vrQYB-uKwifvgcBmJEKAcMkBQC-tgEQkDe70kZNjUgxkdKBCpGAqIlZpQAEZmBrzHpAnQLA+CCBEKMBA4xmpGjYrPfQ0gf6BDQYqE42DSAYJwJg9Ulc+CN1+HjKArDsAACYcHr3wT4QhsYSFjGGBQwEVDgw0KkAwXM4jiFQFIeQoWcjCRmEsDgBgfhOYMMRkIlhWEBEcP4NLCA3COAMP4QAZmEXgrq0odC4IgS4+SYiiHCDUVImReJ2baPMFYbASjWA+MkWQ6RmiHb4AUc8AxhjeGI0caYnS9iLFWMbkAA

type ExtractParameterFromCustomQuery<T> =
    T extends CustomQuery<infer U> ? U : never;
type TransactionResponse<U extends any[] | readonly any[]> = [
    ...{
        [K in keyof U]: ExtractParameterFromCustomQuery<U[K]>;
    },
];

export async function querySingle<T>(customQuery: CustomQuery<T>) {
    return (await pool.query(customQuery.text, customQuery.values)).rows as T;
}
export async function transactionOld<
    T extends CustomQuery[] | readonly CustomQuery[],
>(customQueries: T): Promise<TransactionResponse<T>> {
    if (customQueries.length === 0) {
        return [] as unknown as TransactionResponse<T>;
    }
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const results = [];
        for (const query of customQueries) {
            results.push((await client.query(query.text, query.values)).rows);
        }
        await client.query("COMMIT");
        return results as unknown as TransactionResponse<T>;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function transaction<T>(
    txFunc: (sqlClient: SqlClient) => Promise<T>
): Promise<T> {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const result = await txFunc(client);
        await client.query("COMMIT");
        return result;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}
export async function query<T>(
    queryFunc: (sqlClient: SqlClient) => Promise<T>
): Promise<T> {
    const client = await getSqlClient();
    const result = await queryFunc(client);
    client.release();
    return result;
}

// TODO: Если транзакция не нужна, то не нужно держать один клиент всё время открытым

export async function getSqlClient(): Promise<SqlClient> {
    const client = await pool.connect();
    return {
        async query<T>(customQuery: CustomQuery<T>) {
            return (await client.query(customQuery.text, customQuery.values))
                .rows as T;
        },
        release() {
            client.release();
        },
    };
}
