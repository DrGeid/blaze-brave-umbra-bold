//#region node_modules/.nitro/vite/services/ssr/assets/format-mN0Orl5G.js
var MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
];
var WEEKDAYS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];
var WEEKDAYS_SHORT = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
];
function parseIsoDate(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	return new Date(y, m - 1, d);
}
function formatLongDate(iso) {
	const d = parseIsoDate(iso);
	return `${WEEKDAYS[d.getDay()]} ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}
function formatShortDate(iso) {
	const d = parseIsoDate(iso);
	return `${WEEKDAYS_SHORT[d.getDay()]} ${d.getDate()}`;
}
function formatMonthDay(iso) {
	const d = parseIsoDate(iso);
	return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}
function bandLabel(band) {
	switch (band) {
		case "quiet": return "Quiet";
		case "watch": return "Watch";
		case "elevated": return "Elevated";
		case "high": return "High";
		case "peak": return "Peak";
	}
}
//#endregion
export { formatShortDate as i, formatLongDate as n, formatMonthDay as r, bandLabel as t };
