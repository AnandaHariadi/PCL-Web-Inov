import { IMPACT_FACTORS } from "@/config/impact-factors";
import { SUPPORTING_ECOPOINT_SOURCES } from "@/config/eco-points";

export interface HouseholdProfile {
  members: number;
  daya: 450 | 900 | 1300 | 2200 | 3500 | 4400 | 5500;
  type: "apartment" | "rumah_kecil" | "rumah_sedang" | "rumah_besar";
}

/**
 * ILLUSTRATIVE reference benchmark (kWh / month) by household size and PLN
 * power class. These values were set by the team for the prototype and are
 * NOT official statistics; replace with published PLN/BPS consumption data
 * before drawing conclusions.
 */
export const BENCHMARK_DATA: Record<string, number> = {
  "1_450": 50,
  "1_900": 80,
  "2_900": 110,
  "2_1300": 140,
  "3_1300": 170,
  "3_2200": 220,
  "4_1300": 200,
  "4_2200": 260,
  "4_3500": 340,
  "5_2200": 300,
  "5_3500": 400,
  default: 180,
};

/**
 * Menghitung batas acuan kWh bulanan secara dinamis dan adaptif.
 * Mendukung keluarga inti (1-4 orang), keluarga besar (5-8 orang), hingga hunian komunal (> 8-20 orang).
 */
export function getBenchmarkAverage(members: number, daya: number): number {
  const key = `${members}_${daya}`;
  if (BENCHMARK_DATA[key]) {
    return BENCHMARK_DATA[key];
  }

  // Estimasi beban dasar fasilitas hunian (kulkas bersama, penerangan utama, modem/router)
  const baseOverhead = daya <= 900 ? 40 : daya <= 1300 ? 60 : daya <= 2200 ? 80 : 120;
  // Estimasi beban variabel pemakaian per anggota keluarga (gadget, kipas/AC, penerangan kamar)
  const perPersonKwh = daya <= 900 ? 30 : daya <= 1300 ? 40 : daya <= 2200 ? 50 : 65;

  return Math.round(baseOverhead + Math.max(1, members) * perPersonKwh);
}

export interface BenchmarkResult {
  yourUsage: number;
  averageUsage: number;
  difference: number;
  percentDiff: number;
  status: "sangat_hemat" | "hemat" | "normal" | "boros" | "sangat_boros";
  statusLabel: string;
  statusColor: string;
  statusBg: string;
  co2Impact: number;
  ecoPointsEarned: number;
  message: string;
  tips: string[];
}

export function analyzePowerUsage(
  usage: number,
  profile: HouseholdProfile
): BenchmarkResult {
  const average = getBenchmarkAverage(profile.members, profile.daya);

  const diff = usage - average;
  const percentDiff = (diff / average) * 100;

  let status: BenchmarkResult["status"];
  let statusLabel: string;
  let statusColor: string;
  let statusBg: string;
  let ecoPointsEarned: number;
  let tips: string[];

  if (percentDiff <= -20) {
    status = "sangat_hemat";
    statusLabel = "Sangat Hemat Energi";
    statusColor = "#10B981";
    statusBg = "linear-gradient(135deg,#064e3b,#065f46)";
    ecoPointsEarned = SUPPORTING_ECOPOINT_SOURCES.ELECTRICITY_VERY_EFFICIENT.amount;
    tips = [
      "Luar biasa! Keluarga Anda menjadi panutan efisiensi energi di lingkungan sekitar.",
      "Bagikan tips hemat energi Anda di Dinding Kolaborasi Komunitas PACUL.",
      "Pertahankan kebiasaan baik ini; konsistensi penghematan listrik memberi dampak nyata setiap bulan.",
    ];
  } else if (percentDiff <= -5) {
    status = "hemat";
    statusLabel = "Di Bawah Acuan, Hemat Energi";
    statusColor = "#7AC74F";
    statusBg = "linear-gradient(135deg,#14532d,#166534)";
    ecoPointsEarned = SUPPORTING_ECOPOINT_SOURCES.ELECTRICITY_EFFICIENT.amount;
    tips = [
      "Pertahankan pola penggunaan perangkat listrik hemat energi Anda.",
      "Coba optimalkan penghematan tambahan 10% untuk periode tagihan berikutnya.",
      "Matikan saklar lampu dan peralatan listrik di ruangan yang sedang kosong.",
    ];
  } else if (percentDiff <= 10) {
    status = "normal";
    statusLabel = "Sesuai Rata-Rata Acuan";
    statusColor = "#F59E0B";
    statusBg = "linear-gradient(135deg,#78350f,#92400e)";
    ecoPointsEarned = 0;
    tips = [
      "Konsumsi listrik Anda berada di kisaran rata-rata acuan rumah tangga sejenis.",
      "Gunakan pendingin ruangan (AC) secara bijak pada suhu 24–26 °C dengan fitur timer.",
      "Ganti sisa lampu konvensional dengan lampu LED hemat energi untuk efisiensi lebih tinggi.",
    ];
  } else if (percentDiff <= 30) {
    status = "boros";
    statusLabel = "Di Atas Acuan, Perlu Ditingkatkan";
    statusColor = "#F97316";
    statusBg = "linear-gradient(135deg,#7c2d12,#9a3412)";
    ecoPointsEarned = 0;
    tips = [
      "Periksa perangkat elektronik yang menyala terus-menerus dalam mode siaga (standby).",
      "Beban pendingin ruangan (AC) biasanya paling dominan, pastikan pintu & jendela tertutup rapat saat AC menyala.",
      "Gunakan pengatur waktu (timer) pada pompa air dan pemanas air dispenser.",
    ];
  } else {
    status = "sangat_boros";
    statusLabel = "Jauh Di Atas Acuan (Boros)";
    statusColor = "#EF4444";
    statusBg = "linear-gradient(135deg,#7f1d1d,#991b1b)";
    ecoPointsEarned = 0;
    tips = [
      "Evaluasi peralatan elektronik dengan durasi pengoperasian paling panjang setiap hari.",
      "Pertimbangkan peremajaan kulkas atau AC lama ke model inverter hemat energi bintang 5.",
      "Lakukan pengecekan instalasi kabel listrik rumah untuk mendeteksi kemungkinan arus bocor.",
    ];
  }

  const co2Impact = Math.round(diff * IMPACT_FACTORS.gridElectricity.value * 100) / 100;
  const absPct = Math.abs(percentDiff).toFixed(1);

  return {
    yourUsage: usage,
    averageUsage: average,
    difference: Math.round(diff),
    percentDiff: Math.round(percentDiff * 10) / 10,
    status,
    statusLabel,
    statusColor,
    statusBg,
    co2Impact,
    ecoPointsEarned,
    message:
      diff < 0
        ? `Pemakaian Anda ${Math.abs(Math.round(diff))} kWh (${absPct}%) lebih hemat daripada rata-rata acuan.`
        : `Pemakaian Anda ${Math.round(diff)} kWh (${absPct}%) lebih tinggi daripada rata-rata acuan.`,
    tips,
  };
}
