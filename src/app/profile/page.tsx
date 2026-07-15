import type { Metadata } from "next";
import { ProfileClient } from "@/components/ProfileClient";

export const metadata: Metadata = {
  title: "프로필",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
