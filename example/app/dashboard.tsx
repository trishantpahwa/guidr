"use client";

import { useTour } from "guidrjs";

const projects = [
  { name: "marketing-site", status: "Ready" },
  { name: "api-gateway", status: "Building" },
  { name: "docs", status: "Ready" },
];

export function Dashboard() {
  const { start } = useTour();

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900">
      <aside className="w-56 shrink-0 border-r border-zinc-200 bg-white p-4">
        <div className="mb-6 text-lg font-semibold">Acme Inc</div>
        <nav className="flex flex-col gap-1 text-sm">
          <a id="nav-projects" className="rounded-md bg-zinc-100 px-3 py-2 font-medium">
            Projects
          </a>
          <a className="rounded-md px-3 py-2 text-zinc-600 hover:bg-zinc-100">Deployments</a>
          <a className="rounded-md px-3 py-2 text-zinc-600 hover:bg-zinc-100">Analytics</a>
          <a id="nav-settings" className="rounded-md px-3 py-2 text-zinc-600 hover:bg-zinc-100">
            Settings
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Projects</h1>
          <div className="flex gap-2">
            <button
              onClick={() => start()}
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100"
            >
              Take the tour
            </button>
            <button
              id="create-project-btn"
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
            >
              New Project
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p.name} className="rounded-lg border border-zinc-200 bg-white p-4">
              <div className="font-medium">{p.name}</div>
              <div className="mt-1 text-xs text-zinc-500">{p.status}</div>
            </div>
          ))}
        </div>

        <div id="usage-card" className="max-w-sm rounded-lg border border-zinc-200 bg-white p-4">
          <div className="mb-2 text-sm font-medium">Monthly usage</div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
            <div className="h-full w-2/3 rounded-full bg-zinc-900" />
          </div>
          <div className="mt-2 text-xs text-zinc-500">67 / 100 GB</div>
        </div>
      </main>
    </div>
  );
}
