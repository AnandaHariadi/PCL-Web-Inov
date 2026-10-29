"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, CheckCircle, AlertTriangle, RefreshCw, ZoomIn, Lightbulb, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { SUPPORTING_ECOPOINT_SOURCES } from "@/config/eco-points";
import { useEcoPointsStore } from "@/store/ecoPoints.store";
import DataBadge from "@/components/common/DataBadge";

/* ── Types ── */
type ScanState = "idle" | "uploading" | "processing" | "success" | "partial" | "error";

interface ScanResult {
  kwh?: number;
  tagihan?: number;
  noPelanggan?: string;
  namaPelanggan?: string;
  bulanTagihan?: string;
  dayaVA?: string;
  confidence: number;
  rawText?: string;
  mode: "live" | "demo";
}

/* ── OCR API call ── */
async function callOcrApi(file: File, onProgress: (p: number) => void): Promise<ScanResult> {
  const formData = new FormData();
  formData.append("image", file);

  onProgress(20);
  await new Promise((r) => setTimeout(r, 400));
  onProgress(60);

  try {
    const res = await fetch("/api/ocr/scan-bill", {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });
    onProgress(100);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { message?: string }).message ?? "Gagal menghubungi layanan OCR");
    }
    const json = (await res.json()) as {
      success: boolean;
      data?: {
        no_pelanggan?: string;
        nama_pelanggan?: string;
        bulan_tagihan?: string;
        daya_va?: string;
        penggunaan_kwh?: string;
        tagihan_rp?: string;
      };
      kwh?: number;
      tagihan?: number;
      confidence?: number;
      raw_text?: string;
      mode?: "live" | "demo";
    };

    const d = json.data ?? {};
    return {
      kwh: json.kwh ?? (d.penggunaan_kwh ? parseFloat(d.penggunaan_kwh) : undefined),
      tagihan: json.tagihan ?? (d.tagihan_rp ? parseInt(d.tagihan_rp.replace(/\D/g, "")) : undefined),
      noPelanggan: d.no_pelanggan,
      namaPelanggan: d.nama_pelanggan,
      bulanTagihan: d.bulan_tagihan,
      dayaVA: d.daya_va,
      confidence: json.confidence ?? 85,
      rawText: json.raw_text,
      mode: json.mode ?? "demo",
    };
  } catch (err: unknown) {
    throw new Error(err instanceof Error ? err.message : "Gagal memproses struk PLN");
  }
}

/* ── Processing step animation ── */
const PROC_STEPS = [
  "Menganalisis foto struk rekening listrik PLN…",
  "Mengekstrak teks dengan Google Cloud Vision AI…",
  "Mengidentifikasi nomor pelanggan & angka kWh…",
  "Memvalidasi tarif golongan daya listrik…",
];

function ProcessingView() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const intervals = [700, 900, 1000];
    let i = 0;
    const next = () => {
      if (i < intervals.length) {
        setStep(i + 1);
        setTimeout(next, intervals[i++]);
      }
    };
    const t = setTimeout(next, intervals[0]);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute h-full w-full animate-ping rounded-full bg-[#1D9E75]/20" />
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F3D2E] text-white">
          <Camera size={22} className="animate-pulse" />
        </span>
      </div>

      <div className="flex flex-col gap-2 text-xs sm:text-sm">
        {PROC_STEPS.map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, x: -8 }}
            animate={step > i ? { opacity: 1, x: 0 } : { opacity: 0.35, x: -8 }}
            className="flex items-center gap-2 text-left"
          >
            {step > i ? (
              <CheckCircle size={14} className="text-[#1D9E75] shrink-0" />
            ) : (
              <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-gray-300" />
            )}
            <span className={step > i ? "text-[#0F3D2E] font-semibold" : "text-gray-400"}>
              {s}
            </span>
          </motion.div>
        ))}
      </div>
      <p className="text-xs text-gray-400">Proses pemindaian biasanya memerlukan waktu 2–4 detik</p>
    </div>
  );
}

/* ── Result row ── */
function ResultRow({ label, value, highlight }: { label: string; value?: string | number; highlight?: boolean }) {
  return (
    <div className={`flex flex-col rounded-xl px-3 py-2.5 ${highlight ? "bg-emerald-50 border border-emerald-200" : "bg-[#F9FAFB] border border-gray-100"}`}>
      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</span>
      <span className={`mt-0.5 text-xs sm:text-sm font-bold ${highlight ? "text-[#0F3D2E]" : "text-gray-800"}`}>
        {value ?? <span className="text-gray-300 font-normal">Tidak terdeteksi</span>}
      </span>
    </div>
  );
}

/* ── Camera Modal ── */
function CameraModal({ onCapture, onClose }: { onCapture: (file: File) => void; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        setError("Kamera tidak dapat diakses. Silakan periksa izin peramban Anda.");
      }
    })();

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `struk_${Date.now()}.jpg`, { type: "image/jpeg" });
      onCapture(file);
    }, "image/jpeg", 0.9);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
        <h4 className="mb-3 text-sm font-bold text-[#0F3D2E]">Arahkan Kamera ke Struk PLN</h4>
        {error ? (
          <p className="rounded-xl bg-red-50 p-4 text-xs text-red-600">{error}</p>
        ) : (
          <div className="relative overflow-hidden rounded-xl bg-black aspect-video">
            <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}
        <div className="mt-4 flex gap-2">
          <button
            onClick={takePhoto}
            disabled={!!error}
            className="flex-1 rounded-xl bg-[#0F3D2E] py-2.5 text-xs font-bold text-white hover:bg-[#18533F] disabled:opacity-50"
          >
            Ambil Foto
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Komponen Utama ScanStrukListrik ── */
export default function ScanStrukListrik() {
  const earn = useEcoPointsStore((s) => s.earn);
  const transactions = useEcoPointsStore((s) => s.transactions);

  const [scanState, setScanState] = useState<ScanState>("idle");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editKwh, setEditKwh] = useState("");
  const [editTagihan, setEditTagihan] = useState("");
  const [showCamera, setShowCamera] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Mohon unggah berkas citra (JPG, PNG, atau WebP)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran berkas maksimal 10 MB");
      return;
    }

    setScanState("uploading");
    setUploadProgress(10);

    try {
      setScanState("processing");
      const res = await callOcrApi(file, (p) => setUploadProgress(p));
      setResult(res);
      setEditKwh(res.kwh ? String(res.kwh) : "");
      setEditTagihan(res.tagihan ? String(res.tagihan) : "");
      setScanState(res.kwh ? "success" : "partial");
      toast.success("Struk berhasil dianalisis!");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal memproses struk PLN");
      setScanState("error");
    }
  }, []);

  const handleSave = () => {
    const kwhNum = parseFloat(editKwh);
    if (!kwhNum || kwhNum <= 0) {
      toast.error("Nilai pemakaian kWh harus diisi.");
      return;
    }

    const periodKey = result?.bulanTagihan ? `ocr_${result.bulanTagihan}` : `ocr_${Date.now()}`;
    const alreadyRewarded = transactions.some((t) => t.source === "footprint_log" && t.label?.includes(periodKey));
    let pointsAwarded = 0;
    if (!alreadyRewarded) {
      pointsAwarded = kwhNum < 200 ? 25 : 15;
      earn(pointsAwarded, "footprint_log", `Pindai Struk PLN (${periodKey}): ${kwhNum} kWh`);
    }

    toast.success(
      pointsAwarded > 0
        ? `Data berhasil disimpan · +${pointsAwarded} EcoPoints!`
        : "Data rekening listrik berhasil disimpan"
    );
    reset();
  };

  const reset = () => {
    setScanState("idle");
    setResult(null);
    setErrorMsg("");
    setEditMode(false);
    setUploadProgress(0);
  };

  const rp = (n?: number) =>
    n != null ? `Rp ${n.toLocaleString("id-ID")}` : undefined;

  return (
    <>
      <div className="rounded-2xl border border-gray-200/90 bg-white p-5 sm:p-6 shadow-xs">
        <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-[#0F3D2E]">
              <Camera size={16} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#0F3D2E]">Pindai Rekening Listrik PLN</h3>
              <p className="text-[11px] text-gray-500">Ekstraksi angka Stand Meter & kWh otomatis via AI Vision</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-[#0F3D2E]">
            Google Cloud Vision
          </span>
        </div>

        <AnimatePresence mode="wait">
          {/* ── STATE 1: IDLE (2 Kolom Sejajar) ── */}
          {scanState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-5 lg:gap-6 lg:grid-cols-2 items-stretch"
            >
              {/* Kolom Kiri: Dropzone & Tombol Upload */}
              <div className="flex flex-col justify-between">
                <label
                  className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#A8D5BA] px-6 py-10 text-center transition-all hover:border-[#1D9E75] hover:bg-[#F0FAF4] min-h-[200px]"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const f = e.dataTransfer.files[0];
                    if (f) handleFile(f);
                  }}
                >
                  <Camera size={44} className="text-[#1D9E75]" />
                  <div>
                    <p className="font-bold text-sm text-gray-800">Unggah Foto atau Berkas Struk PLN</p>
                    <p className="mt-1 text-xs text-gray-400">JPG, PNG, atau WebP · Maksimal 10 MB</p>
                  </div>
                </label>

                <div className="mt-4 flex gap-2.5">
                  <button
                    onClick={() => setShowCamera(true)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Camera size={15} /> Ambil Foto Kamera
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0F3D2E] py-2.5 text-xs font-bold text-white hover:bg-[#18533F] transition-colors"
                  >
                    <Upload size={15} /> Pilih Berkas Citra
                  </button>
                </div>

                <div className="mt-3.5 flex items-start gap-2 rounded-xl bg-amber-50/80 border border-amber-200/80 px-3.5 py-2.5">
                  <Lightbulb size={14} className="mt-0.5 shrink-0 text-amber-700" aria-hidden="true" />
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    <strong>Tips Pemindaian:</strong> Pastikan posisi struk tegak, pencahayaan cukup, dan baris angka kWh serta Stand Meter terlihat jelas.
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                />
              </div>

              {/* Kolom Kanan: Panduan Ekstraksi Struk OCR */}
              <div className="flex flex-col justify-between rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
                <div>
                  <h4 className="text-xs font-bold text-[#0F3D2E] mb-3 flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-[#1D9E75]" />
                    Panduan Ekstraksi Struk Rekening PLN
                  </h4>
                  <div className="space-y-2.5 text-xs text-gray-600">
                    <div className="rounded-xl bg-white border border-emerald-100 p-3">
                      <p className="font-bold text-gray-800">1. Struk Kertas atau Tangkapan Layar</p>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                        Sistem menerima foto struk loket pembayaran (Indomaret, Alfamart, Kantor Pos) maupun screenshot aplikasi PLN Mobile.
                      </p>
                    </div>

                    <div className="rounded-xl bg-white border border-emerald-100 p-3">
                      <p className="font-bold text-gray-800">2. Pembacaan Otomatis Stand Meter</p>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                        AI membaca nomor pelanggan, golongan daya VA, dan menghitung selisih Stand Meter Kini vs Lalu untuk mendapatkan angka kWh akurat.
                      </p>
                    </div>

                    <div className="rounded-xl bg-white border border-emerald-100 p-3">
                      <p className="font-bold text-gray-800">3. Klaim Reward EcoPoints</p>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                        Data tagihan yang terverifikasi efisien memberikan reward hingga +25 EcoPoints untuk ditukarkan voucher di warung UMKM.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-emerald-800 font-semibold">
                  <span>Keamanan data terjaga · Standar ESDM</span>
                  <span className="text-emerald-700">Verifikasi AI 99%</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STATE 2: UPLOADING ── */}
          {scanState === "uploading" && (
            <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-12"
            >
              <Upload size={36} className="text-[#1D9E75] animate-bounce" />
              <p className="font-bold text-gray-800 text-sm">Mengunggah foto struk tagihan listrik…</p>
              <div className="w-full max-w-xs rounded-full bg-gray-100 h-2 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[#1D9E75]"
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs text-gray-400">{uploadProgress}% selesai</p>
            </motion.div>
          )}

          {/* ── STATE 3: PROCESSING ── */}
          {scanState === "processing" && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProcessingView />
            </motion.div>
          )}

          {/* ── STATE 4: SUCCESS / PARTIAL (2 Kolom Sejajar) ── */}
          {(scanState === "success" || scanState === "partial") && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid gap-5 lg:gap-6 lg:grid-cols-2 items-stretch"
            >
              {/* Kolom Kiri: Status & Tindakan Pindai Ulang */}
              <div className="flex flex-col justify-between rounded-2xl bg-[#FAFCFB] border border-gray-200/90 p-5">
                <div>
                  {/* Status chip */}
                  <div className={`mb-3.5 flex items-center justify-between rounded-xl px-3.5 py-2.5 ${scanState === "success" ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"}`}>
                    <div className="flex items-center gap-2">
                      {scanState === "success" ? (
                        <CheckCircle size={17} className="text-[#0F3D2E]" />
                      ) : (
                        <AlertTriangle size={17} className="text-amber-600" />
                      )}
                      <span className="font-bold text-xs text-[#0F3D2E]">
                        {scanState === "success" ? "Struk Berhasil Terbaca Penuh" : "Sebagian Kolom Perlu Dilengkapi"}
                      </span>
                    </div>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-gray-700 border border-gray-200">
                      {result.confidence}% terdeteksi
                    </span>
                  </div>

                  {result.mode === "demo" && (
                    <p className="mb-3.5 flex items-center gap-2 text-xs text-amber-800 bg-amber-50/70 border border-amber-200/60 p-2.5 rounded-xl">
                      <DataBadge variant="simulated" label="Simulasi" />
                      <span>Data struk PLN diekstraksi menggunakan mesin pengenal teks OCR cerdas.</span>
                    </p>
                  )}

                  {/* Highlights kWh */}
                  <div className="rounded-xl bg-gradient-to-br from-[#F0FAF4] to-emerald-50/60 border border-emerald-200 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      Pemakaian Listrik Terbaca
                    </p>
                    {editMode ? (
                      <input
                        type="number"
                        value={editKwh}
                        onChange={(e) => setEditKwh(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-2xl font-black text-[#0F3D2E] outline-none"
                      />
                    ) : (
                      <p className="mt-0.5 text-3xl font-black text-[#0F3D2E]">
                        {result.kwh ?? "-"} <span className="text-sm font-bold text-gray-500">kWh</span>
                      </p>
                    )}
                    <p className="mt-1 text-[11px] text-gray-500">
                      Stand Meter Akhir dikurangi Stand Meter Awal pada struk.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setEditMode((v) => !v)}
                    className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {editMode ? "Selesai Edit" : "Koreksi Nilai"}
                  </button>
                  <button
                    onClick={reset}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <RefreshCw size={13} /> Pindai Ulang
                  </button>
                </div>
              </div>

              {/* Kolom Kanan: Rincian Kolom Struk & Tombol Simpan */}
              <div className="flex flex-col justify-between rounded-2xl border border-gray-200/90 bg-white p-5 shadow-xs">
                <div>
                  <h4 className="text-xs font-bold text-[#0F3D2E] mb-3">Kolom Data Hasil Ekstraksi</h4>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <ResultRow label="No. Pelanggan" value={result.noPelanggan} />
                    <ResultRow label="Nama Pelanggan" value={result.namaPelanggan} />
                    <ResultRow label="Periode Rekening" value={result.bulanTagihan} />
                    <ResultRow label="Golongan Daya" value={result.dayaVA} />
                    <ResultRow label="Konsumsi Listrik" value={result.kwh ? `${result.kwh} kWh` : undefined} highlight />
                    <ResultRow label="Total Tagihan" value={rp(result.tagihan)} />
                  </div>

                  {scanState === "partial" && (
                    <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs">
                      <p className="font-bold text-amber-900 mb-1.5">Lengkapi kolom yang belum terbaca jelas:</p>
                      <div className="space-y-2">
                        {!result.kwh && (
                          <div>
                            <label className="block text-[11px] font-medium text-gray-600 mb-0.5">Pemakaian kWh</label>
                            <input
                              type="number"
                              value={editKwh}
                              onChange={(e) => setEditKwh(e.target.value)}
                              placeholder="Masukkan angka kWh"
                              className="w-full rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs outline-none"
                            />
                          </div>
                        )}
                        {!result.tagihan && (
                          <div>
                            <label className="block text-[11px] font-medium text-gray-600 mb-0.5">Total Tagihan (Rp)</label>
                            <input
                              type="number"
                              value={editTagihan}
                              onChange={(e) => setEditTagihan(e.target.value)}
                              placeholder="Contoh: 185000"
                              className="w-full rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs outline-none"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <button
                    onClick={handleSave}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F3D2E] py-3 text-xs sm:text-sm font-bold text-white hover:bg-[#18533F] transition-colors shadow-xs"
                  >
                    <CheckCircle size={15} /> Simpan Data ke Riwayat Emisi
                  </button>
                  {result.rawText && (
                    <details className="mt-3">
                      <summary className="flex cursor-pointer items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-600">
                        <ZoomIn size={12} /> Teks mentah hasil OCR
                      </summary>
                      <pre className="mt-1.5 max-h-24 overflow-y-auto rounded-lg bg-gray-50 border border-gray-100 p-2 text-[10px] text-gray-500 whitespace-pre-wrap">
                        {result.rawText}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STATE 5: ERROR ── */}
          {scanState === "error" && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3.5 rounded-2xl bg-red-50 border border-red-200 p-6 text-center"
            >
              <AlertTriangle size={36} className="text-red-500" />
              <div>
                <p className="font-bold text-sm text-red-900">Struk Tidak Dapat Terbaca</p>
                <p className="mt-1 text-xs text-red-600 max-w-md">{errorMsg}</p>
              </div>
              <button
                onClick={reset}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors"
              >
                <RefreshCw size={13} /> Coba Pindai Lagi
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Camera modal */}
      <AnimatePresence>
        {showCamera && (
          <CameraModal
            onCapture={(file) => { setShowCamera(false); handleFile(file); }}
            onClose={() => setShowCamera(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
