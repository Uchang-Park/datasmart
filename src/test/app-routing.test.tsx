import { QueryClient } from "@tanstack/react-query";
import {
  RouterContextProvider,
  createMemoryHistory,
  createRouter,
  rootRouteId,
} from "@tanstack/react-router";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { HubTabs } from "@/components/site/content";
import { routeTree } from "@/routeTree.gen";

afterEach(cleanup);

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it.each(["/about", "/engineering", "/education", "/contact", "/contact/consult", "/admin"])("matches the standalone page %s", (path) => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes(path).at(-1)?.routeId).toBe(path);
  });
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
});

function renderTabsAt(path: string) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
    context: { queryClient: new QueryClient() },
  });

  render(
    <RouterContextProvider router={router}>
      <HubTabs />
    </RouterContextProvider>,
  );

  return screen.getByRole("navigation", { name: "페이지 바로가기" });
}

describe("Site tab bar", () => {
  it("offers one tab per page and marks 홈 as the active tab on /", () => {
    const tabs = renderTabsAt("/");

    expect(within(tabs).getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual([
      "/",
      "/about",
      "/engineering",
      "/education",
      "/contact",
    ]);
    expect(within(tabs).getByRole("link", { name: "홈" })).toHaveAttribute("data-status", "active");
  });

  it("keeps 홈 inactive and the current page's tab active on a subpage", () => {
    const tabs = renderTabsAt("/about");

    expect(within(tabs).getByRole("link", { name: "회사 소개" })).toHaveAttribute("data-status", "active");
    expect(within(tabs).getByRole("link", { name: "홈" })).not.toHaveAttribute("data-status", "active");
  });
});
