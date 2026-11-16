import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { sitemapStaticPaths, sitemapXML } from "./sitemap";

describe("Public sitemap", () => {
  it("includes only the three public pages, not administration or the sitemap itself", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(sitemapStaticPaths(router)).toEqual(["/", "/contact", "/projets"]);
  });

  it("uses the public domain without fabricated modification dates", () => {
    const xml = sitemapXML("https://blondeljardin.com", [{ path: "/" }, { path: "/contact" }, { path: "/projets" }]);
    expect(xml).toContain("<loc>https://blondeljardin.com/projets</loc>");
    expect(xml).not.toContain("<lastmod>");
  });

  it("rejects external destinations", () => {
    expect(() => sitemapXML("https://blondeljardin.com", [{ path: "//other.example" }])).toThrow("Invalid sitemap path");
  });
});