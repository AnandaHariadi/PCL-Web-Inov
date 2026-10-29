"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Gauge, Home, Lightbulb, Star, UserRound, Users, CheckCircle2, ShieldCheck } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEcoPointsStore } from "@/store/ecoPoints.store";
import DataBadge from "@/components/common/DataBadge";
import {
  analyzePowerUsage,
  type HouseholdProfile,
  type BenchmarkResult,
} from "@/utils/electricityBenchmark";

/* -------------------------------------------------------------------------- */
/* Constants & Options                                                        */
/* -------------------------------------------------------------------------- */

const DAYA_OPTIONS: { va: HouseholdProfile["daya"]; label: string; golongan: string }[] = [
  { va: 450,  label: "450 VA",   golongan: "R1/Subsidi" },
  { va: 900,  label: "900 VA",   golongan: "R1/Subsidi" },
  { va: 1300, label: "1.300 VA", golongan: "R1" },
  { va: 2200, label: "2.200 VA", golongan: "R1" },
  { va: 3500, label: "3.500 VA", golongan: "R2" },
  { va: 4400, label: "4.400 VA+",golongan: "R3" },
];

const HUNIAN_OPTIONS: { value: HouseholdProfile["type"]; label: string; sub: string }[] = [
  { value: "rumah_kecil",  label: "Rumah Kecil",       sub: "< 36 m²" },
  { value: "rumah_sedang", label: "Rumah Sedang",      sub: "36–100 m²" },
  { value: "rumah_besar",  label: "Rumah Besar",       sub: "> 100 m²" },
  { value: "apartment",    label: "Apartemen / Rusun", sub: "Semua Unit" },
];

const SUMBER_OPTIONS = ["Input Manual", "Hasil Pindai Struk (OCR)", "Aplikasi PLN Mobile"] as const;
type Sumber = typeof SUMBER_OPTIONS[number];

const LS_KEY = "pacul-household-profile";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function currentMonthYear() {
  const d = new Date();
  return { month: d.getMonth() + 1, year: d.getFullYear() };
}

/* -------------------------------------------------------------------------- */
/* Sample 6-Month Historical Data (Data Riwayat Sampel)                       */
/* -------------------------------------------------------------------------- */

const MOCK_HISTORY = [
  { month: "Nov", usage: 220, avg: 260, status: "hemat" },
  { month: "Des", usage: 195, avg: 260, status: "sangat_hemat" },
  { month: "Jan", usage: 240, avg: 260, status: "hemat" },
  { month: "Feb", usage: 185, avg: 260, status: "sangat_hemat" },
  { month: "Mar", usage: 210, avg: 260, status: "hemat" },
  { month: "Apr", usage: 170, avg: 260, status: "sangat_hemat" },
];

/* -------------------------------------------------------------------------- */
/* Sub-komponen: MemberStepper (Adaptif untuk Anggota > 10)                   */
/* -------------------------------------------------------------------------- */

function MemberStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const maxLimit = 20;
  const isLarge = value > 5;
  const categoryLabel =
    value <= 4
      ? "Keluarga Inti"
      : value <= 8
      ? "Keluarga Besar"
      : "Komunal / Asrama";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-100 bg-[#FAFCFB] p-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, value - 1))}
          disabled={value <= 1}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-base font-bold text-gray-600 hover:border-[#1D9E75] hover:text-[#0F3D2E] disabled:opacity-40 transition-colors shadow-xs"
          aria-label="Kurangi anggota keluarga"
        >
          -
        </button>

        {/* Visualisasi Avatar Adaptif */}
        <div className="flex items-center gap-1">
          {/* Ikon Aktif Terisi */}
          {Array.from({ length: Math.min(5, value) }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-[#0F3D2E]"
              aria-hidden
            >
              <UserRound size={18} />
            </motion.span>
          ))}

          {/* Sisa bayangan jika keluarga standar (<= 5 orang) */}
          {!isLarge &&
            Array.from({ length: 5 - value }).map((_, i) => (
              <span key={`empty-${i}`} className="text-gray-300" aria-hidden>
                <UserRound size={18} />
              </span>
            ))}

          {/* Lencana pil adaptif jika anggota keluarga > 5 (antisipasi 6-20+ orang) */}
          {isLarge && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="ml-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-200 px-2 py-0.5 text-[11px] font-bold text-[#0F3D2E]"
            >
              +{value - 5}
            </motion.span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onChange(Math.min(maxLimit, value + 1))}
          disabled={value >= maxLimit}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-base font-bold text-gray-600 hover:border-[#1D9E75] hover:text-[#0F3D2E] disabled:opacity-40 transition-colors shadow-xs"
          aria-label="Tambah anggota keluarga"
        >
          +
        </button>
      </div>

      {/* Nilai dan label klasifikasi hunian */}
      <div className="flex items-center sm:justify-end gap-2 text-right">
        <span className="text-sm font-extrabold text-gray-900">{value} orang</span>
        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200/60">
          {categoryLabel}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sub-komponen: ComparisonBar                                                */
/* -------------------------------------------------------------------------- */

function ComparisonBar({ yourUsage, avgUsage, color }: { yourUsage: number; avgUsage: number; color: string }) {
  const max = Math.max(yourUsage, avgUsage) * 1.15;
  const youPct = (yourUsage / max) * 100;
  const avgPct = (avgUsage / max) * 100;
  return (
    <div className="flex flex-col gap-2">
      <div>
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-semibold text-white/80">Pemakaian Anda</span>
          <span className="font-bold text-white">{yourUsage} kWh</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${youPct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
      <div>
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-semibold text-white/80">Batas Acuan Rata-rata</span>
          <span className="font-bold text-white">{avgUsage} kWh</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${avgPct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-white/40"
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sub-komponen: BenchmarkCard (Hasil Analisis Real-Time)                     */
/* -------------------------------------------------------------------------- */

function BenchmarkCard({ result }: { result: BenchmarkResult }) {
  const isGood = result.status === "sangat_hemat" || result.status === "hemat";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="overflow-hidden rounded-2xl text-white shadow-xs"
      style={{ background: result.statusBg }}
    >
      {/* Hero */}
      <div className="flex flex-col items-center gap-2 px-6 py-5 text-center">
        <Gauge size={40} aria-hidden="true" />
        <p className="text-lg font-extrabold">{result.statusLabel}</p>
        <p className="text-xs text-white/85 leading-relaxed">{result.message}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 divide-x divide-white/10 border-t border-b border-white/10 bg-black/10 py-3 text-center text-xs">
        <div>
          <span className="text-white/60 text-[10px]">Estimasi Emisi</span>
          <p className="text-base font-bold text-white">{result.co2Impact} <span className="text-xs font-normal">kg CO₂e</span></p>
        </div>
        <div>
          <span className="text-white/60 text-[10px]">Selisih vs Acuan</span>
          <p className="text-base font-bold text-white">
            {result.difference > 0 ? `+${result.difference}` : result.difference} <span className="text-xs font-normal">kWh</span>
          </p>
        </div>
      </div>

      {/* Progress comparison */}
      <div className="px-6 py-4">
        <ComparisonBar
          yourUsage={result.yourUsage}
          avgUsage={result.averageUsage}
          color={result.statusColor}
        />
      </div>

      {/* Reward callout */}
      {isGood && (
        <div className="flex items-center gap-2.5 bg-white/10 px-6 py-2.5 text-xs text-white">
          <Star size={14} className="text-yellow-300 shrink-0" aria-hidden="true" />
          <span>
            {result.status === "sangat_hemat" ? "Sangat hemat! Berpotensi +25 EcoPoints saat disimpan." : "Hemat! Berpotensi +15 EcoPoints saat disimpan."}
          </span>
        </div>
      )}

      {/* Tips */}
      <div className="flex flex-col gap-2 bg-black/20 px-6 py-3.5 text-xs text-white/80">
        <p className="font-semibold text-white flex items-center gap-1.5">
          <Lightbulb size={13} className="text-yellow-300" /> Tips Efisiensi Energi:
        </p>
        <ul className="list-disc pl-4 space-y-1 text-[11px]">
          {result.tips.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Component: InputListrikManual                                         */
/* -------------------------------------------------------------------------- */

export default function InputListrikManual() {
  const earn = useEcoPointsStore((s) => s.earn);
  const transactions = useEcoPointsStore((s) => s.transactions);

  /* Profile state */
  const [profileSaved, setProfileSaved] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [members, setMembers] = useState<HouseholdProfile["members"]>(3);
  const [daya, setDaya] = useState<HouseholdProfile["daya"]>(2200);
  const [hunian, setHunian] = useState<HouseholdProfile["type"]>("rumah_sedang");

  /* Input state */
  const [kwh, setKwh] = useState("");
  const [tagihan, setTagihan] = useState("");
  const [tagihanDisplay, setTagihanDisplay] = useState("");
  const [sumber, setSumber] = useState<Sumber>("Input Manual");
  const [selectedMonth, setSelectedMonth] = useState(currentMonthYear().month);
  const [selectedYear, setSelectedYear] = useState(currentMonthYear().year);
  const [saving, setSaving] = useState(false);

  /* Benchmark result (debounced) */
  const [result, setResult] = useState<BenchmarkResult | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Load profile from localStorage */
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const p = JSON.parse(saved) as HouseholdProfile;
        setMembers(p.members);
        setDaya(p.daya);
        setHunian(p.type);
        setProfileSaved(true);
      }
    } catch { /* ignore */ }
  }, []);

  const saveProfile = () => {
    const profile: HouseholdProfile = { members, daya, type: hunian };
    if (typeof window !== "undefined")
      localStorage.setItem(LS_KEY, JSON.stringify(profile));
    setProfileSaved(true);
    setEditProfile(false);
    toast.success("Profil rumah tangga berhasil disimpan");
  };

  /* Debounce benchmark calc */
  const recalc = useCallback((val: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const n = parseFloat(val);
    if (!n || n <= 0) { setResult(null); return; }
    debounceRef.current = setTimeout(() => {
      setResult(analyzePowerUsage(n, { members, daya, type: hunian }));
    }, 400);
  }, [members, daya, hunian]);

  useEffect(() => { recalc(kwh); }, [kwh, recalc]);

  /* Tagihan auto-format */
  const handleTagihan = (raw: string) => {
    const num = raw.replace(/\D/g, "");
    setTagihan(num);
    setTagihanDisplay(num ? "Rp " + parseInt(num).toLocaleString("id-ID") : "");
  };

  const handleSubmit = async () => {
    const kwhNum = parseFloat(kwh);
    if (!kwhNum || kwhNum <= 0) {
      toast.error("Masukkan jumlah pemakaian kWh yang valid");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));

    const periodKey = `listrik_${selectedYear}_${selectedMonth}`;
    const alreadyRewarded = transactions.some((t) => t.source === "footprint_log" && t.label?.includes(periodKey));
    let reward = 0;
    if (!alreadyRewarded) {
      const res = analyzePowerUsage(kwhNum, { members, daya, type: hunian });
      if (res.status === "sangat_hemat") reward = 25;
      else if (res.status === "hemat") reward = 15;
      else reward = 10;
      earn(reward, "footprint_log", `Laporan Listrik PLN (${periodKey}): ${monthNames[selectedMonth - 1]} ${selectedYear}`);
    }

    toast.success(
      reward
        ? `Laporan tersimpan · +${reward} EcoPoints`
        : alreadyRewarded
          ? "Laporan listrik tersimpan (periode ini telah menerima poin sebelumnya)"
          : "Laporan listrik berhasil disimpan"
    );
    setSaving(false);
  };

  const showProfileForm = !profileSaved || editProfile;
  const years = [2025, 2026];

  return (
    <div className="grid gap-5 lg:gap-6 lg:grid-cols-2 items-start">
      {/* ── KOLOM KIRI: Profil Rumah Tangga & Form Input Bulanan ── */}
      <div className="flex flex-col gap-5">
        {/* SECTION 1: Profil Rumah Tangga */}
        <div className="rounded-2xl border border-gray-200/90 bg-white p-5 sm:p-6 shadow-xs">
          <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#0F3D2E]">Profil Rumah Tangga</h3>
              <p className="text-[11px] text-gray-500">Nilai dasar pembanding efisiensi listrik keluarga</p>
            </div>
            {profileSaved && !editProfile && (
              <button
                onClick={() => setEditProfile(true)}
                className="text-xs font-semibold text-[#1D9E75] hover:underline"
              >
                Ubah Profil
              </button>
            )}
          </div>

          {showProfileForm ? (
            <div className="flex flex-col gap-4">
              {/* Members */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Jumlah Anggota Keluarga
                </label>
                <MemberStepper
                  value={members}
                  onChange={(v) => setMembers(v)}
                />
              </div>

              {/* Daya */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Golongan Daya Listrik{" "}
                  <span className="font-normal text-gray-400">(sesuai rekening PLN)</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {DAYA_OPTIONS.map((opt) => (
                    <button
                      key={opt.va}
                      type="button"
                      onClick={() => setDaya(opt.va)}
                      className={`rounded-xl border px-2 py-2 text-center transition-all ${
                        daya === opt.va
                          ? "border-[#1D9E75] bg-emerald-50 ring-1 ring-[#1D9E75]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className={`text-xs font-bold ${daya === opt.va ? "text-[#0F3D2E]" : "text-gray-800"}`}>
                        {opt.label}
                      </p>
                      <p className="text-[9px] text-gray-400">{opt.golongan}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hunian */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">Tipe Tempat Tinggal</label>
                <div className="grid grid-cols-2 gap-2">
                  {HUNIAN_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setHunian(opt.value)}
                      className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition-all ${
                        hunian === opt.value
                          ? "border-[#1D9E75] bg-emerald-50 ring-1 ring-[#1D9E75]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Home size={16} className="shrink-0 text-[#1D9E75]" aria-hidden="true" />
                      <div>
                        <p className={`text-xs font-semibold ${hunian === opt.value ? "text-[#0F3D2E]" : "text-gray-800"}`}>
                          {opt.label}
                        </p>
                        <p className="text-[9px] text-gray-400">{opt.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={saveProfile}
                className="mt-1 rounded-xl bg-[#0F3D2E] py-2.5 text-xs font-bold text-white hover:bg-[#18533F] transition-colors"
              >
                Simpan Profil Rumah Tangga
              </button>
            </div>
          ) : (
            /* Saved profile summary */
            <div className="flex flex-wrap items-center gap-3 rounded-xl bg-[#F9FAFB] border border-gray-100 px-4 py-3 text-xs sm:text-sm">
              <Users size={16} className="text-[#1D9E75]" aria-hidden="true" />
              <span className="font-semibold text-gray-800">{members} orang</span>
              <span className="text-gray-300">·</span>
              <span className="font-semibold text-gray-800">
                {DAYA_OPTIONS.find((d) => d.va === daya)?.label}
              </span>
              <span className="text-gray-300">·</span>
              <span className="font-semibold text-gray-800">
                {HUNIAN_OPTIONS.find((h) => h.value === hunian)?.label}
              </span>
            </div>
          )}
        </div>

        {/* SECTION 2: Input Bulanan */}
        <div className="rounded-2xl border border-gray-200/90 bg-white p-5 sm:p-6 shadow-xs flex flex-col gap-4">
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-[#0F3D2E]">Catat Pemakaian Listrik Bulanan</h3>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Input Manual
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {/* Periode */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">Periode Rekening</label>
                <div className="flex gap-2">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75]"
                  >
                    {monthNames.map((m, i) => (
                      <option key={i} value={i + 1}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="w-28 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75]"
                  >
                    {years.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              {/* kWh Input */}
              <div>
                <label htmlFor="kwh-input" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Jumlah Pemakaian Listrik (kWh)
                </label>
                <div className="flex items-center overflow-hidden rounded-xl border border-gray-300 bg-white focus-within:border-[#1D9E75] focus-within:ring-1 focus-within:ring-[#1D9E75]">
                  <input
                    id="kwh-input"
                    type="number"
                    min={0}
                    step={1}
                    value={kwh}
                    onChange={(e) => setKwh(e.target.value)}
                    placeholder="Contoh: 185"
                    className="flex-1 bg-transparent px-4 py-3 text-xl sm:text-2xl font-black text-gray-900 outline-none placeholder-gray-300"
                  />
                  <span className="pr-4 text-sm font-bold text-gray-400">kWh</span>
                </div>
                <p className="mt-1 text-[11px] text-gray-400">
                  Stand Meter Akhir dikurangi Stand Meter Awal pada struk rekening PLN.
                </p>
              </div>

              {/* Tagihan Rp */}
              <div>
                <label htmlFor="tagihan-input" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Total Tagihan Rekening Listrik <span className="font-normal text-gray-400">(opsional)</span>
                </label>
                <input
                  id="tagihan-input"
                  type="text"
                  inputMode="numeric"
                  value={tagihanDisplay}
                  onChange={(e) => handleTagihan(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="Rp 0"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75]"
                />
              </div>

              {/* Sumber */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">Sumber Data</label>
                <div className="flex flex-wrap gap-3 text-xs">
                  {SUMBER_OPTIONS.map((s) => (
                    <label key={s} className="flex cursor-pointer items-center gap-1.5 text-gray-700">
                      <input
                        type="radio"
                        name="sumber"
                        checked={sumber === s}
                        onChange={() => setSumber(s)}
                        className="accent-[#0F3D2E]"
                      />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-1">
            {kwh && parseFloat(kwh) > 0 ? (
              <motion.button
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleSubmit}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F3D2E] py-3 text-sm font-bold text-white shadow-sm hover:bg-[#18533F] disabled:opacity-60 transition-colors"
              >
                {saving ? (
                  <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Menyimpan Laporan…</>
                ) : (
                  <>Simpan Laporan Listrik {monthNames[selectedMonth - 1]} {selectedYear}</>
                )}
              </motion.button>
            ) : (
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-center text-xs text-gray-400">
                Masukkan nilai kWh di atas untuk mengaktifkan tombol simpan dan melihat kalkulasi emisi.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── KOLOM KANAN: Hasil Benchmark & Riwayat 6 Bulan ── */}
      <div className="flex flex-col gap-5">
        {/* SECTION 3: Benchmark Result Card */}
        <AnimatePresence mode="wait">
          {result ? (
            <BenchmarkCard result={result} />
          ) : (
            <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 p-5 text-center flex flex-col items-center justify-center gap-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-[#0F3D2E]">
                <Gauge size={22} />
              </span>
              <h4 className="text-sm font-bold text-[#0F3D2E]">Kalkulasi Efisiensi Energi Real-Time</h4>
              <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
                Ketikkan angka pemakaian kWh pada formulir di sebelah kiri untuk melihat evaluasi otomatis apakah konsumsi listrik Anda tergolong Sangat Hemat, Sesuai Acuan, atau Berlebih.
              </p>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-emerald-800 font-semibold bg-white border border-emerald-200 px-3 py-1 rounded-full">
                <CheckCircle2 size={13} className="text-[#1D9E75]" />
                <span>Dihitung berdasarkan profil {members} anggota keluarga</span>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* SECTION 4: Riwayat 6 Bulan & Ringkasan Analitik Padat Karya */}
        <div className="rounded-2xl border border-gray-200/90 bg-white p-5 sm:p-6 shadow-xs flex flex-col gap-3.5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#0F3D2E]">Tren Pemakaian 6 Bulan Terakhir</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Evaluasi perbandingan konsumsi kWh bulanan Anda</p>
            </div>
            <DataBadge variant="demo" label="Data Sampel" />
          </div>

          {/* Grafik Garis Recharts dengan grid dan domain proporsional */}
          <div className="py-1">
            <ResponsiveContainer width="100%" height={190}>
              <LineChart data={MOCK_HISTORY} margin={{ top: 14, right: 12, left: -14, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6B7280", fontSize: 11, fontWeight: 600 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                  dy={4}
                />
                <YAxis
                  domain={[120, 290]}
                  tick={{ fill: "#9CA3AF", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  unit=" kWh"
                  width={48}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    fontSize: 12,
                    padding: "8px 12px",
                  }}
                  formatter={(v: number, name: string) => [
                    `${v} kWh`,
                    name === "usage" ? "Pemakaian Riil Anda" : "Batas Acuan Rata-rata",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="usage"
                  name="usage"
                  stroke="#0F3D2E"
                  strokeWidth={2.5}
                  dot={{ r: 4.5, fill: "#10B981", stroke: "#0F3D2E", strokeWidth: 1.5 }}
                  activeDot={{ r: 6.5, fill: "#0F3D2E" }}
                  isAnimationActive={true}
                  animationDuration={1000}
                />
                <Line
                  type="monotone"
                  dataKey="avg"
                  name="avg"
                  stroke="#9CA3AF"
                  strokeWidth={2}
                  strokeDasharray="4 3"
                  dot={false}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Ringkasan 3 Metrik Efisiensi Konsumsi */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
            <div className="rounded-xl bg-[#FAFCFB] border border-gray-100 p-2.5 text-center">
              <span className="text-[10px] text-gray-500 block">Rata-rata Riil</span>
              <p className="text-xs sm:text-sm font-black text-[#0F3D2E] mt-0.5">203 <span className="text-[10px] font-normal text-gray-500">kWh/bln</span></p>
            </div>
            <div className="rounded-xl bg-[#FAFCFB] border border-gray-100 p-2.5 text-center">
              <span className="text-[10px] text-gray-500 block">Bulan Terhemat</span>
              <p className="text-xs sm:text-sm font-black text-emerald-700 mt-0.5">Apr <span className="text-[10px] font-normal text-gray-500">(170 kWh)</span></p>
            </div>
            <div className="rounded-xl bg-[#FAFCFB] border border-gray-100 p-2.5 text-center">
              <span className="text-[10px] text-gray-500 block">Total Reduksi</span>
              <p className="text-xs sm:text-sm font-black text-emerald-700 mt-0.5">-340 <span className="text-[10px] font-normal text-gray-500">kWh</span></p>
            </div>
          </div>

          {/* Grid Riwayat 6 Bulan Terstruktur (3 kolom x 2 baris seimbang) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 rounded-xl bg-gray-50/80 p-2.5 border border-gray-100 text-[11px]">
            {MOCK_HISTORY.map((item) => (
              <div key={item.month} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white border border-gray-200/60 shadow-xs">
                <span className="font-semibold text-gray-700">{item.month}</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#0F3D2E]">{item.usage} kWh</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="Di bawah batas acuan" />
                </div>
              </div>
            ))}
          </div>

          {/* Catatan Insight Evaluasi Efisiensi */}
          <div className="flex items-start gap-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/70 p-3 text-xs">
            <ShieldCheck size={16} className="text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-[11px] text-emerald-900 leading-relaxed">
              <span className="font-bold text-[#0F3D2E]">Evaluasi Konsistensi Efisiensi: </span>
              Seluruh 6 bulan pemakaian konsisten berada di bawah batas acuan Surabaya dengan rata-rata selisih efisiensi 21,9%.
            </div>
          </div>

          {/* Legend Indikator Langsung Berdampingan */}
          <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-3 rounded bg-[#0F3D2E]" /> Pemakaian Riil Anda
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-3 rounded border-t-2 border-dashed border-[#9CA3AF]" /> Batas Acuan Rata-rata
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
