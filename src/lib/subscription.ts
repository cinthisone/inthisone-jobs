import prisma from "./prisma";

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "grace_period"
  | "expired"
  | "cancelled";

export interface SubscriptionInfo {
  status: SubscriptionStatus;
  trialEndDate: Date | null;
  gracePeriodEndDate: Date | null;
  daysRemaining: number | null;
  canWrite: boolean;
  canRead: boolean;
  showWarning: boolean;
  warningMessage: string | null;
  warningType: "info" | "warning" | "error" | null;
}

export async function getSubscriptionInfo(
  userId: string
): Promise<SubscriptionInfo> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionStatus: true,
      trialEndDate: true,
      gracePeriodEndDate: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const now = new Date();
  let status = user.subscriptionStatus as SubscriptionStatus;
  let daysRemaining: number | null = null;
  let showWarning = false;
  let warningMessage: string | null = null;
  let warningType: "info" | "warning" | "error" | null = null;
  let gracePeriodEndDate = user.gracePeriodEndDate;

  // Check trialing status
  if (status === "trialing" && user.trialEndDate) {
    const trialEnd = new Date(user.trialEndDate);
    daysRemaining = Math.ceil(
      (trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysRemaining <= 0) {
      // Trial expired, transition to grace period
      status = "grace_period";
      gracePeriodEndDate = new Date(trialEnd);
      gracePeriodEndDate.setDate(gracePeriodEndDate.getDate() + 7);

      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionStatus: "grace_period",
          gracePeriodEndDate,
        },
      });

      daysRemaining = 7;
      showWarning = true;
      warningMessage =
        "Your trial has expired. Subscribe within 7 days to keep full access.";
      warningType = "error";
    } else if (daysRemaining <= 7) {
      showWarning = true;
      warningMessage = `Your trial expires in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}. Subscribe to continue with full access.`;
      warningType = daysRemaining <= 3 ? "warning" : "info";
    }
  }

  // Check grace period status
  if (status === "grace_period" && gracePeriodEndDate) {
    const graceEnd = new Date(gracePeriodEndDate);
    daysRemaining = Math.ceil(
      (graceEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysRemaining <= 0) {
      status = "expired";
      await prisma.user.update({
        where: { id: userId },
        data: { subscriptionStatus: "expired" },
      });
      daysRemaining = 0;
    }

    showWarning = true;
    if (status === "expired") {
      warningMessage =
        "Your access has expired. Subscribe now to create and edit jobs.";
      warningType = "error";
    } else {
      warningMessage = `Grace period: ${Math.max(0, daysRemaining)} day${daysRemaining === 1 ? "" : "s"} left. Subscribe to keep full access.`;
      warningType = "error";
    }
  }

  // Expired status
  if (status === "expired") {
    showWarning = true;
    warningMessage =
      "Your subscription has expired. Subscribe to create and edit jobs.";
    warningType = "error";
    daysRemaining = 0;
  }

  return {
    status,
    trialEndDate: user.trialEndDate,
    gracePeriodEndDate,
    daysRemaining,
    canWrite: ["trialing", "active", "grace_period"].includes(status),
    canRead: true, // Always allow reading
    showWarning,
    warningMessage,
    warningType,
  };
}

export async function checkWriteAccess(userId: string): Promise<boolean> {
  const info = await getSubscriptionInfo(userId);
  return info.canWrite;
}

export async function getSubscriptionDaysRemaining(
  userId: string
): Promise<number | null> {
  const info = await getSubscriptionInfo(userId);
  return info.daysRemaining;
}
