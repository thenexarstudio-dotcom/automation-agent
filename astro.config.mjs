import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

// Provisional: a free Netlify subdomain, claimed when the site is first
// connected on netlify.com (no purchase needed). If "consultant-client-ops"
// is taken, Netlify will suggest an alternate at creation time — update this
// one line to match whatever you actually claimed, then redeploy.
export default defineConfig({
  site: "https://consultant-client-ops.netlify.app",
  integrations: [mdx(), preact(), sitemap(), tailwind()],
});
