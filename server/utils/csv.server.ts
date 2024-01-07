import * as csv from "csv";
import * as fs from "fs";

export function write(records: Record<PropertyKey, any>[], target: string) {
    const targetExists = fs.existsSync(target);

    const stringifier = csv
        .stringify({
            delimiter: ",",
            bom: true,
            header: !targetExists,
        })
        .on("readable", (chunk: string) => {
            let row;
            while ((row = stringifier.read()) !== null) {
                fs.writeFileSync(target, row, {
                    flag: "a",
                });
            }
        })
        .on("finish", () => {
            stringifier.end();
        });

    for (const record of records) {
        stringifier.write(record);
    }
}

export function read(target: string) {
    const data: any[] = [];

    const parser = csv
        .parse({
            delimiter: ",",
            bom: true,
            columns: true,
        })
        .on("readable", (chunk: Record<PropertyKey, any>) => {
            let row;
            while ((row = parser.read()) !== null) {
                data.push(row);
            }
        })
        .on("finish", () => {
            parser.end();
            readingStream.end();
        });

    const readingStream = fs.createReadStream(__dirname + target).pipe(parser);
}
