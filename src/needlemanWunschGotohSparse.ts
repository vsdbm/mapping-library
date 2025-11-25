import { Matrix } from "sparse-matrix";

interface Traceback {
	alignedSeq1: string;
	alignedSeq2: string;
	map_init: number;
	map_end: number;
	coverage_pct: number;
}

export function needlemanWunschGotoh(
	referenceSequence: string,
	sequenceToAlign: string,
	gapOpenPenalty = 5,
	gapExtendPenalty = 2,
	mismatchPenalty = -3,
	matchScore = 2
): Traceback {
	if (referenceSequence.length === 0) throw new Error("Empty reference sequence");
	if (sequenceToAlign.length === 0) throw new Error("Empty query sequence");
	const numRows = referenceSequence.length + 1;
	const numCols = sequenceToAlign.length + 1;

	// Create the sparse matrix
	const matrix = Matrix.empty(numRows, numCols);

	// Initialize the first row and column
	for (let i = 0; i < numRows; i++) {
		matrix.set(i, 0, i * gapExtendPenalty);
	}
	for (let j = 0; j < numCols; j++) {
		matrix.set(0, j, j * gapExtendPenalty);
	}

	// Fill in the rest of the matrix
	for (let i = 1; i < numRows; i++) {
		for (let j = 1; j < numCols; j++) {
			const match = referenceSequence[i - 1] === sequenceToAlign[j - 1] ? matchScore : mismatchPenalty;
			const diagScore = matrix.get(i - 1, j - 1) + match;
			const upScore = matrix.get(i - 1, j) + gapOpenPenalty + gapExtendPenalty;
			const leftScore = matrix.get(i, j - 1) + gapOpenPenalty + gapExtendPenalty;
			const maxScore = Math.max(diagScore, upScore, leftScore);

			// Set the value in the matrix
			matrix.set(i, j, maxScore);
		}
	}

	// Backtrack to find aligned sequences
	let i = referenceSequence.length;
	let j = sequenceToAlign.length;
	let alignedSeq1 = "";
	let alignedSeq2 = "";
	let numMatches = 0;
	let numMismatches = 0;
	let numGaps = 0;
	let currentScore = matrix.get(i, j);

	while (i > 0 && j > 0) {
		const diagScore = matrix.get(i - 1, j - 1);
		const upScore = matrix.get(i - 1, j);
		const leftScore = matrix.get(i, j - 1);
		if (
			currentScore ===
			diagScore + (referenceSequence[i - 1] === sequenceToAlign[j - 1] ? matchScore : mismatchPenalty)
		) {
			alignedSeq1 = referenceSequence[i - 1] + alignedSeq1;
			alignedSeq2 = sequenceToAlign[j - 1] + alignedSeq2;
			numMatches += referenceSequence[i - 1] === sequenceToAlign[j - 1] ? 1 : 0;
			numMismatches += referenceSequence[i - 1] !== sequenceToAlign[j - 1] ? 1 : 0;
			i--;
			j--;
			currentScore = diagScore;
		} else if (currentScore === upScore + gapOpenPenalty + gapExtendPenalty) {
			alignedSeq1 = referenceSequence[i - 1] + alignedSeq1;
			alignedSeq2 = "-" + alignedSeq2;
			numGaps++;
			i--;
			currentScore = upScore;
		} else {
			alignedSeq1 = "-" + alignedSeq1;
			alignedSeq2 = sequenceToAlign[j - 1] + alignedSeq2;
			numGaps++;
			j--;
			currentScore = leftScore;
		}
	}

	return {
		alignedSeq1,
		alignedSeq2,
		map_init: i + 1,
		map_end: j + 1,
		coverage_pct: numMatches / (numMatches + numMismatches + numGaps),
	};
}

export default needlemanWunschGotoh;
