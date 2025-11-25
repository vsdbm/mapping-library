import { needlemanWunschGotoh } from ".";
import * as fs from "fs";
import * as path from "path";

const { refSeq, query, refSeqMycobacterium, queryMycobacterium } = JSON.parse(
	fs.readFileSync(path.resolve(__dirname, "mock-mycobacterium.json"), "utf-8")
);

describe.skip("Suite test for neo Needleman and Gotoh - virus", () => {
	let scoreTest = 0;
	test("should work", () => {
		const map = needlemanWunschGotoh(refSeq, query);
		expect(map).not.toBeUndefined();
		expect(map).not.toBeNull();
		expect(map).toHaveProperty("map_init");
		expect(map).toHaveProperty("map_end");
		expect(map).toHaveProperty("coverage_pct");
		scoreTest = map.coverage_pct;
	});

	test("Should have a low percentage score for the fragment", () => {
		const map = needlemanWunschGotoh(refSeq, query);
		// scoreTest = map.coverage_pct;
		expect(map.coverage_pct).not.toBeUndefined();
		expect(map.coverage_pct).not.toBeNull();
		expect(typeof map.coverage_pct).toBe("number");
		expect(map.coverage_pct).toBeLessThanOrEqual(10);
	});
	test("Should return the same score if the sequences were inverted", () => {
		const map = needlemanWunschGotoh(query, refSeq);
		expect(map.coverage_pct).not.toBeUndefined();
		expect(map.coverage_pct).not.toBeNull();
		expect(typeof map.coverage_pct).toBe("number");
		expect(map.coverage_pct).toBeLessThanOrEqual(10);
		expect(map.coverage_pct).toBe(scoreTest);
	});
	test("Should throw an error if reference sequence is incorrect", () => {
		try {
			needlemanWunschGotoh("", query);
			expect(true).toBeFalsy();
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toBe("Empty reference sequence");
		}
	});
	test("Should throw an error if query sequence is incorrect", () => {
		try {
			needlemanWunschGotoh(refSeq, "");
			expect(true).toBeFalsy();
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toBe("Empty query sequence");
		}
	});
});

describe("Suite test for neo Needleman and Gotoh - bacteria", () => {
	test("Should handle bacteria sequences - 5 times virus sequence size", () => {
		console.time("Mapeamento bacteria");
		const map = needlemanWunschGotoh(refSeq.repeat(5), query.repeat(5));
		console.timeEnd("Mapeamento bacteria");
		expect(map.coverage_pct).not.toBeUndefined();
		expect(map.coverage_pct).not.toBeNull();
		expect(typeof map.coverage_pct).toBe("number");
		expect(map.coverage_pct).toBeLessThanOrEqual(10);
	});
	// test("Should handle mycobacterium sequences", () => {
	// 	console.time("Mapeamento mycobacterium");
	// 	const map = needlemanWunschGotoh(refSeqMycobacterium, queryMycobacterium);
	// 	console.timeEnd("Mapeamento mycobacterium");
	// 	expect(map.coverage_pct).not.toBeUndefined();
	// 	expect(map.coverage_pct).not.toBeNull();
	// 	expect(typeof map.coverage_pct).toBe("number");
	// 	expect(map.coverage_pct).toBeGreaterThan(0);
	// 	console.log({ coverage: map.coverage_pct });
	// });
});
