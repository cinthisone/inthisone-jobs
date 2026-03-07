import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();

  if (session.isLoggedIn) {
    redirect("/dashboard");
  }

  redirect("/login");
}
