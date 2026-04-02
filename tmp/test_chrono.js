import * as chrono from 'chrono-node';

const test = (text) => {
    const results = chrono.parse(text);
    console.log(`--- ${text} ---`);
    results.forEach(r => {
        console.log(`Text: ${r.text}`);
        console.log(`Start: ${r.start.date()}`);
        console.log(`End: ${r.end ? r.end.date() : 'N/A'}`);
        console.log(`Certain: ${JSON.stringify(r.start.getCertainComponents())}`);
    });
};

test("last week");
test("this month");
test("yesterday");
test("March");
