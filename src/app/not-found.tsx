import { HudButton } from "@/components/HudButton";
import { HudPanel } from "@/components/HudPanel";
import { Telemetry } from "@/components/Telemetry";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-start px-4 pt-24 sm:px-6 sm:pt-32">
      <HudPanel className="w-full p-8 sm:p-10">
        <Telemetry
          rows={[
            { key: "Signal", value: "Lost", tone: "amber" },
            { key: "Code", value: "404" },
            { key: "Cause", value: "No route at this coordinate" },
          ]}
        />
        <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">
          Signal lost.
        </h1>
        <p className="mt-4 max-w-md text-muted">
          This page was either moved, never existed, or got frozen in carbonite.
        </p>
        <div className="mt-8">
          <HudButton href="/" variant="primary">
            Return to base
          </HudButton>
        </div>
      </HudPanel>
    </div>
  );
}
