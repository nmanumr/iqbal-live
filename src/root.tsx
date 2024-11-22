import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { ReactNode } from "react";

import "./index.css";

export function Layout({ children }: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <link rel="icon" type="image/svg+xml" href="/vite.svg" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Vite + React + TS</title>
      <Meta />
      <Links />
    </head>
    <body>
    {children}
    <ScrollRestoration />
    <Scripts />
    </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}