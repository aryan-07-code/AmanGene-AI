"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { AppShell } from "@/components/AppShell";
import { useAmanGene } from "@/context/AmanGeneContext";
import { APPOINTMENT_SLOTS, AppointmentSlot } from "@/lib/amangene-data";

export default function CounselingJourneyPage() {
  const {
    locale,
    reflectionChecks,
    toggleReflectionCheck,
    pedigreeFileName,
    setPedigreeFileName,
    appointment,
    setAppointmentSlot,
    coordinatorMessages,
    sendCoordinatorMessage,
  } = useAmanGene();

  const ar = locale === "ar";
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [virtualRoomOpen, setVirtualRoomOpen] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [draftMsg, setDraftMsg] = useState("");
  const pedigreeInputRef = useRef<HTMLInputElement | null>(null);

  const completedCount = reflectionChecks.filter((c) => c.checked).length;

  const handlePedigreeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPedigreeFileName(file.name);
    }
    if (pedigreeInputRef.current) pedigreeInputRef.current.value = "";
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftMsg.trim()) return;
    sendCoordinatorMessage(draftMsg);
    setDraftMsg("");
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top Appointment Banner */}
        <section className="rounded-xl bg-primary text-on-primary p-6 md:p-8 border border-primary-container grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-container text-on-secondary-fixed px-3 py-1 text-label-sm">
              <span className="material-symbols-outlined !text-[15px]">
                calendar_clock
              </span>
              {ar ? "جلسة الإرشاد الوراثي القادمة" : "Upcoming Clinical Session"}
            </span>
            <h1 className="text-headline-lg-mobile md:text-headline-lg text-on-primary">
              {ar ? appointment.dateAr : appointment.dateEn} ·{" "}
              <span className="text-secondary-container">
                {ar ? appointment.timeAr : appointment.timeEn}
              </span>
            </h1>
            <p className="text-body-md text-primary-fixed-dim">
              {ar ? appointment.modeAr : appointment.modeEn} —{" "}
              {ar ? appointment.locationAr : appointment.locationEn}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => setVirtualRoomOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-secondary text-on-secondary px-4 py-2.5 text-label-md hover:bg-secondary/90 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined !text-[18px]">
                  video_call
                </span>
                <span>
                  {ar ? "دخول الغرفة المرئية المشفرة" : "Enter Virtual Room"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setRescheduleOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-container border border-on-primary-container/40 text-on-primary px-4 py-2.5 text-label-md hover:bg-primary-container/80 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined !text-[18px]">
                  edit_calendar
                </span>
                <span>{ar ? "إعادة جدولة الموعد" : "Reschedule Slot"}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-xl bg-primary-container/85 border border-on-primary-container/30 p-5 flex items-center gap-4">
            <Image
              src="/images/reem-counseling.png"
              alt="Dr. Reem Al Hashimi"
              width={68}
              height={68}
              className="h-17 w-17 rounded-full object-cover border-2 border-secondary-container shrink-0"
            />
            <div className="space-y-1">
              <p className="text-title-md text-on-primary">
                {ar ? "د. ريم الهاشمي" : "Dr. Reem Al Hashimi"}
              </p>
              <p className="text-body-sm text-secondary-fixed">
                {ar
                  ? "استشارية الوراثة السريرية · DOH-GC-4092#"
                  : "Lead Genetic Counselor · #DOH-GC-4092"}
              </p>
              <p className="text-label-sm text-primary-fixed-dim">
                {ar
                  ? "اللغات: العربية والإنجليزية"
                  : "Languages: Arabic & English"}
              </p>
            </div>
          </div>
        </section>

        {/* Main Workspace Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 6 cols: Preparation Checklist + Pedigree Upload */}
          <div className="lg:col-span-6 space-y-6">
            <section className="rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-headline-sm text-primary">
                    {ar
                      ? "قائمة التحضير قبل الاستشارة"
                      : "Pre-Session Reflection Checklist"}
                  </h2>
                  <p className="text-body-sm text-on-surface-variant">
                    {completedCount} / {reflectionChecks.length}{" "}
                    {ar ? "عناصر مكتملة" : "items prepared"}
                  </p>
                </div>
                <span className="rounded-full bg-secondary-container text-on-secondary-fixed px-3 py-1 text-label-sm">
                  {Math.round(
                    (completedCount / Math.max(reflectionChecks.length, 1)) *
                      100
                  )}
                  %
                </span>
              </div>

              <div className="space-y-2.5">
                {reflectionChecks.map((chk) => (
                  <label
                    key={chk.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                      chk.checked
                        ? "bg-secondary-container/25 border-secondary/35"
                        : "bg-surface-container-low/60 border-outline-variant/50 hover:border-secondary/40"
                    }`}
                  >
                    <input
                      id={`check-${chk.id}`}
                      name={`check-${chk.id}`}
                      type="checkbox"
                      checked={chk.checked}
                      onChange={() => toggleReflectionCheck(chk.id)}
                      className="mt-1 h-4 w-4 accent-secondary rounded cursor-pointer"
                    />
                    <span
                      className={`text-body-md ${
                        chk.checked
                          ? "text-primary font-medium"
                          : "text-on-surface"
                      }`}
                    >
                      {ar ? chk.titleAr : chk.titleEn}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {/* Family Pedigree Upload Card */}
            <section className="rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-headline-sm text-primary">
                    {ar ? "ملف شجرة العائلة الوراثية" : "Family Pedigree Upload"}
                  </h2>
                  <p className="text-body-sm text-on-surface-variant">
                    {ar
                      ? "أرفق ملف .ped أو PDF لمراجعته قبل الجلسة."
                      : "Attach .ped, PDF, or image pedigree chart for Dr. Reem."}
                  </p>
                </div>
                <input
                  id="pedigree-upload"
                  name="pedigreeUpload"
                  ref={pedigreeInputRef}
                  type="file"
                  accept=".ped,.pdf,.png,.jpg,.jpeg,.svg"
                  onChange={handlePedigreeFile}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => pedigreeInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container-low px-3.5 py-2 text-label-md text-primary hover:bg-surface-container cursor-pointer"
                >
                  <span className="material-symbols-outlined !text-[18px]">
                    upload_file
                  </span>
                  <span>{ar ? "رفع ملف" : "Upload Pedigree"}</span>
                </button>
              </div>

              {pedigreeFileName ? (
                <div className="rounded-xl bg-secondary-container/30 border border-secondary/30 p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="material-symbols-outlined text-secondary">
                      account_tree
                    </span>
                    <div className="min-w-0">
                      <p className="text-body-sm font-semibold text-primary truncate">
                        {pedigreeFileName}
                      </p>
                      <p className="text-label-sm text-secondary">
                        {ar
                          ? "مشفّر ومرفق بملف الاستشارة"
                          : "Encrypted & synced to counseling dossier"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPedigreeFileName(null)}
                    className="text-label-sm text-error hover:underline cursor-pointer shrink-0"
                  >
                    {ar ? "إزالة" : "Remove"}
                  </button>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-outline-variant p-5 text-center text-body-sm text-on-surface-variant">
                  {ar
                    ? "لا يوجد ملف مرفق حالياً"
                    : "No family pedigree attached yet."}
                </div>
              )}
            </section>
          </div>

          {/* Right 6 cols: Live Care Coordinator Thread */}
          <section className="lg:col-span-6 rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-6 flex flex-col h-[540px]">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/50">
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined">support_agent</span>
                </span>
                <div>
                  <h2 className="text-title-md text-primary">
                    {ar
                      ? "منسقة الرعاية الوراثية (قناة مشفرة)"
                      : "Care Coordinator Clinical Thread"}
                  </h2>
                  <p className="text-label-sm text-secondary">
                    {ar
                      ? "سلمى النعيمي · مركز أبوظبي للجينوم"
                      : "Salma Al Nuaimi · Abu Dhabi Genomic Center"}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-2.5 py-0.5 text-label-sm text-on-secondary-fixed">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                Online
              </span>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {coordinatorMessages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      isUser ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-3 text-body-sm ${
                        isUser
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container-low border border-outline-variant/50 text-on-surface"
                      }`}
                    >
                      <p className="text-label-sm opacity-75 mb-1">
                        {ar ? msg.authorAr : msg.authorEn} · {msg.timestamp}
                      </p>
                      <p>{ar ? msg.textAr : msg.textEn}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={handleSendChat}
              className="pt-3 border-t border-outline-variant/50 flex gap-2"
            >
              <input
                id="coordinator-message"
                name="coordinatorMessage"
                type="text"
                value={draftMsg}
                onChange={(e) => setDraftMsg(e.target.value)}
                placeholder={
                  ar
                    ? "اكتب استفساراً لمنسقة الرعاية..."
                    : "Ask your Care Coordinator before the session..."
                }
                className="flex-1 rounded-lg border border-outline-variant bg-surface-container-low px-3.5 py-2.5 text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-secondary text-on-secondary px-4 py-2.5 text-label-md hover:bg-secondary/90 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined !text-[18px]">
                  send
                </span>
                <span>{ar ? "إرسال" : "Send"}</span>
              </button>
            </form>
          </section>
        </div>
      </div>

      {/* Reschedule Slot Picker Modal */}
      {rescheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/55 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl bg-surface-container-lowest border border-outline-variant shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-headline-sm text-primary">
                {ar
                  ? "اختيار موعد جديد للإرشاد الوراثي"
                  : "Select Counseling Appointment Slot"}
              </h3>
              <button
                type="button"
                onClick={() => setRescheduleOpen(false)}
                className="p-1 rounded-lg hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {APPOINTMENT_SLOTS.map((slot: AppointmentSlot) => {
                const selected = slot.id === appointment.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => {
                      setAppointmentSlot(slot);
                      setRescheduleOpen(false);
                    }}
                    className={`w-full text-start p-4 rounded-xl border transition-colors cursor-pointer ${
                      selected
                        ? "bg-secondary-container/40 border-secondary"
                        : "bg-surface-container-low border-outline-variant/60 hover:border-secondary"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-title-md text-primary">
                        {ar ? slot.dateAr : slot.dateEn} ·{" "}
                        {ar ? slot.timeAr : slot.timeEn}
                      </p>
                      {selected && (
                        <span className="rounded-full bg-secondary text-on-secondary px-2.5 py-0.5 text-label-sm">
                          {ar ? "الموعد الحالي" : "Current"}
                        </span>
                      )}
                    </div>
                    <p className="text-body-sm text-secondary mt-1">
                      {ar ? slot.modeAr : slot.modeEn}
                    </p>
                    <p className="text-label-sm text-on-surface-variant">
                      {ar ? slot.locationAr : slot.locationEn}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Encrypted Tele-Genetics Virtual Room Modal */}
      {virtualRoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-xl bg-primary text-on-primary border border-primary-container shadow-2xl overflow-hidden">
            <div className="p-4 bg-primary-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-secondary-container animate-pulse" />
                <span className="text-label-md">
                  {ar
                    ? "غرفة أبوظبي المرئية المشفرة (AES-256 E2EE)"
                    : "Abu Dhabi Sovereign Tele-Genetics Suite (AES-256 E2EE)"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setVirtualRoomOpen(false)}
                className="p-1 rounded-lg hover:bg-primary cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-8 flex flex-col items-center text-center space-y-5">
              <Image
                src="/images/reem-counseling.png"
                alt="Dr. Reem Al Hashimi"
                width={96}
                height={96}
                className="h-24 w-24 rounded-full object-cover border-2 border-secondary-container"
              />
              <div>
                <h3 className="text-headline-sm text-on-primary">
                  {ar
                    ? "غرفة الانتظار جاهزة لـ د. ريم الهاشمي"
                    : "Waiting Suite Ready with Dr. Reem Al Hashimi"}
                </h3>
                <p className="text-body-sm text-primary-fixed-dim mt-1">
                  {ar
                    ? "الموعد المجدول: " +
                      appointment.dateAr +
                      " · " +
                      appointment.timeAr
                    : `Scheduled Slot: ${appointment.dateEn} · ${appointment.timeEn}`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMicMuted((m) => !m)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-label-md cursor-pointer ${
                    micMuted
                      ? "bg-error text-on-error"
                      : "bg-primary-container text-on-primary"
                  }`}
                >
                  <span className="material-symbols-outlined !text-[18px]">
                    {micMuted ? "mic_off" : "mic"}
                  </span>
                  <span>{micMuted ? "Muted" : "Mic Ready"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCamOff((c) => !c)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-label-md cursor-pointer ${
                    camOff
                      ? "bg-error text-on-error"
                      : "bg-primary-container text-on-primary"
                  }`}
                >
                  <span className="material-symbols-outlined !text-[18px]">
                    {camOff ? "videocam_off" : "videocam"}
                  </span>
                  <span>{camOff ? "Camera Off" : "Camera Ready"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVirtualRoomOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full bg-secondary text-on-secondary px-5 py-2 text-label-md cursor-pointer"
                >
                  {ar ? "مغادرة المعاينة" : "Leave Preview"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
