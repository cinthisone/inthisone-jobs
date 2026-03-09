"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import OnboardingModal from "./OnboardingModal";

interface AppShellProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
  children: React.ReactNode;
}

const ONBOARDING_SEEN_KEY = "onboarding_seen";
const RESUME_TOOLTIP_DISMISSED_KEY = "resume_tooltip_dismissed";

export default function AppShell({ user, children }: AppShellProps) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showResumeTooltip, setShowResumeTooltip] = useState(false);

  useEffect(() => {
    // Check if user has seen the onboarding
    const hasSeenOnboarding = localStorage.getItem(ONBOARDING_SEEN_KEY);
    const hasResumeTooltipDismissed = localStorage.getItem(RESUME_TOOLTIP_DISMISSED_KEY);

    if (!hasSeenOnboarding) {
      setIsFirstVisit(true);
      setShowOnboarding(true);
    } else if (!hasResumeTooltipDismissed) {
      // If onboarding was seen but tooltip wasn't dismissed, show tooltip
      setShowResumeTooltip(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    if (isFirstVisit) {
      localStorage.setItem(ONBOARDING_SEEN_KEY, "true");
      setIsFirstVisit(false);
      // Show the resume tooltip after closing onboarding for the first time
      const hasResumeTooltipDismissed = localStorage.getItem(RESUME_TOOLTIP_DISMISSED_KEY);
      if (!hasResumeTooltipDismissed) {
        setShowResumeTooltip(true);
      }
    }
  };

  const handleOpenOnboarding = () => {
    setShowOnboarding(true);
  };

  const handleDismissResumeTooltip = () => {
    setShowResumeTooltip(false);
    localStorage.setItem(RESUME_TOOLTIP_DISMISSED_KEY, "true");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        user={user}
        onHelpClick={handleOpenOnboarding}
        showResumeTooltip={showResumeTooltip}
        onDismissResumeTooltip={handleDismissResumeTooltip}
      />
      <main className="w-full max-w-[1600px] mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />
    </div>
  );
}
