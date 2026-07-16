import type { Metadata } from "next";
import { WishlistClient } from "./WishlistClient";

export const metadata: Metadata = {
  title: "위시리스트",
};

export default function WishlistPage() {
  return <WishlistClient />;
}
