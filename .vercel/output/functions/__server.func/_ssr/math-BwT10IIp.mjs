//#region node_modules/.nitro/vite/services/ssr/assets/math-BwT10IIp.js
function clamp(n, a, b) {
	return Math.max(a, Math.min(b, n));
}
function round1(n) {
	return Math.round(n * 10) / 10;
}
function round0(n) {
	return Math.round(n);
}
/** Piecewise linear interpolation, then clamp 0–100. */
function scoreLine(value, points) {
	if (points.length === 0) return 0;
	if (value <= points[0][0]) return clamp(points[0][1], 0, 100);
	for (let i = 1; i < points.length; i++) {
		const [x0, y0] = points[i - 1];
		const [x1, y1] = points[i];
		if (value <= x1) return clamp(y0 + (x1 === x0 ? 0 : (value - x0) / (x1 - x0)) * (y1 - y0), 0, 100);
	}
	return clamp(points[points.length - 1][1], 0, 100);
}
function mean(values) {
	const xs = values.filter((v) => typeof v === "number" && Number.isFinite(v));
	if (xs.length === 0) return null;
	return xs.reduce((a, b) => a + b, 0) / xs.length;
}
function maxNum(values) {
	const xs = values.filter((v) => typeof v === "number" && Number.isFinite(v));
	if (xs.length === 0) return null;
	return Math.max(...xs);
}
function minNum(values) {
	const xs = values.filter((v) => typeof v === "number" && Number.isFinite(v));
	if (xs.length === 0) return null;
	return Math.min(...xs);
}
function sum(values) {
	return values.reduce((a, b) => a + (typeof b === "number" && Number.isFinite(b) ? b : 0), 0);
}
function circularDist(phase, target) {
	const d = Math.abs(phase - target);
	return Math.min(d, 1 - d);
}
//#endregion
export { minNum as a, scoreLine as c, mean as i, sum as l, clamp as n, round0 as o, maxNum as r, round1 as s, circularDist as t };
