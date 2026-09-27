//#region node_modules/.nitro/vite/services/ssr/assets/types-C-WbLUyQ.js
var HALTON = {
	name: "Halton",
	region: "Oakville & Burlington, Ontario",
	lat: 43.3965,
	lon: -79.7434,
	timezone: "America/Toronto"
};
var LOAD_MAX = 1700;
var FACTOR_META = {
	pressure_drop: {
		id: "pressure_drop",
		label: "Pressure drop",
		short: "Falling air pressure",
		evidence: "strong",
		unit: "hPa / 24h"
	},
	low_pressure: {
		id: "low_pressure",
		label: "Low pressure",
		short: "Absolute sea-level pressure",
		evidence: "strong",
		unit: "hPa"
	},
	humidity: {
		id: "humidity",
		label: "Humidity",
		short: "Moisture in the air",
		evidence: "mixed",
		unit: "%"
	},
	rain: {
		id: "rain",
		label: "Rain & storms",
		short: "Precipitation and thunder",
		evidence: "mixed",
		unit: "mm"
	},
	temp_swing: {
		id: "temp_swing",
		label: "Temperature swing",
		short: "Day range and day-to-day change",
		evidence: "mixed",
		unit: "°C"
	},
	wind_front: {
		id: "wind_front",
		label: "Wind & fronts",
		short: "Gusts and incoming fronts",
		evidence: "mixed",
		unit: "km/h"
	},
	extremes: {
		id: "extremes",
		label: "Heat or cold",
		short: "Halton temperature extremes",
		evidence: "mixed",
		unit: "°C"
	},
	glare: {
		id: "glare",
		label: "Light & glare",
		short: "Bright sky, snow glare, photophobia",
		evidence: "mixed",
		unit: "cloud %"
	},
	pm25: {
		id: "pm25",
		label: "Wildfire / PM2.5",
		short: "Fine particles and smoke",
		evidence: "strong",
		unit: "µg/m³"
	},
	air_pollution: {
		id: "air_pollution",
		label: "NO₂ & ozone",
		short: "Traffic and photochemical smog",
		evidence: "mixed",
		unit: "µg/m³"
	},
	pollen: {
		id: "pollen",
		label: "Pollen",
		short: "Tree, grass, and ragweed load",
		evidence: "mixed",
		unit: "index"
	},
	geomagnetic: {
		id: "geomagnetic",
		label: "Geomagnetic field",
		short: "Planetary Kp index",
		evidence: "mixed",
		unit: "Kp"
	},
	solar_flare: {
		id: "solar_flare",
		label: "Solar flare",
		short: "GOES X-ray class and R-scale",
		evidence: "anecdotal",
		unit: "class"
	},
	spring_tide: {
		id: "spring_tide",
		label: "Spring tide",
		short: "Luni-solar gravity alignment",
		evidence: "mixed",
		unit: "syzygy"
	},
	moon: {
		id: "moon",
		label: "Moon cycle",
		short: "New and full moon proximity",
		evidence: "mixed",
		unit: "phase"
	},
	eclipse: {
		id: "eclipse",
		label: "Eclipse",
		short: "Solar/lunar eclipse window",
		evidence: "anecdotal",
		unit: "days"
	},
	mercury: {
		id: "mercury",
		label: "Mercury retrograde",
		short: "Apparent retrograde of Mercury",
		evidence: "anecdotal",
		unit: ""
	}
};
var EVIDENCE_COPY = {
	strong: "Stronger clinical signal",
	mixed: "Mixed / individual",
	anecdotal: "Anecdotal · low weight"
};
var PHENOTYPE_META = {
	temple: {
		label: "Temple squeeze",
		feel: "Pressure or clamping at the temples, sinus-like fullness",
		detail: "Weighted toward falling and low barometric pressure, humid air, and pollen — the pattern patients often call a vice at the temples."
	},
	ocular: {
		label: "Ocular strain",
		feel: "Pressure behind or around the eyes, glare, visual effort",
		detail: "Weighted toward glare (including snow), humidity, pollen, smoke, and pressure change. Eclipse windows stay a low anecdotal term."
	},
	occipital: {
		label: "Occipital tension",
		feel: "Tightness at the base of the skull and neck",
		detail: "Weighted toward wind, weather fronts, and temperature swings — more musculoskeletal than sinus-cavity."
	},
	sleep: {
		label: "Sleep disruption",
		feel: "Shallower or broken sleep that can lower the next-day migraine threshold",
		detail: "Weighted toward heat, humidity, storms, wind, smoke, and pollen — the night-time load. Poor sleep is treated as a fourth score because it is a common pathway into an attack."
	}
};
/** Relative weights. Weather and air dominate; sky factors stay small until a journal learns otherwise. */
var BASE_WEIGHTS = {
	temple: {
		pressure_drop: 1.45,
		low_pressure: 1.35,
		humidity: 1.15,
		rain: .95,
		temp_swing: .65,
		wind_front: .55,
		extremes: .5,
		glare: .35,
		pm25: .85,
		air_pollution: .55,
		pollen: .72,
		geomagnetic: .34,
		solar_flare: .08,
		spring_tide: .16,
		moon: .18,
		eclipse: .12,
		mercury: .04
	},
	ocular: {
		pressure_drop: 1.15,
		low_pressure: 1.05,
		humidity: 1.25,
		rain: .55,
		temp_swing: .7,
		wind_front: .4,
		extremes: .65,
		glare: 1.4,
		pm25: .95,
		air_pollution: .7,
		pollen: 1.15,
		geomagnetic: .44,
		solar_flare: .1,
		spring_tide: .14,
		moon: .22,
		eclipse: .32,
		mercury: .04
	},
	occipital: {
		pressure_drop: 1,
		low_pressure: .75,
		humidity: .55,
		rain: .85,
		temp_swing: 1.35,
		wind_front: 1.45,
		extremes: 1.15,
		glare: .25,
		pm25: .45,
		air_pollution: .3,
		pollen: .25,
		geomagnetic: .26,
		solar_flare: .06,
		spring_tide: .1,
		moon: .12,
		eclipse: .08,
		mercury: .04
	},
	sleep: {
		pressure_drop: .55,
		low_pressure: .35,
		humidity: 1.05,
		rain: 1.25,
		temp_swing: .7,
		wind_front: 1.15,
		extremes: 1.4,
		glare: .85,
		pm25: .95,
		air_pollution: .55,
		pollen: 1.05,
		geomagnetic: .32,
		solar_flare: .1,
		spring_tide: .22,
		moon: .28,
		eclipse: .08,
		mercury: .04
	}
};
var DISCLAIMER = "Halo is an educational weather-sensitivity forecast for Halton Region. It is not a medical device, diagnosis, or treatment. Migraine has many triggers. If you have a sudden worst-ever headache, weakness, confusion, or vision loss, seek emergency care.";
var FACTOR_IDS = [
	"pressure_drop",
	"low_pressure",
	"humidity",
	"rain",
	"temp_swing",
	"wind_front",
	"extremes",
	"glare",
	"pm25",
	"air_pollution",
	"pollen",
	"geomagnetic",
	"solar_flare",
	"spring_tide",
	"moon",
	"eclipse",
	"mercury"
];
var PHENOTYPES = [
	"temple",
	"ocular",
	"occipital",
	"sleep"
];
//#endregion
export { FACTOR_META as a, PHENOTYPES as c, FACTOR_IDS as i, PHENOTYPE_META as l, DISCLAIMER as n, HALTON as o, EVIDENCE_COPY as r, LOAD_MAX as s, BASE_WEIGHTS as t };
