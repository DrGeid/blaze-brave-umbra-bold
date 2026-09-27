import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { i as cn } from "./utils-DsX51Y8I.mjs";
import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-ab6HSoR0.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide", {
	variants: { tone: {
		default: "bg-surface-2 text-muted",
		strong: "bg-primary/10 text-primary",
		mixed: "bg-watch/10 text-watch",
		anecdotal: "bg-surface-2 text-faint",
		quiet: "bg-calm/12 text-calm",
		watch: "bg-watch/12 text-watch",
		elevated: "bg-watch/16 text-watch",
		high: "bg-high/12 text-high",
		peak: "bg-high/18 text-high"
	} },
	defaultVariants: { tone: "default" }
});
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({
			tone,
			className
		})),
		...props
	});
}
//#endregion
export { Badge as t };
