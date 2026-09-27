import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { JournalAccountScope } from "@/components/journal-account-scope";
import { getAccountAccess } from "@/lib/clinic-access";
import appCss from "../styles.css?url";

const APP_NAME = "Halo";
const host = import.meta.env.VITE_PUBLIC_HOSTNAME;
const ogImage = host ? `https://${host}/og.jpg` : undefined;

export const Route = createRootRoute({
  beforeLoad: async () => ({ accountAccess: await getAccountAccess() }),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Halo · Halton head-weather" },
      {
        name: "description",
        content:
          "Daily migraine-opportunity forecast for Oakville and Burlington: pressure, humidity, fronts, geomagnetic field, moon, and more.",
      },
      { name: "apple-mobile-web-app-title", content: APP_NAME },
      { name: "theme-color", content: "#f1ece4" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Halo · Halton head-weather" },
      { property: "og:type", content: "website" },
      ...(ogImage
        ? [
            { property: "og:image", content: ogImage },
            { property: "og:image:width", content: "1200" },
            { property: "og:image:height", content: "630" },
          ]
        : []),
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: Root,
});

function Root() {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <JournalAccountScope>
            <Outlet />
          </JournalAccountScope>
        </AuthProvider>
        <Toaster
          position="bottom-center"
          toastOptions={{
            className:
              "font-sans !bg-surface !text-fg !border-border shadow-[var(--shadow-border)]",
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}
