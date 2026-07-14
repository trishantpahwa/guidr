"use client";

import { TourProvider } from "guidr";
import "guidr/styles.css";
import { Dashboard } from "./dashboard";

const steps = [
  {
    title: "Welcome to Acme 👋",
    content: "Let's take a 30 second look around your new dashboard.",
  },
  {
    target: "#nav-projects",
    title: "Your projects",
    content: "All your projects live here. Click into one to see deploys, logs, and analytics.",
    placement: "right" as const,
  },
  {
    target: "#create-project-btn",
    title: "Create a project",
    content: "Click here any time to spin up a new project from a template or a git repo.",
    placement: "bottom" as const,
  },
  {
    target: "#usage-card",
    title: "Usage at a glance",
    content: "Keep an eye on your monthly usage before you hit a plan limit.",
    placement: "top" as const,
  },
  {
    target: "#nav-settings",
    content: "Manage billing, teammates, and integrations from Settings.",
    placement: "right" as const,
    disableInteraction: true,
  },
];

export default function Home() {
  return (
    <TourProvider
      steps={steps}
      onStart={() => console.log("[guidr] tour started")}
      onComplete={() => console.log("[guidr] tour complete")}
      onExit={(reason) => console.log("[guidr] tour exited:", reason)}
    >
      <Dashboard />
    </TourProvider>
  );
}
