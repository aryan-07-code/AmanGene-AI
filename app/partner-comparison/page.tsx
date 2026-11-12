"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AppShell } from "@/components/AppShell";
import { useAmanGene } from "@/context/AmanGeneContext";

export default function PartnerComparisonPage() {
  const {
    locale,
    partnerConsent,
    setPartnerConsentStatus,
    variants,
    pushToast,
  } = useAmanGene();

  const ar = locale === "ar";
  const [selectedGeneId, setSelectedGeneId] = useState<string>(
    variants[0]?.id ?? "var-hbb"
  );
  const [scopeDrawerOpen, setScopeDrawerOpen] = useState(false);

  const selectedVariant =
    variants.find((v) => v.id === selectedGeneId) ?? variants[0];

  const punnettCells = selectedVariant.sharedCarrier
    ? [
        {
          id: "c1",
          maternal: "HBB (Var)",
          paternal: "HBB (Var)",
          outcomeEn: "25% · Both Variants Inherited",
          outcomeAr: "25% · وراثة نسختين (ينصح بالاستشارة)",
          tone: "high" as const,
        },
        {
          id: "c2",
          maternal: "HBB (Var)",
          paternal: "HBB (Ref)",
          outcomeEn: "25% · Asymptomatic Carrier",
          outcomeAr: "25% · حامل بدون أعراض",
          tone: "carrier" as const,
        },
        {
          id: "c3",
          maternal: "HBB (Ref)",
          paternal: "HBB (Var)",
          outcomeEn: "25% · Asymptomatic Carrier",
          outcomeAr: "25% · حامل بدون أعراض",
          tone: "carrier" as const,
        },
        {
          id: "c4",
          maternal: "HBB (Ref)",
          paternal: "HBB (Ref)",
          outcomeEn: "25% · Non-Carrier Reference",
          outcomeAr: "25% · غير حامل للمتغير",
          tone: "clear" as const,
        },
      ]
    : [
        {
          id: "u1",
          maternal: `${selectedVariant.gene} (Var)`,
          paternal: `${selectedVariant.gene} (Ref)`,
          outcomeEn: "50% · Single-Copy Carrier",
          outcomeAr: "50% · حامل لنسخة واحدة",
          tone: "carrier" as const,
        },
        {
          id: "u2",
          maternal: `${selectedVariant.gene} (Ref)`,
          paternal: `${selectedVariant.gene} (Ref)`,
          outcomeEn: "50% · Reference Genotype",
          outcomeAr: "50% · تركيب مرجعي سليم",
          tone: "clear" as const,
        },
      ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top State & Sovereign Bar */}
        <section className="rounded-xl bg-primary text-on-primary p-6 border border-primary-container flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-secondary-container text-on-secondary-fixed px-3 py-0.5 text-label-sm">
                {ar
                  ? "مقارنة صفرية المعرفة (Zero-Knowledge)"
                  : "Zero-Knowledge Reciprocal Enclave"}
              </span>
              <span
                className={`rounded-full px-3 py-0.5 text-label-sm ${
                  partnerConsent === "authorized"
                    ? "bg-secondary text-on-secondary"
                    : "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                }`}
              >
                {partnerConsent === "authorized"
                  ? ar
                    ? "مفتوح بموافقة سلطان"
                    : "Unlocked · Sultan Signed"
                  : partnerConsent === "declined"
                  ? ar
                    ? "تم تعليق الموافقة"
                    : "Consent Paused"
                  : ar
                  ? "مقفل — بانتظار توقيع الشريك"
                  : "Locked · Awaiting Sultan"}
              </span>
            </div>
            <h1 className="text-headline-lg-mobile md:text-headline-lg text-on-primary">
              {ar
                ? "مقارنة الحامل الوراثي المتبادلة للشريكين"
                : "Reciprocal Partner Carrier Comparison"}
            </h1>
            <p className="text-body-md text-primary-fixed-dim">
              {ar
                ? "لا تعرض هذه المساحة أي تقييم رقمي للزواج؛ تُعرض فقط نتائج التداخل التعليمي المندلي بعد توقيع الطرفين."
                : "Displays strictly educational Mendelian overlap after mutual UAE PASS signatures — zero suitability scoring or algorithmic directives."}
            </p>
          </div>

          {/* Demo State Toggle & Sovereign Scope Drawer Trigger */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setScopeDrawerOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-container border border-on-primary-container/40 px-4 py-2.5 text-label-md text-on-primary hover:bg-primary-container/80 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined !text-[18px]">
                shield_lock
              </span>
              <span>{ar ? "نطاق الخزينة السيادية" : "Sovereign Scope"}</span>
            </button>

            <div className="inline-flex rounded-lg bg-primary-container p-1 border border-on-primary-container/30">
              <button
                type="button"
                onClick={() => {
                  setPartnerConsentStatus("authorized");
                  pushToast(
                    ar
                      ? "تم فتح مقارنة الشريك (حالة مصرح بها)"
                      : "Switched to Authorized Reciprocal View",
                    "success"
                  );
                }}
                className={`px-3 py-1.5 rounded-md text-label-sm transition-colors cursor-pointer ${
                  partnerConsent === "authorized"
                    ? "bg-secondary text-on-secondary"
                    : "text-primary-fixed-dim hover:text-on-primary"
                }`}
              >
                {ar ? "مصرح" : "Authorized"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPartnerConsentStatus("pending");
                  pushToast(
                    ar
                      ? "تم قفل العرض لمحاكاة انتظار موافقة الشريك"
                      : "Switched to Locked Sovereign Enclave View",
                    "info"
                  );
                }}
                className={`px-3 py-1.5 rounded-md text-label-sm transition-colors cursor-pointer ${
                  partnerConsent !== "authorized"
                    ? "bg-tertiary-fixed text-on-tertiary-fixed"
                    : "text-primary-fixed-dim hover:text-on-primary"
                }`}
              >
                {ar ? "مقفل" : "Locked"}
              </button>
            </div>
          </div>
        </section>

        {/* Partner Bridge Header */}
        <section className="rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="flex items-center gap-3">
            <Image
              src="/images/fatima-overview.png"
              alt="Fatima Al Mansoori"
              width={52}
              height={52}
              className="h-13 w-13 rounded-full object-cover border-2 border-secondary"
            />
            <div>
              <p className="text-title-md text-primary">
                {ar ? "فاطمة المنصوري" : "Fatima Al Mansoori"}
              </p>
              <p className="text-body-sm text-secondary">
                {ar ? "التفويض الأول موقع" : "Proband · UAE PASS Verified"}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center text-center py-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-surface-container px-4 py-1.5 border border-outline-variant/60">
              <span className="material-symbols-outlined text-secondary !text-[18px]">
                {partnerConsent === "authorized" ? "sync_lock" : "lock"}
              </span>
              <span className="text-label-md text-primary">
                {partnerConsent === "authorized"
                  ? ar
                    ? "تقاطع متبادل نشط"
                    : "Mutual Enclave Verified"
                  : ar
                  ? "بانتظار مفتاح الشريك"
                  : "Awaiting Partner Key"}
              </span>
            </div>
            <p className="text-label-sm text-on-surface-variant mt-1.5">
              {ar
                ? "بإشراف: د. ريم الهاشمي"
                : "Clinician Overseer: Dr. Reem Al Hashimi"}
            </p>
          </div>

          <div className="flex items-center gap-3 md:justify-end">
            <div className="md:text-end">
              <p className="text-title-md text-primary">
                {ar ? "سلطان الزعابي" : "Sultan Al Zaabi"}
              </p>
              <p
                className={`text-body-sm ${
                  partnerConsent === "authorized"
                    ? "text-secondary"
                    : "text-on-tertiary-fixed-variant"
                }`}
              >
                {partnerConsent === "authorized"
                  ? ar
                    ? "تم التفويض المتبادل"
                    : "Counterparty · Signed"
                  : partnerConsent === "declined"
                  ? ar
                    ? "تم إيقاف الموافقة"
                    : "Declined / Paused"
                  : ar
                  ? "بانتظار الهوية الرقمية"
                  : "Pending UAE PASS"}
              </p>
            </div>
            <Image
              src="/images/sultan-login.png"
              alt="Sultan Al Zaabi"
              width={52}
              height={52}
              className="h-13 w-13 rounded-full object-cover border-2 border-outline-variant"
            />
          </div>
        </section>

        {/* LOCKED ENCLAVE STATE (Screens 07 & 09) */}
        {partnerConsent !== "authorized" ? (
          <section className="rounded-xl bg-surface-container-lowest border border-tertiary-fixed-dim/70 p-6 md:p-10 text-center space-y-6">
            <div className="mx-auto h-16 w-16 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center">
              <span className="material-symbols-outlined !text-[34px]">
                enhanced_encryption
              </span>
            </div>

            <div className="max-w-xl mx-auto space-y-2">
              <span className="rounded-full bg-tertiary-fixed px-3 py-1 text-label-sm text-on-tertiary-fixed-variant">
                {ar
                  ? "درع الخصوصية السيادي مفعّل"
                  : "Redacted Zero-Knowledge Enclave Shield"}
              </span>
              <h2 className="text-headline-md text-primary pt-1">
                {partnerConsent === "declined"
                  ? ar
                    ? "تم تعليق مشاركة المقارنة بناءً على طلب الخصوصية"
                    : "Partner Comparison Paused by Consent Governance"
                  : ar
                  ? "بانتظار توقيع سلطان الزعابي عبر الهوية الرقمية"
                  : "Waiting for Sultan Al Zaabi's Reciprocal Signature"}
              </h2>
              <p className="text-body-md text-on-surface-variant">
                {ar
                  ? "حرصاً على خصوصية البيانات الجينية بموجب القانون الاتحادي 45، تبقى جميع مؤشرات المقارنة محجوبة حتى يوقّع الشريك دعوة التفويض."
                  : "In compliance with UAE PDPL Decree-Law No. 45, counterparty carrier flags remain cryptographically redacted until Sultan completes biometric sign-off."}
              </p>
            </div>

            {/* Redacted Placeholder Grid */}
            <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 text-start">
              {variants.slice(0, 4).map((v) => (
                <div
                  key={v.id}
                  className="rounded-xl bg-surface-container-low border border-outline-variant/50 p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-mono font-bold text-primary">{v.gene}</p>
                    <p className="text-body-sm text-on-surface-variant">
                      {ar ? v.conditionAr : v.conditionEn}
                    </p>
                  </div>
                  <span className="rounded-full bg-surface-dim px-3 py-1 text-code-sm text-on-surface-variant">
                    [REDACTED]
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/partner-ping"
                className="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2.5 text-label-md text-primary hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined !text-[18px]">
                  sms
                </span>
                <span>
                  {ar
                    ? "معاينة إشعار واتساب / SMS للشريك"
                    : "Preview WhatsApp / SMS Ping"}
                </span>
              </Link>
              <Link
                href="/partner-consent"
                className="inline-flex items-center gap-2 rounded-lg bg-secondary text-on-secondary px-5 py-2.5 text-label-md font-semibold hover:bg-secondary/90 transition-colors"
              >
                <span className="material-symbols-outlined !text-[18px]">
                  fingerprint
                </span>
                <span>
                  {ar
                    ? "الانتقال لبوابة تفويض سلطان"
                    : "Open Sultan Authorization Portal"}
                </span>
              </Link>
            </div>
          </section>
        ) : (
          /* AUTHORIZED COMPARISON MATRIX (Screen 06) */
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 5 columns: Gene Overlap Selector */}
            <div className="lg:col-span-5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-5 space-y-4">
              <div>
                <h2 className="text-headline-sm text-primary">
                  {ar
                    ? "مصفوفة الجينات المفحوصة"
                    : "Evaluated Carrier Panel Overlap"}
                </h2>
                <p className="text-body-sm text-on-surface-variant">
                  {ar
                    ? "اختر جيناً لاستعراض نموذج الوراثة المندلي التعليمي."
                    : "Select a gene locus to explore its educational Mendelian matrix."}
                </p>
              </div>

              <div className="space-y-2.5">
                {variants.slice(0, 4).map((v) => {
                  const active = selectedVariant.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedGeneId(v.id)}
                      className={`w-full text-start p-4 rounded-xl border transition-all cursor-pointer ${
                        active
                          ? "bg-primary text-on-primary border-primary shadow-sm"
                          : "bg-surface-container-low/70 border-outline-variant/50 hover:border-secondary"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono font-bold text-title-md">
                          {v.gene}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-label-sm ${
                            v.sharedCarrier
                              ? active
                                ? "bg-tertiary-fixed text-on-tertiary-fixed"
                                : "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                              : active
                              ? "bg-secondary text-on-secondary"
                              : "bg-secondary-container text-on-secondary-fixed"
                          }`}
                        >
                          {v.sharedCarrier
                            ? ar
                              ? "حامل مشترك"
                              : "Shared Overlap"
                            : ar
                            ? "غير مشترك"
                            : "Unpaired"}
                        </span>
                      </div>
                      <p
                        className={`text-body-sm mt-1 ${
                          active
                            ? "text-primary-fixed-dim"
                            : "text-on-surface-variant"
                        }`}
                      >
                        {ar ? v.conditionAr : v.conditionEn}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right 7 columns: Interactive Mendelian Punnett Matrix */}
            <div className="lg:col-span-7 rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-6 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-outline-variant/50">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-headline-md text-primary font-mono">
                      {selectedVariant.gene}
                    </h2>
                    <span className="text-code-sm text-secondary">
                      {selectedVariant.hgvsC}
                    </span>
                  </div>
                  <p className="text-body-md text-on-surface-variant mt-0.5">
                    {ar
                      ? selectedVariant.conditionAr
                      : selectedVariant.conditionEn}{" "}
                    ·{" "}
                    {ar
                      ? selectedVariant.inheritanceAr
                      : selectedVariant.inheritanceEn}
                  </p>
                </div>

                <Link
                  href="/counseling-journey"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-secondary text-on-secondary px-3.5 py-2 text-label-md hover:bg-secondary/90 transition-colors"
                >
                  <span className="material-symbols-outlined !text-[18px]">
                    clinical_notes
                  </span>
                  <span>
                    {ar ? "مناقشة مع د. ريم" : "Discuss with Dr. Reem"}
                  </span>
                </Link>
              </div>

              {/* Educational Outcome Bars */}
              <div className="space-y-3">
                <p className="text-label-md uppercase text-primary">
                  {ar
                    ? "توزيع الاحتمالات المندلية (نموذج تعليمي بحت)"
                    : "Mendelian Inheritance Distribution (Educational Illustration)"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {punnettCells.map((cell) => (
                    <div
                      key={cell.id}
                      className={`rounded-xl p-4 border ${
                        cell.tone === "high"
                          ? "bg-tertiary-fixed/55 border-tertiary-fixed-dim text-on-tertiary-fixed"
                          : cell.tone === "carrier"
                          ? "bg-secondary-container/40 border-secondary/30 text-on-secondary-fixed"
                          : "bg-surface-container-low border-outline-variant/50 text-on-surface"
                      }`}
                    >
                      <div className="flex items-center justify-between text-code-sm opacity-80">
                        <span>♀ {cell.maternal}</span>
                        <span>♂ {cell.paternal}</span>
                      </div>
                      <p className="text-title-md mt-2">
                        {ar ? cell.outcomeAr : cell.outcomeEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guidance Note with Dr. Reem */}
              <div className="rounded-xl bg-surface-container-low border border-outline-variant/50 p-4 flex items-start gap-3.5">
                <Image
                  src="/images/reem-partner.png"
                  alt="Dr. Reem Al Hashimi"
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full object-cover shrink-0 border border-secondary/40"
                />
                <div className="space-y-1 text-body-sm">
                  <p className="font-semibold text-primary">
                    {ar
                      ? "ملاحظة استشارية: د. ريم الهاشمي"
                      : "Counselor Perspective · Dr. Reem Al Hashimi"}
                  </p>
                  <p className="text-on-surface-variant">
                    {selectedVariant.sharedCarrier
                      ? ar
                        ? "وجود صفة الحامل المشتركة في HBB أمر شائع في المنطقة ولا يعني أي مانع؛ تُعقد الجلسة لمناقشة الفحوصات التأكيدية والخيارات الوقائية الحديثة."
                        : "Shared HBB carrier status is common regionally and is strictly an informational finding; your session reviews confirmatory testing and modern preventive options."
                      : ar
                      ? "نظراً لأن الشريك غير حامل لهذا المتغير المتنحي، ينعدم احتمال وراثة نسختين ممرضتين لهذا الجين تحديداً."
                      : "Because your partner carries the reference sequence for this locus, paired dual-allele inheritance is not elevated for this gene."}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Sovereign Scope Slide-Over Drawer */}
      {scopeDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-primary/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-surface-container-lowest h-full border-s border-outline-variant p-6 flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-outline-variant/50 pb-4">
                <h3 className="text-headline-sm text-primary">
                  {ar
                    ? "حدود المشاركة الصفرية في الخزينة"
                    : "Sovereign Zero-Knowledge Boundaries"}
                </h3>
                <button
                  type="button"
                  onClick={() => setScopeDrawerOpen(false)}
                  className="p-1 rounded-lg hover:bg-surface-container cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-3 text-body-sm">
                <div className="rounded-xl bg-secondary-container/35 border border-secondary/30 p-4">
                  <p className="font-semibold text-secondary mb-1">
                    {ar ? "المُشارك حالياً فقط" : "Exclusively Computed"}
                  </p>
                  <p className="text-on-surface">
                    {ar
                      ? "علامة التداخل المشترك للمتغيرات المتنحية (Shared Recessive Gene Flag) مثل HBB."
                      : "Joint autosomal recessive gene overlap status (e.g., shared HBB flag) inside Abu Dhabi enclave."}
                  </p>
                </div>

                <div className="rounded-xl bg-surface-container-low border border-outline-variant/50 p-4">
                  <p className="font-semibold text-primary mb-1">
                    {ar
                      ? "محجوب تماماً عن الشريك"
                      : "Cryptographically Shielded from Counterparty"}
                  </p>
                  <ul className="list-disc ps-5 space-y-1 text-on-surface-variant">
                    <li>
                      {ar
                        ? "ملفات FASTQ / VCF الخام"
                        : "Raw FASTQ / VCF nucleotide sequence files"}
                    </li>
                    <li>
                      {ar
                        ? "المتغيرات الفردية غير المشتركة دون إذن مستقل"
                        : "Unpaired personal traits or pharmacogenomic findings"}
                    </li>
                    <li>
                      {ar
                        ? "أي وصول لشركات التأمين أو جهات العمل"
                        : "Third-party insurer, employer, or non-clinical queries"}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/50 flex justify-end gap-2">
              <Link
                href="/consent-privacy"
                className="rounded-lg border border-outline-variant px-4 py-2 text-label-md text-primary hover:bg-surface-container"
              >
                {ar ? "تعديل النطاقات" : "Edit Consent Scopes"}
              </Link>
              <button
                type="button"
                onClick={() => setScopeDrawerOpen(false)}
                className="rounded-lg bg-primary text-on-primary px-4 py-2 text-label-md cursor-pointer"
              >
                {ar ? "إغلاق" : "Done"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
