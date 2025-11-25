import epitopeMap from "./epitopeMap";
import computeGlobalAlignment from "./neoNeedlemanGotoh";
import computeLocalAlignment from "./smithWaterman";
import needlemanWunschGotoh from "./needlemanWunschGotohSparse";

export { default as epitopeMap } from "./epitopeMap";
export { default as computeLocalAlignment } from "./smithWaterman";
export { default as smithWaterman } from "./smithWaterman";
export { default as computeGlobalAlignment } from "./neoNeedlemanGotoh";
export { default as neoNeedlemanGotoh } from "./neoNeedlemanGotoh";
export { default as needlemanWunschGotoh } from "./needlemanWunschGotohSparse";

export default {
	epitopeMap,
	smithWaterman: computeLocalAlignment,
	neoNeedlemanGotoh: computeGlobalAlignment,
	computeGlobalAlignment,
	computeLocalAlignment,
	needlemanWunschGotoh,
};
