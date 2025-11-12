import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container px-4 py-16 text-center">
        <h1 className="mb-6 text-4xl font-bold text-neutral-900 md:text-6xl">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            FlowForge
          </span>
        </h1>
        <p className="mb-8 text-xl text-neutral-600 md:text-2xl">
          Forge Better Software, Together
        </p>
        <p className="mb-12 text-lg text-neutral-500">
          AI-powered development platform for teams
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/design"
            className="rounded-lg bg-primary-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
          >
            View Design System
          </Link>
          <Link
            href="/chat"
            className="rounded-lg border-2 border-primary-600 px-8 py-3 font-semibold text-primary-600 transition-colors hover:bg-primary-50"
          >
            Try Chat Demo
          </Link>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 text-4xl">🤖</div>
            <h3 className="mb-2 text-lg font-semibold text-neutral-900">
              Specialized Agents
            </h3>
            <p className="text-sm text-neutral-600">
              PM, Architect, Developer, and more agents to guide your workflow
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 text-4xl">🔄</div>
            <h3 className="mb-2 text-lg font-semibold text-neutral-900">
              Guided Workflows
            </h3>
            <p className="text-sm text-neutral-600">
              Structured processes across 4 phases from analysis to implementation
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 text-4xl">👥</div>
            <h3 className="mb-2 text-lg font-semibold text-neutral-900">
              Team Collaboration
            </h3>
            <p className="text-sm text-neutral-600">
              Real-time collaboration with shared projects and artifacts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
