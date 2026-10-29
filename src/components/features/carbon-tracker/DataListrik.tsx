"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, BarChart3, ShieldCheck } from "lucide-react";
import { cn } from "@/utils/cn";
import InputListrikManual from "./InputListrikManual";
import DataBadge from "@/components/common/DataBadge";
import ScanStrukListrik from "./ScanStrukListrik";

type ListrikMode = "manual" | "scan" | "analisis";

const MODES: { id: ListrikMode; label: string }[] = [
  { id: "manual",   label: "Input Manual" },
  { id: "scan",     label: "Pindai Struk (OCR)" },
  { id: "analisis", label: "Analisis Pemakaian" },
];

/* ── Analisis panel: Tampilan 2 kolom sejajar yang berimbang ── */
function AnalisisPanel() {
  const rows = [
    { bulan: "Nov 2025", kwh: 220, status: "hemat" },
    { bulan: "Des 2025", kwh: 195, status: "sangat_hemat" },
    { bulan: "Jan 2026", kwh: 240, status: "normal" },
    { bulan: "Feb 2026", kwh: 185, status: "hemat" },
    { bulan: "Mar 2026", kwh: 210, status: "normal" },
    { bulan: "Apr 2026", kwh: 170, status: "sangat_hemat" },
  ];

  const statusCfg: Record<string, { label: string; cls: string }> = {
    sangat_hemat: { label: "Sangat Hemat", cls: "bg-emerald-100 text-emerald-800" },
    hemat:        { label: "Hemat", cls: "bg-green-100 text-green-800" },
    normal:       { label: "Sesuai Acuan", cls: "bg-gray-100 text-gray-700" },
    boros:        { label: "Di Atas Acuan", cls: "bg-red-100 text-red-700" },
  };

  const avgKwh = Math.round(rows.reduce((s, r) => s + r.kwh, 0) / rows.length);

  return (
    <div className="grid gap-5 lg:gap-6 md:grid-cols-2 items-stretch">
      {/* Kolom Kiri: Ringkasan Rata-rata & Rekomendasi Efisiensi */}
      <div className="flex flex-col gap-4 justify-between rounded-2xl border border-gray-200/90 bg-white p-5 sm:p-6 shadow-xs">
        <div>
          <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-[#0F3D2E]">Ringkasan Efisiensi Energi</h3>
            <DataBadge variant="demo" label="Sampel Riwayat" />
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#F0FAF4] to-emerald-50/70 border border-emerald-200 p-5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Rata-rata 6 Bulan Terakhir
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0F3D2E]">{avgKwh}</span>
              <span className="text-sm font-bold text-gray-500">kWh / bulan</span>
            </div>
            <p className="mt-2 text-xs text-gray-600 leading-relaxed">
              Konsumsi listrik keluarga Anda rata-rata <strong>18% lebih efisien</strong> dibanding tolok ukur rumah tangga berdaya 2.200 VA di Kota Surabaya.
            </p>
          </div>

          <div className="mt-4 space-y-2.5">
            <div className="flex items-start gap-2.5 rounded-xl border border-gray-100 bg-[#FAFCFB] p-3 text-xs">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-[#0F3D2E]">
                <Zap size={13} />
              </span>
              <div>
                <p className="font-bold text-gray-800">Dukungan Subsidi & Beban Puncak</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Menjaga konsumsi di bawah 200 kWh per bulan meminimalkan beban puncak pada pembangkit Jawa-Bali.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-gray-100 bg-[#FAFCFB] p-3 text-xs">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-800">
                <BarChart3 size={13} />
              </span>
              <div>
                <p className="font-bold text-gray-800">Konsistensi Catatan Rekening</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Laporan bulanan yang rutin memperkuat akurasi jejak karbon tahunan Anda di dasbor warga.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Target reduksi tahun 2026: <strong>160 kWh / bln</strong></span>
          <span className="font-bold text-[#1D9E75]">Tren Positif</span>
        </div>
      </div>

      {/* Kolom Kanan: Tabel Riwayat Bulanan */}
      <div className="rounded-2xl border border-gray-200/90 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-[#0F3D2E]">Riwayat Rekening 6 Bulan</h3>
            <span className="text-[10px] font-bold text-gray-400">ESDM Wilayah II Jatim</span>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-[#F9FAFB]">
                  {["Bulan", "Pemakaian", "Status"].map((h) => (
                    <th key={h} className="px-3.5 py-2.5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r, i) => {
                  const cfg = statusCfg[r.status];
                  return (
                    <tr key={i} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-3.5 py-2.5 font-medium text-gray-900">{r.bulan}</td>
                      <td className="px-3.5 py-2.5 font-bold text-[#0F3D2E]">{r.kwh} kWh</td>
                      <td className="px-3.5 py-2.5">
                        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", cfg.cls)}>
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 pt-3 border-t border-gray-100 text-center text-xs text-gray-400">
          Simpan pemakaian bulan berjalan melalui <strong>Input Manual</strong> atau <strong>Pindai Struk (OCR)</strong> untuk menambah riwayat ini.
        </p>
      </div>
    </div>
  );
}

/* ── Komponen Utama DataListrik ── */
export default function DataListrik() {
  const [mode, setMode] = useState<ListrikMode>("manual");

  return (
    <div className="flex flex-col gap-5">
      {/* Mode switcher bar */}
      <div className="flex gap-1.5 rounded-xl border border-gray-200 bg-gray-100/80 p-1 max-w-md">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-xs font-bold whitespace-nowrap transition-all",
              mode === m.id
                ? "bg-[#0F3D2E] text-white shadow-xs"
                : "text-gray-600 hover:text-[#0F3D2E]"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Panel Aktif: Masing-masing mode terstruktur dalam 2 kolom sejajar */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
        >
          {mode === "manual"   && <InputListrikManual />}
          {mode === "scan"     && <ScanStrukListrik />}
          {mode === "analisis" && <AnalisisPanel />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
