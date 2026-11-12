"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useAmanGene } from "@/context/AmanGeneContext";

export default function PartnerConsentAuthorizationPage() {
  const router = useRouter();
  const {
    locale,
    partnerConsent,
    setPartnerConsentStatus,
    pushToast,
  } = useAmanGene();

  const ar = locale === "ar";
  const [ack1, setAck1] = useState(true);
  const [ack2, setAck2] = useState(true);
  const [ack3, setAck3] = useState(true);
  const [signing, setSigning] = useState(false);
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [declineNote, setDeclineNote] = useState("");

  const allChecked = ack1 && ack2 && ack3;

  const handleBiometricApprove = () => {
    if (!allChecked) {
      pushToast(
        ar
          ? "يرجى تأكيد جميع بنود الموافقة الثلاثة أولاً"
          : "Please confirm all three privacy acknowledgements before signing.",
        "warning"
      );
      return;
    }
    setSigning(true);
    window.setTimeout(() => {
      setPartnerConsentStatus(
        "authorized",
        "Sultan Al Zaabi (UAE PASS Biometric)",
        "سلطان الزعابي (الهوية الرقمية البيومترية)"
      );
      setSigning(false);
      pushToast(
        ar
          ? "تم التوقيع بنجاح وفتح مقارنة الشريك!"
          : "Biometric signature verified! Partner Comparison is now unlocked.",
        "success"
      );
    }, 650);
  };

  return (
    <AppShell variant="minimal">
      <div className="max-w-3xl mx-auto w-full px-4 md:px-8 py-8 space-y-6">
        {/* Sovereign Invitation Card */}
        <section className="rounded-xl bg-primary text-on-primary p-6 md:p-8 border border-primary-container space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/doh-emblem.png"
                alt="DoH Abu Dhabi"
                width={59}
                height={32}
                className="h-[32px] w-[59px] rounded-md bg-white p-0.5 object-contain"
              />
              <span className="rounded-full bg-secondary-container text-on-secondary-fixed px-3 py-0.5 text-label-sm font-semibold">
                {ar
                  ? "تفويض الشريك عبر الهوية الرقمية"
                  : "Reciprocal Partner UAE PASS Auth"}
              </span>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-label-sm ${
                partnerConsent === "authorized"
                  ? "bg-secondary text-on-secondary"
                  : partnerConsent === "declined"
                  ? "bg-error text-on-error"
                  : "bg-tertiary-fixed text-on-tertiary-fixed-variant"
              }`}
            >
              {partnerConsent === "authorized"
                ? ar
                  ? "تم التفويض بنجاح"
                  : "Authorized"
                : partnerConsent === "declined"
                ? ar
                  ? "متوقف مؤقتاً"
                  : "Declined / Paused"
                : ar
                ? "بانتظار توقيعك"
                : "Awaiting Signature"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center -space-x-3 rtl:space-x-reverse shrink-0">
              <Image
                src="/images/sultan-login.png"
                alt="Sultan Al Zaabi"
                width={58}
                height={58}
                className="h-14 w-14 rounded-full object-cover border-2 border-secondary-container"
              />
              <Image
                src="/images/fatima-login.png"
                alt="Fatima Al Mansoori"
                width={58}
                height={58}
                className="h-14 w-14 rounded-full object-cover border-2 border-primary"
              />
            </div>

            <div className="space-y-1">
              <h1 className="text-headline-md md:text-headline-lg text-on-primary">
                {ar
                  ? "مرحباً سلطان الزعابي"
                  : "Marhaba, Sultan Al Zaabi"}
              </h1>
              <p className="text-body-md text-primary-fixed-dim">
                {ar
                  ? "طلبت فاطمة المنصوري مشاركة نتيجة المقارنة المتبادلة لجينات الحامل المتنحية تحت إشراف دائرة الصحة – أبوظبي."
                  : "Fatima Al Mansoori has invited you to authorize an encrypted reciprocal autosomal-recessive carrier check overseen by DoH Abu Dhabi."}
              </p>
            </div>
          </div>
        </section>

        {/* Acknowledgements Form */}
        <section className="rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-6 space-y-5">
          <div className="space-y-1">
            <h2 className="text-headline-sm text-primary">
              {ar
                ? "نطاق الموافقة والضمانات السيادية"
                : "Sovereign Consent Scope & Safeguards"}
            </h2>
            <p className="text-body-sm text-on-surface-variant">
              {ar
                ? "راجع البنود التالية قبل اعتماد بصمة الهوية الرقمية الإماراتية."
                : "Confirm the boundaries below prior to signing with UAE PASS."}
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/50 cursor-pointer">
              <input
                id="consent-ack-1"
                name="consentAck1"
                type="checkbox"
                checked={ack1}
                onChange={() => setAck1((v) => !v)}
                className="mt-1 h-4 w-4 accent-secondary cursor-pointer"
              />
              <div className="text-body-sm">
                <p className="font-semibold text-primary">
                  {ar
                    ? "1. مقارنة التداخل الوراثي المتبادل فقط"
                    : "1. Strictly Reciprocal Shared-Carrier Check Only"}
                </p>
                <p className="text-on-surface-variant">
                  {ar
                    ? "تُحسب فقط علامات الجينات المتنحية المشتركة (مثل HBB) دون كشف أي متغيرات فردية غير مشتركة."
                    : "Only joint autosomal recessive carrier overlaps (e.g., HBB) are surfaced. Unpaired individual carrier variants remain private."}
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/50 cursor-pointer">
              <input
                id="consent-ack-2"
                name="consentAck2"
                type="checkbox"
                checked={ack2}
                onChange={() => setAck2((v) => !v)}
                className="mt-1 h-4 w-4 accent-secondary cursor-pointer"
              />
              <div className="text-body-sm">
                <p className="font-semibold text-primary">
                  {ar
                    ? "2. بقاء البيانات الخام داخل أبوظبي (PDPL)"
                    : "2. Raw Genomic Reads Never Leave Abu Dhabi (PDPL)"}
                </p>
                <p className="text-on-surface-variant">
                  {ar
                    ? "تحفظ ملفات التسلسل الخام مشفرة بموجب القانون الاتحادي 45 ويمكنك إلغاء التفويض في أي لحظة."
                    : "Raw VCF/FASTQ files remain encrypted inside UAE sovereign clouds; revocable instantly under Federal Decree-Law No. 45."}
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/50 cursor-pointer">
              <input
                id="consent-ack-3"
                name="consentAck3"
                type="checkbox"
                checked={ack3}
                onChange={() => setAck3((v) => !v)}
                className="mt-1 h-4 w-4 accent-secondary cursor-pointer"
              />
              <div className="text-body-sm">
                <p className="font-semibold text-primary">
                  {ar
                    ? "3. نموذج تعليمي بدون أي تقييم عددي للزواج"
                    : "3. Educational Summary Only — Zero Marriage Suitability Scoring"}
                </p>
                <p className="text-on-surface-variant">
                  {ar
                    ? "لا تصدر المنصة أي توصيات أو علامات قبول ورفض، وتُناقش النتائج مع د. ريم الهاشمي."
                    : "AmanGene AI issues zero compatibility scores or directives; results prepare your couple discussion with Dr. Reem Al Hashimi."}
                </p>
              </div>
            </label>
          </div>

          {/* Primary Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setConsultModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-label-md text-primary hover:bg-surface-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined !text-[18px]">
                support_agent
              </span>
              <span>
                {ar
                  ? "طلب استشارة سرية / إيقاف مؤقت"
                  : "Request Counselor Call / Decline"}
              </span>
            </button>

            <div className="flex flex-col sm:flex-row gap-2.5">
              {partnerConsent === "authorized" && (
                <button
                  type="button"
                  onClick={() => router.push("/partner-comparison")}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-on-primary px-5 py-3 text-label-md hover:bg-primary-container transition-colors cursor-pointer"
                >
                  <span>
                    {ar
                      ? "عرض المقارنة المفتوحة الآن"
                      : "Open Unlocked Comparison →"}
                  </span>
                </button>
              )}

              <button
                type="button"
                disabled={signing || !allChecked}
                onClick={handleBiometricApprove}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary text-on-secondary px-5 py-3 text-label-md font-semibold hover:bg-secondary/90 disabled:opacity-50 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined !text-[20px]">
                  {signing ? "progress_activity" : "fingerprint"}
                </span>
                <span>
                  {signing
                    ? ar
                      ? "جارٍ توثيق البصمة..."
                      : "Signing Biometric Token..."
                    : partnerConsent === "authorized"
                    ? ar
                      ? "تم التوقيع · إعادة تأكيد"
                      : "Signed · Re-Verify UAE PASS"
                    : ar
                    ? "اعتماد والتوقيع عبر الهوية الرقمية"
                    : "Authorize via UAE PASS Biometric"}
                </span>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-outline-variant/40 flex items-center justify-between text-label-sm text-on-surface-variant">
            <span>Token Ref: AMAN-PARTNER-8842-ABU</span>
            <Link
              href="/partner-comparison"
              className="text-secondary hover:underline"
            >
              {ar ? "العودة لمقارنة الشريك" : "Go to Partner Comparison →"}
            </Link>
          </div>
        </section>
      </div>

      {/* Private Counselor Consultation / Decline Modal */}
      {consultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/55 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-surface-container-lowest border border-outline-variant shadow-2xl p-6 space-y-4">
            <h3 className="text-headline-sm text-primary">
              {ar
                ? "استشارة فردية سرية أو إيقاف التفويض"
                : "Private Counselor Inquiry or Consent Pause"}
            </h3>
            <p className="text-body-sm text-on-surface-variant">
              {ar
                ? "يمكنك التحدث مع د. ريم الهاشمي بشكل فردي قبل فتح المقارنة، أو تعليق الدعوة دون إبداء أسباب طبية."
                : "You may request a confidential 1-on-1 call with Dr. Reem Al Hashimi prior to signing, or pause this request cleanly."}
            </p>
            <textarea
              id="partner-consult-note"
              name="partnerConsultNote"
              rows={3}
              value={declineNote}
              onChange={(e) => setDeclineNote(e.target.value)}
              placeholder={
                ar
                  ? "ملاحظة اختيارية لمنسقة الرعاية..."
                  : "Optional confidential note for the counseling desk..."
              }
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-3 text-body-sm text-on-surface focus:outline-none focus:border-secondary"
            />
            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setConsultModalOpen(false)}
                className="rounded-lg border border-outline-variant px-3.5 py-2 text-label-md text-on-surface hover:bg-surface-container cursor-pointer"
              >
                {ar ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPartnerConsentStatus(
                    "declined",
                    "Sultan Al Zaabi (Confidential Hold)",
                    "سلطان الزعابي (تعليق مؤقت)"
                  );
                  setConsultModalOpen(false);
                  pushToast(
                    ar
                      ? "تم تعليق المشاركة ووضع طلب تواصل سري مع د. ريم"
                      : "Comparison paused & private counselor callback scheduled.",
                    "info"
                  );
                }}
                className="rounded-lg bg-primary text-on-primary px-4 py-2 text-label-md cursor-pointer"
              >
                {ar ? "تعليق وطلب استشارة فردية" : "Pause & Request Callback"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
