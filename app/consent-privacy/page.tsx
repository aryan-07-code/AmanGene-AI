"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAmanGene } from "@/context/AmanGeneContext";

export default function ConsentPrivacyPage() {
  const {
    locale,
    consentScopes,
    toggleConsentScope,
    revokeAllConsents,
    restoreDefaultConsents,
    auditLog,
    pushToast,
  } = useAmanGene();

  const ar = locale === "ar";
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);

  const activeCount = consentScopes.filter((s) => s.enabled).length;

  const handleExportSealedReceipt = () => {
    const receipt = {
      documentType: "AmanGene Sovereign PDPL Consent Receipt",
      jurisdiction: "Abu Dhabi Department of Health · ADHICS v2.0",
      exportedAt: new Date().toISOString(),
      activeScopesCount: activeCount,
      scopes: consentScopes.map((s) => ({
        code: s.code,
        title: s.titleEn,
        enabled: s.enabled,
        regulation: s.regulationEn,
      })),
      recentLedgerHashes: auditLog.slice(0, 6).map((a) => ({
        timestamp: a.timestamp,
        action: a.actionEn,
        hash: a.hash,
        status: a.status,
      })),
    };
    const blob = new Blob([JSON.stringify(receipt, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "amangene-sealed-consent-receipt.json";
    link.click();
    URL.revokeObjectURL(url);
    pushToast(
      ar
        ? "تم تنزيل إيصال الموافقة المشفر بصيغة JSON"
        : "Exported sealed cryptographic consent receipt.",
      "success"
    );
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Sovereign Privacy Header */}
        <section className="rounded-xl bg-primary text-on-primary p-6 md:p-8 border border-primary-container flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-secondary-container text-on-secondary-fixed px-3 py-0.5 text-label-sm">
                UAE Federal Decree-Law No. 45 (PDPL)
              </span>
              <span className="rounded-full bg-primary-container text-primary-fixed px-3 py-0.5 text-label-sm">
                ADHICS Sovereign Vault
              </span>
            </div>
            <h1 className="text-headline-lg-mobile md:text-headline-lg text-on-primary">
              {ar
                ? "إدارة الموافقات الجينية وسجل الخصوصية"
                : "Consent Governance & Sovereign Privacy"}
            </h1>
            <p className="text-body-md text-primary-fixed-dim">
              {ar
                ? "تحكم تفصيلي بمن يطلع على نتائجك الجينية. كل تعديل يُوثق فوراً ببصمة SHA-256 غير قابلة للتعديل."
                : "Fine-grained control over every genomic data flow. Every toggle writes a verifiable cryptographic event to your sovereign audit ledger."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleExportSealedReceipt}
              className="inline-flex items-center gap-2 rounded-lg bg-secondary text-on-secondary px-4 py-2.5 text-label-md hover:bg-secondary/90 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined !text-[18px]">
                verified_user
              </span>
              <span>{ar ? "تصدير إيصال مختوم" : "Export Sealed Receipt"}</span>
            </button>

            <button
              type="button"
              onClick={restoreDefaultConsents}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-container border border-on-primary-container/40 text-on-primary px-4 py-2.5 text-label-md hover:bg-primary-container/80 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined !text-[18px]">
                restart_alt
              </span>
              <span>{ar ? "استعادة الافتراضي" : "Restore Standard"}</span>
            </button>

            <button
              type="button"
              onClick={() => setRevokeModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-error text-on-error px-4 py-2.5 text-label-md hover:bg-error/90 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined !text-[18px]">
                gpp_bad
              </span>
              <span>{ar ? "إلغاء شامل طارئ" : "Emergency Revoke All"}</span>
            </button>
          </div>
        </section>

        {/* Active Scope Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-5">
            <p className="text-label-sm uppercase text-on-surface-variant">
              {ar ? "نطاقات الموافقة المفعلة" : "Active Data Scopes"}
            </p>
            <p className="text-headline-md text-primary mt-1">
              {activeCount} / {consentScopes.length}
            </p>
            <p className="text-body-sm text-secondary mt-1">
              {ar
                ? "تحكم فوري بدون تقييد خارجي"
                : "Instant citizen override enabled"}
            </p>
          </div>

          <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-5">
            <p className="text-label-sm uppercase text-on-surface-variant">
              {ar ? "حالة التسلسل الجيني الخام" : "Raw FASTQ / VCF Exposure"}
            </p>
            <p className="text-headline-md text-primary mt-1">
              {ar ? "محجوب 100%" : "0% Exposed"}
            </p>
            <p className="text-body-sm text-on-surface-variant mt-1">
              {ar
                ? "يبقى التسلسل الخام داخل أبوظبي حصراً"
                : "Sequence reads never leave Abu Dhabi enclave"}
            </p>
          </div>

          <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-5">
            <p className="text-label-sm uppercase text-on-surface-variant">
              {ar ? "شركات التأمين وأصحاب العمل" : "Insurers & Employers"}
            </p>
            <p className="text-headline-md text-primary mt-1">
              {ar ? "محظور بموجب السياسة" : "Strict Policy Block"}
            </p>
            <p className="text-body-sm text-on-surface-variant mt-1">
              {ar
                ? "حظر دائم لأي استعلام تأميني غير مصرح"
                : "Zero commercial or underwriting endpoints"}
            </p>
          </div>
        </section>

        {/* 4 Granular Consent Scope Switches */}
        <section className="rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-outline-variant/40">
            <div>
              <h2 className="text-headline-sm text-primary">
                {ar
                  ? "صلاحيات مشاركة البيانات حسب النطاق"
                  : "Granular Consent Scopes"}
              </h2>
              <p className="text-body-sm text-on-surface-variant">
                {ar
                  ? "أوقف أو فعّل أي نطاق أدناه لتحديث الصلاحيات عبر جميع صفحات المنصة."
                  : "Toggle any scope below to update permissions live across Partner Comparison & Counselor tools."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {consentScopes.map((scope) => (
              <div
                key={scope.id}
                className={`rounded-xl p-5 border transition-colors flex flex-col justify-between gap-4 ${
                  scope.enabled
                    ? "bg-surface-container-low/70 border-secondary/40"
                    : "bg-surface-container-lowest border-outline-variant/60"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-code-sm text-secondary font-semibold">
                        {scope.code}
                      </span>
                      <h3 className="text-title-md text-primary mt-0.5">
                        {ar ? scope.titleAr : scope.titleEn}
                      </h3>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={scope.enabled}
                      aria-label={scope.titleEn}
                      onClick={() => toggleConsentScope(scope.id)}
                      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors cursor-pointer ${
                        scope.enabled ? "bg-secondary" : "bg-outline-variant"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                          scope.enabled
                            ? ar
                              ? "-translate-x-5"
                              : "translate-x-5"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-body-sm text-on-surface-variant">
                    {ar ? scope.descriptionAr : scope.descriptionEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-outline-variant/40 flex flex-wrap items-center justify-between gap-2 text-label-sm">
                  <span className="text-on-surface-variant">
                    {ar ? scope.regulationAr : scope.regulationEn}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-semibold ${
                      scope.enabled
                        ? "bg-secondary-container text-on-secondary-fixed"
                        : "bg-surface-container text-on-surface-variant"
                    }`}
                  >
                    {scope.enabled
                      ? ar
                        ? "مفعل"
                        : "Enabled"
                      : ar
                      ? "مغلق"
                      : "Disabled"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sovereign SHA-256 Audit Ledger */}
        <section className="rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-headline-sm text-primary">
                {ar
                  ? "سجل التدقيق المشفر (SHA-256)"
                  : "Cryptographic Sovereign Audit Ledger"}
              </h2>
              <p className="text-body-sm text-on-surface-variant">
                {ar
                  ? "تاريخ زمني موثق لجميع عمليات الفتح والتفويض والإلغاء."
                  : "Timestamped ledger of all citizen, partner, and counselor vault actions."}
              </p>
            </div>
            <span className="rounded-full bg-primary-fixed text-on-primary-fixed px-3 py-1 text-code-sm">
              {auditLog.length} {ar ? "سجلات" : "events recorded"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/60 text-label-sm uppercase text-on-surface-variant">
                  <th className="py-3 pe-4 text-start">
                    {ar ? "الوقت" : "Timestamp"}
                  </th>
                  <th className="py-3 pe-4 text-start">
                    {ar ? "المنفذ" : "Actor"}
                  </th>
                  <th className="py-3 pe-4 text-start">
                    {ar ? "الإجراء" : "Action"}
                  </th>
                  <th className="py-3 pe-4 text-start">
                    {ar ? "النطاق" : "Scope"}
                  </th>
                  <th className="py-3 pe-4 text-start">SHA-256</th>
                  <th className="py-3 text-start">
                    {ar ? "الحالة" : "Status"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40 text-body-sm">
                {auditLog.map((entry) => (
                  <tr key={entry.id} className="hover:bg-surface-container-low">
                    <td className="py-3 pe-4 whitespace-nowrap text-code-sm text-on-surface-variant">
                      {entry.timestamp}
                    </td>
                    <td className="py-3 pe-4 font-medium text-primary">
                      {ar ? entry.actorAr : entry.actorEn}
                    </td>
                    <td className="py-3 pe-4 text-on-surface">
                      {ar ? entry.actionAr : entry.actionEn}
                    </td>
                    <td className="py-3 pe-4">
                      <span className="rounded-md bg-surface-container px-2 py-0.5 text-code-sm text-primary">
                        {entry.scopeCode}
                      </span>
                    </td>
                    <td className="py-3 pe-4 text-code-sm text-secondary">
                      {entry.hash}
                    </td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-label-sm ${
                          entry.status === "VERIFIED"
                            ? "bg-secondary-container text-on-secondary-fixed"
                            : entry.status === "REVOKED"
                            ? "bg-error-container text-on-error-container"
                            : "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Emergency Revoke Modal */}
      {revokeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/55 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-surface-container-lowest border border-outline-variant shadow-2xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <span className="h-10 w-10 rounded-full bg-error-container text-error flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">gpp_bad</span>
              </span>
              <div>
                <h3 className="text-headline-sm text-primary">
                  {ar
                    ? "تأكيد الإلغاء الطارئ الفوري"
                    : "Confirm Emergency Scope Revocation"}
                </h3>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  {ar
                    ? "سيتم إيقاف كافة تصاريح مقارنة الشريك ووصول الاستشاري مؤقتاً فوراً، وحجز السجل داخل الخزينة الخاصة."
                    : "This will immediately lock Partner Comparison, pause genetic counselor preview access, and log an emergency revocation seal."}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setRevokeModalOpen(false)}
                className="rounded-lg border border-outline-variant px-4 py-2 text-label-md text-on-surface hover:bg-surface-container cursor-pointer"
              >
                {ar ? "تراجع" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={() => {
                  revokeAllConsents();
                  setRevokeModalOpen(false);
                }}
                className="rounded-lg bg-error text-on-error px-4 py-2 text-label-md hover:bg-error/90 cursor-pointer"
              >
                {ar ? "نعم، إلغاء جميع النطاقات" : "Revoke All Access"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
