"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AppShell } from "@/components/AppShell";
import { useAmanGene } from "@/context/AmanGeneContext";
import { UI_COPY } from "@/lib/amangene-data";

export default function OverviewDashboardPage() {
  const {
    locale,
    activePersona,
    partnerConsent,
    consentScopes,
    variants,
    auditLog,
    appointment,
    reflectionChecks,
  } = useAmanGene();

  const ar = locale === "ar";
  const t = UI_COPY[locale];

  const enabledScopesCount = consentScopes.filter((s) => s.enabled).length;
  const completedChecksCount = reflectionChecks.filter((c) => c.checked).length;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Hero Clinical Greeting Banner */}
        <section className="rounded-xl bg-primary text-on-primary p-6 md:p-8 shadow-sm border border-primary-container relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-container text-on-secondary-fixed px-3 py-1 text-label-sm uppercase">
                  <span className="material-symbols-outlined !text-[15px]">
                    verified_user
                  </span>
                  {ar
                    ? "مصادقة الهوية الرقمية UAE PASS نشطة"
                    : "UAE PASS Sovereign Session Verified"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-container text-primary-fixed px-3 py-1 text-label-sm">
                  <span className="material-symbols-outlined !text-[15px]">
                    shield_lock
                  </span>
                  {ar
                    ? "ميثاق عدم تقييم الزواج رقمياً"
                    : "Zero Marriage Compatibility Scoring"}
                </span>
              </div>

              <div>
                <h1 className="text-headline-lg-mobile md:text-headline-lg text-on-primary">
                  {ar
                    ? `مرحباً، ${activePersona.nameAr}`
                    : `Marhaba, ${activePersona.nameEn}`}
                </h1>
                <p className="text-body-lg text-primary-fixed-dim mt-2 max-w-2xl">
                  {ar
                    ? "بوابتك السيادية لمراجعة نتائج الفحص الجيني قبل الزواج، وإدارة نطاقات الخصوصية، وفهم احتمالات الوراثة المندلية بإشراف استشاريين مرخصين."
                    : "Your sovereign Abu Dhabi workspace for premarital carrier education, zero-knowledge partner comparison, and clinician-guided genetic counseling."}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="/genetic-screening"
                  className="inline-flex items-center gap-2 rounded-lg bg-secondary text-on-secondary px-4 py-2.5 text-label-md hover:bg-secondary/90 transition-colors"
                >
                  <span className="material-symbols-outlined !text-[18px]">
                    genetics
                  </span>
                  <span>
                    {ar ? "استعراض المتغيرات الجينية" : "Inspect Genomic Variants"}
                  </span>
                </Link>
                <Link
                  href="/partner-comparison"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-container border border-on-primary-container/40 text-on-primary px-4 py-2.5 text-label-md hover:bg-primary-container/80 transition-colors"
                >
                  <span className="material-symbols-outlined !text-[18px]">
                    diversity_2
                  </span>
                  <span>
                    {ar ? "مقارنة الشريك المتبادلة" : "Partner Comparison Enclave"}
                  </span>
                </Link>
              </div>
            </div>

            {/* Proband & Facility Identity Card */}
            <div className="lg:col-span-4 rounded-xl bg-primary-container/80 border border-on-primary-container/30 p-5 space-y-4">
              <div className="flex items-center gap-3.5">
                <Image
                  src={activePersona.avatarMain}
                  alt={activePersona.nameEn}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover border-2 border-secondary-container"
                />
                <div className="min-w-0">
                  <p className="text-title-md text-on-primary truncate">
                    {ar ? activePersona.nameAr : activePersona.nameEn}
                  </p>
                  <p className="text-body-sm text-secondary-fixed truncate">
                    {ar ? activePersona.roleAr : activePersona.roleEn}
                  </p>
                  <p
                    dir="ltr"
                    className="text-code-sm text-primary-fixed-dim mt-0.5 inline-block"
                  >
                    {activePersona.emiratesIdMasked}
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-on-primary-container/25 flex items-center justify-between gap-3 text-body-sm">
                <span className="text-primary-fixed-dim shrink-0 whitespace-nowrap">
                  {ar ? "الجهة المرجعية" : "Sovereign Node"}
                </span>
                <span className="font-medium text-on-primary text-end">
                  {ar ? activePersona.facilityAr : activePersona.facilityEn}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Status KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <Link
            href="/genetic-screening"
            className="group rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-5 hover:border-secondary transition-colors shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="h-10 w-10 rounded-lg bg-secondary-container text-on-secondary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined">genetics</span>
              </span>
              <span className="rounded-full bg-surface-container px-2.5 py-0.5 text-label-sm text-primary">
                ACMG Curated
              </span>
            </div>
            <p className="text-headline-md text-primary mt-4">
              {variants.length} {ar ? "متغيرات مصنفة" : "Carrier Findings"}
            </p>
            <p className="text-body-sm text-on-surface-variant mt-1">
              {ar
                ? "HBB، G6PD، MEFV، PKHD1 · عرض الأدلة"
                : "HBB, G6PD, MEFV, PKHD1 · Evidence Vault"}
            </p>
          </Link>

          <Link
            href="/partner-comparison"
            className="group rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-5 hover:border-secondary transition-colors shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="h-10 w-10 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined">diversity_2</span>
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-label-sm ${
                  partnerConsent === "authorized"
                    ? "bg-secondary-container text-on-secondary-fixed"
                    : partnerConsent === "declined"
                    ? "bg-error-container text-on-error-container"
                    : "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                }`}
              >
                {partnerConsent === "authorized"
                  ? ar
                    ? "مصرح به"
                    : "Authorized"
                  : partnerConsent === "declined"
                  ? ar
                    ? "متوقف"
                    : "Paused"
                  : ar
                  ? "بانتظار الشريك"
                  : "Pending"}
              </span>
            </div>
            <p className="text-headline-md text-primary mt-4">
              {partnerConsent === "authorized"
                ? ar
                  ? "تداخل واحد مشترك"
                  : "1 Shared Carrier Gene"
                : ar
                ? "المقارنة مقفلة حالياً"
                : "Enclave Locked"}
            </p>
            <p className="text-body-sm text-on-surface-variant mt-1">
              {partnerConsent === "authorized"
                ? ar
                  ? "الشريك: سلطان الزعابي · HBB مشترك"
                  : "Partner: Sultan Al Zaabi · HBB overlap"
                : ar
                ? "يتطلب توقيع سلطان عبر الهوية الرقمية"
                : "Requires Sultan's reciprocal UAE PASS"}
            </p>
          </Link>

          <Link
            href="/consent-privacy"
            className="group rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-5 hover:border-secondary transition-colors shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="h-10 w-10 rounded-lg bg-secondary-container/70 text-on-secondary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined">shield_person</span>
              </span>
              <span className="rounded-full bg-surface-container px-2.5 py-0.5 text-label-sm text-secondary">
                PDPL · ADHICS
              </span>
            </div>
            <p className="text-headline-md text-primary mt-4">
              {enabledScopesCount} / {consentScopes.length}{" "}
              {ar ? "نطاقات مفعلة" : "Scopes Active"}
            </p>
            <p className="text-body-sm text-on-surface-variant mt-1">
              {ar
                ? "تحكم فوري بسجل تدقيق مشفر SHA-256"
                : "Granular consent with SHA-256 ledger"}
            </p>
          </Link>

          <Link
            href="/counseling-journey"
            className="group rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-5 hover:border-secondary transition-colors shadow-xs"
          >
            <div className="flex items-center justify-between">
              <Image
                src="/images/reem-overview.png"
                alt="Dr. Reem Al Hashimi"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover border border-outline-variant"
              />
              <span className="rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant px-2.5 py-0.5 text-label-sm">
                {completedChecksCount}/{reflectionChecks.length}{" "}
                {ar ? "جاهزية" : "Ready"}
              </span>
            </div>
            <p className="text-headline-md text-primary mt-4">
              {ar ? appointment.dateAr : appointment.dateEn}
            </p>
            <p className="text-body-sm text-on-surface-variant mt-1">
              {ar
                ? "د. ريم الهاشمي · استشارة وراثية مرئية"
                : "Dr. Reem Al Hashimi · Tele-Genetics"}
            </p>
          </Link>
        </section>

        {/* Asymmetric Clinical Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 columns: Curated Variant Snapshot */}
          <section className="lg:col-span-7 rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-headline-sm text-primary">
                  {ar
                    ? "ملخص نتائج الحامل الوراثي المعتمدة"
                    : "Curated Premarital Carrier Summary"}
                </h2>
                <p className="text-body-sm text-on-surface-variant">
                  {ar
                    ? "مراجعة تعليمية وفق تصنيف ACMG/AMP دون أي مؤشرات توافق رقمية."
                    : "Educational ACMG/AMP carrier review scoped to clinical counseling."}
                </p>
              </div>
              <Link
                href="/genetic-screening"
                className="inline-flex items-center gap-1 text-label-md text-secondary hover:underline"
              >
                <span>{ar ? "عرض الكل" : "Open Full Inspector"}</span>
                <span className="material-symbols-outlined !text-[16px] rtl:rotate-180">
                  arrow_forward
                </span>
              </Link>
            </div>

            <div className="space-y-3">
              {variants.slice(0, 4).map((v) => (
                <Link
                  key={v.id}
                  href={`/genetic-screening?gene=${v.gene}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/40 hover:border-secondary hover:bg-surface-container transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-primary text-title-md">
                        {v.gene}
                      </span>
                      <span className="text-code-sm rounded-md bg-surface-container-lowest px-2 py-0.5 border border-outline-variant/50 text-on-surface-variant">
                        {v.hgvsC}
                      </span>
                      {v.sharedCarrier && partnerConsent === "authorized" && (
                        <span className="rounded-full bg-tertiary-fixed px-2.5 py-0.5 text-label-sm text-on-tertiary-fixed-variant">
                          {ar ? "تداخل مشترك مع الشريك" : "Shared Partner Carrier"}
                        </span>
                      )}
                    </div>
                    <p className="text-body-md font-medium text-on-surface">
                      {ar ? v.conditionAr : v.conditionEn}
                    </p>
                    <p className="text-body-sm text-on-surface-variant">
                      {ar ? v.inheritanceAr : v.inheritanceEn} ·{" "}
                      {ar ? v.zygosityAr : v.zygosityEn}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="rounded-full bg-secondary-container text-on-secondary-fixed px-3 py-1 text-label-sm">
                      {v.acmgClass}
                    </span>
                    <span className="material-symbols-outlined text-on-surface-variant rtl:rotate-180">
                      chevron_right
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Regulatory Notice Strip */}
            <div className="rounded-xl bg-tertiary-fixed/45 border border-tertiary-fixed-dim/50 p-4 flex items-start gap-3">
              <span className="material-symbols-outlined text-on-tertiary-fixed-variant mt-0.5">
                gavel
              </span>
              <div className="text-body-sm text-on-tertiary-fixed">
                <p className="font-semibold">{t.ethicsNotice}</p>
                <p className="mt-0.5 text-on-tertiary-fixed-variant">
                  {ar
                    ? "تلتزم منصة أمان جين بحظر التقييم الآلي لملاءمة الزواج؛ تُعرض الاحتمالات المندلية للتثقيف الصحي والتحضير لجلسة الاستشارة."
                    : "AmanGene AI prohibits automated marriage suitability scoring. Probabilities strictly illustrate educational Mendelian patterns ahead of counselor consultation."}
                </p>
              </div>
            </div>
          </section>

          {/* Right 5 columns: Reciprocal Partner Bridge & Recent Audit */}
          <div className="lg:col-span-5 space-y-6">
            {/* Reciprocal Partner Card */}
            <section className="rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-headline-sm text-primary">
                  {ar
                    ? "المقارنة المتبادلة للشريكين"
                    : "Reciprocal Partner Bridge"}
                </h2>
                <Link
                  href="/partner-ping"
                  className="text-label-sm text-secondary hover:underline"
                >
                  {ar ? "محاكاة التنبيه" : "Simulate Ping →"}
                </Link>
              </div>

              <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/40">
                <div className="flex items-center gap-2.5">
                  <Image
                    src="/images/fatima-overview.png"
                    alt="Fatima Al Mansoori"
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full object-cover border border-secondary/40"
                  />
                  <div>
                    <p className="text-body-sm font-semibold text-primary">
                      {ar ? "فاطمة المنصوري" : "Fatima Al Mansoori"}
                    </p>
                    <p className="text-label-sm text-secondary">
                      {ar ? "موافقة موقعة" : "Proband Active"}
                    </p>
                  </div>
                </div>

                <span className="material-symbols-outlined text-secondary">
                  {partnerConsent === "authorized" ? "sync_lock" : "lock"}
                </span>

                <div className="flex items-center gap-2.5 text-end">
                  <div>
                    <p className="text-body-sm font-semibold text-primary">
                      {ar ? "سلطان الزعابي" : "Sultan Al Zaabi"}
                    </p>
                    <p
                      className={`text-label-sm ${
                        partnerConsent === "authorized"
                          ? "text-secondary"
                          : "text-on-tertiary-fixed-variant"
                      }`}
                    >
                      {partnerConsent === "authorized"
                        ? ar
                          ? "تفويض متبادل مفعل"
                          : "UAE PASS Signed"
                        : ar
                        ? "بانتظار التفويض"
                        : "Pending Auth"}
                    </p>
                  </div>
                  <Image
                    src="/images/sultan-login.png"
                    alt="Sultan Al Zaabi"
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full object-cover border border-outline-variant"
                  />
                </div>
              </div>

              {partnerConsent === "authorized" ? (
                <div className="rounded-xl bg-secondary-container/35 border border-secondary/25 p-4 space-y-2">
                  <p className="text-label-md text-secondary font-semibold">
                    {ar
                      ? "تم رصد جين متنحٍ مشترك واحد: HBB (الثلاسيميا بيتا)"
                      : "1 Joint Autosomal Recessive Overlap: HBB"}
                  </p>
                  <p className="text-body-sm text-on-surface-variant">
                    {ar
                      ? "الاحتمال المندلي التثقيفي: 25% وراثة نسختين، 50% حامل غير مصاب، 25% غير حامل."
                      : "Mendelian overview: 25% dual-allele inheritance, 50% carrier trait, 25% non-carrier."}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl bg-tertiary-fixed/40 border border-tertiary-fixed-dim/50 p-4 space-y-2">
                  <p className="text-label-md text-on-tertiary-fixed font-semibold">
                    {ar
                      ? "نتائج الشريك محجوبة داخل الخزينة المشفرة"
                      : "Partner Alleles Masked in Zero-Knowledge Enclave"}
                  </p>
                  <p className="text-body-sm text-on-tertiary-fixed-variant">
                    {ar
                      ? "افتح بوابة تفويض الشريك لتوقيع موافقة سلطان وإظهار المقارنة."
                      : "Complete Sultan's UAE PASS authorization flow to unlock joint summary."}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/partner-comparison"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary text-on-primary px-3 py-2 text-label-md hover:bg-primary-container transition-colors"
                >
                  <span>{ar ? "فتح المقارنة" : "View Matrix"}</span>
                </Link>
                <Link
                  href="/partner-consent"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-primary px-3 py-2 text-label-md hover:bg-surface-container transition-colors"
                >
                  <span>{ar ? "بوابة سلطان" : "Sultan Portal"}</span>
                </Link>
              </div>
            </section>

            {/* Recent Cryptographic Audit Log */}
            <section className="rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-headline-sm text-primary">
                  {ar ? "سجل التدقيق السيادي" : "Sovereign Audit Ledger"}
                </h2>
                <Link
                  href="/consent-privacy"
                  className="text-label-sm text-secondary hover:underline"
                >
                  {ar ? "إدارة الخصوصية" : "Manage Privacy →"}
                </Link>
              </div>

              <div className="space-y-2.5">
                {auditLog.slice(0, 3).map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 rounded-lg bg-surface-container-low/60 border border-outline-variant/40 text-body-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-primary truncate">
                        {ar ? entry.actorAr : entry.actorEn}
                      </span>
                      <span className="text-code-sm text-secondary">
                        {entry.hash}
                      </span>
                    </div>
                    <p className="text-on-surface-variant mt-0.5">
                      {ar ? entry.actionAr : entry.actionEn}
                    </p>
                    <p className="text-label-sm text-outline mt-1">
                      {entry.timestamp} · {entry.scopeCode}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
