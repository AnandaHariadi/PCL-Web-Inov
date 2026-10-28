import type { Metadata } from "next";
import TrackerPageClient from "./TrackerPageClient";

export const metadata: Metadata = {
  title: "Pelacak Jejak Karbon & Emisi Lingkungan | PACUL Surabaya",
  description: "Pantau estimasi jejak karbon pribadi dari transportasi, konsumsi energi, pengelolaan sampah, serta efisiensi struk listrik PLN secara terintegrasi.",
};

export default function TrackerPage() {
  return <TrackerPageClient />;
}
