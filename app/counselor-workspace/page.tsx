"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AppShell } from "@/components/AppShell";
import { useAmanGene } from "@/context/AmanGeneContext";

type UrgencyFilter = "ALL" | "Priority Review" | "Scheduled" | "Signed Off";

export default function CounselorWorkspacePage() {
  const {
    locale,
    counselorCases,
    updateCounselorNotes,
    certifyCounselorCase,
    escalateCounselorCase,
    pushToast,
  } = useAmanGene();

  const ar = locale === "ar";
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>("ALL");
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    counselorCases[0]?.id ?? "fatima-sultan"
  );
  const [boardModalOpen, setBoardModalOpen] = useState(false);
  const [escalationReason, setEscalationReason] = useState(
    "Request secondary clinical hematology input alongside premarital hemoglobinopathy counseling."
  );

  const filteredCases = counselorCases.filter((c) => {
    if (urgencyFilter === "ALL") return true;
    return c.urgency === urgencyFilter;
  });

  const activeCase =
    filteredCases.find((c) => c.id === selectedCaseId) ??
    filteredCases[0] ??
    counselorCases[0];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Clinician Workspace Header */}
        <section className="rounded-xl bg-primary text-on-primary p-6 border border-primary-container flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-secondary-container text-on-secondary-fixed px-3 py-0.5 text-label-sm">
                DoH Licensed Clinical Review
              </span>
              <span className="text-code-sm text-secondary-fixed">
                #DOH-GC-4092
              </span>
            </div>
            <h1 className="text-headline-lg-mobile md:text-headline-lg text-on-primary">
              {ar
                ? "مساحة عمل استشاري الوراثة السريرية"
                : "Genetic Counselor Triage & Sign-Off Workspace"}
            </h1>
            <p className="text-body-md text-primary-fixed-dim">
              {ar
                ? "فرز ملفات الأزواج المصرح بها، تحرير الملاحظات السريرية، وإصدار الاعتماد التعليمي لدائرة الصحة."
                : "Triage authorized couple dossiers, document counseling notes, and issue DoH clinical certifications."}
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-primary-container/80 border border-on-primary-container/30 px-4 py-3 shrink-0">
            <Image
              src="/images/reem-header.png"
              alt="Dr. Reem Al Hashimi"
              width={46}
              height={46}
              className="h-11 w-11 rounded-full object-cover border border-secondary-container"
            />
            <div>
              <p className="text-title-md text-on-primary">
                {ar ? "د. ريم الهاشمي" : "Dr. Reem Al Hashimi"}
              </p>
              <p className="text-label-sm text-secondary-fixed">
                {ar ? "استشارية الوراثة الطبية" : "Lead Clinical Geneticist"}
              </p>
            </div>
          </div>
        </section>

        {/* Triage Filter Tabs */}
        <section className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex flex-wrap gap-2">
            {(
              [
                "ALL",
                "Priority Review",
                "Scheduled",
                "Signed Off",
              ] as UrgencyFilter[]
            ).map((tab) => {
              const active = urgencyFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setUrgencyFilter(tab)}
                  className={`rounded-full px-4 py-1.5 text-label-md transition-colors cursor-pointer ${
                    active
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  {tab === "ALL"
                    ? ar
                      ? `كل الحالات (${counselorCases.length})`
                      : `All Cases (${counselorCases.length})`
                    : tab}
                </button>
              );
            })}
          </div>
          <span className="text-label-sm text-on-tertiary-fixed-variant">
            {ar
              ? "نموذج تعليمي — يوثق رأي الاستشاري المعتمد"
              : "Clinician sign-off strictly documents educational counseling completion"}
          </span>
        </section>

        {/* Master-Detail Counselor Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Case Queue */}
          <div className="lg:col-span-4 space-y-3">
            {filteredCases.map((c) => {
              const selected = activeCase?.id === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`w-full text-start rounded-xl p-4 border transition-all cursor-pointer ${
                    selected
                      ? "bg-primary text-on-primary border-primary shadow-md"
                      : "bg-surface-container-lowest text-on-surface border-outline-variant/60 hover:border-secondary"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-code-sm opacity-80">{c.mrn}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-label-sm ${
                        c.certified
                          ? "bg-secondary-container text-on-secondary-fixed"
                          : c.urgency === "Priority Review"
                          ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                          : "bg-surface-container text-primary"
                      }`}
                    >
                      {c.certified ? "Signed Off" : c.urgency}
                    </span>
                  </div>
                  <p className="text-title-md mt-2">
                    {ar ? c.coupleLabelAr : c.coupleLabelEn}
                  </p>
                  <p
                    className={`text-body-sm mt-1 ${
                      selected
                        ? "text-primary-fixed-dim"
                        : "text-on-surface-variant"
                    }`}
                  >
                    {c.intakeScore}
                  </p>
                  <p
                    className={`text-label-sm mt-2 ${
                      selected ? "text-secondary-fixed" : "text-secondary"
                    }`}
                  >
                    {ar ? c.assignedDateAr : c.assignedDateEn}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Clinical Dossier */}
          {activeCase && (
            <div className="lg:col-span-8 rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-6 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-outline-variant/50">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-code-sm rounded-md bg-surface-container px-2.5 py-0.5 text-primary">
                      {activeCase.mrn}
                    </span>
                    <span
                      className={`rounded-full px-3 py-0.5 text-label-sm ${
                        activeCase.partnerConsent === "authorized"
                          ? "bg-secondary-container text-on-secondary-fixed"
                          : "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                      }`}
                    >
                      {activeCase.partnerConsent === "authorized"
                        ? ar
                          ? "موافقة الشريكين نشطة"
                          : "Reciprocal UAE PASS Active"
                        : ar
                        ? "بانتظار موافقة الشريك"
                        : "Awaiting Counterparty Auth"}
                    </span>
                    {activeCase.escalatedToBoard && (
                      <span className="rounded-full bg-tertiary-container text-on-tertiary px-3 py-0.5 text-label-sm">
                        MDT Board Queued
                      </span>
                    )}
                  </div>
                  <h2 className="text-headline-md text-primary mt-2">
                    {ar ? activeCase.coupleLabelAr : activeCase.coupleLabelEn}
                  </h2>
                  <p className="text-body-sm text-secondary mt-0.5">
                    {activeCase.intakeScore}
                  </p>
                </div>

                <div className="text-end">
                  <p className="text-label-sm text-on-surface-variant">
                    {ar ? "حالة الاعتماد" : "Certification State"}
                  </p>
                  <p className="text-title-md text-primary">
                    {activeCase.certified
                      ? ar
                        ? "معتمد وموقع"
                        : "Certified · DoH"
                      : ar
                      ? "قيد المراجعة"
                      : "Pending Sign-Off"}
                  </p>
                  {activeCase.certifiedAt && (
                    <p className="text-code-sm text-secondary">
                      {activeCase.certifiedAt}
                    </p>
                  )}
                </div>
              </div>

              {/* Clinical Narrative */}
              <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/40 space-y-1.5">
                <p className="text-label-md uppercase text-primary">
                  {ar ? "ملخص الملف السريري" : "Clinical Dossier Summary"}
                </p>
                <p className="text-body-md text-on-surface">
                  {ar
                    ? activeCase.clinicalSummaryAr
                    : activeCase.clinicalSummaryEn}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {activeCase.sharedGenes.length > 0 ? (
                    activeCase.sharedGenes.map((g) => (
                      <span
                        key={g}
                        className="rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-0.5 text-code-sm"
                      >
                        Shared Locus: {g}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full bg-secondary-container text-on-secondary-fixed px-3 py-0.5 text-label-sm">
                      0 Shared Carrier Loci
                    </span>
                  )}
                </div>
              </div>

              {/* Editable Counselor Notes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="counselor-notes"
                    className="text-label-md uppercase text-primary"
                  >
                    {ar
                      ? "ملاحظات استشاري الوراثة (قابلة للتعديل)"
                      : "Editable Counselor Session Notes"}
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      pushToast(
                        ar
                          ? "تم حفظ الملاحظات السريرية"
                          : "Clinical notes saved to encrypted case draft.",
                        "info"
                      )
                    }
                    className="text-label-sm text-secondary hover:underline cursor-pointer"
                  >
                    {ar ? "حفظ المسودة" : "Save Note Draft"}
                  </button>
                </div>
                <textarea
                  id="counselor-notes"
                  name="counselorNotes"
                  rows={4}
                  value={activeCase.counselorNotes}
                  onChange={(e) =>
                    updateCounselorNotes(activeCase.id, e.target.value)
                  }
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-low p-3.5 text-body-md text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-outline-variant/50 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setBoardModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2.5 text-label-md text-primary hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined !text-[18px]">
                    groups
                  </span>
                  <span>
                    {ar ? "تصعيد لمجلس الجينوم" : "Escalate to MDT Board"}
                  </span>
                </button>

                <button
                  type="button"
                  disabled={activeCase.certified}
                  onClick={() => certifyCounselorCase(activeCase.id)}
                  className="inline-flex items-center gap-2 rounded-lg bg-secondary text-on-secondary px-5 py-2.5 text-label-md font-semibold hover:bg-secondary/90 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined !text-[18px]">
                    verified
                  </span>
                  <span>
                    {activeCase.certified
                      ? ar
                        ? "تم الاعتماد السريري"
                        : "Certified by Dr. Reem"
                      : ar
                      ? "اعتماد وتوقيع التقرير السريري"
                      : "Approve & Certify DoH Summary"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* MDT Board Escalation Modal */}
      {boardModalOpen && activeCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/55 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-surface-container-lowest border border-outline-variant shadow-2xl p-6 space-y-4">
            <h3 className="text-headline-sm text-primary">
              {ar
                ? "تصعيد إلى المجلس السريري متعدد التخصصات"
                : "Escalate to DoH MDT Genomics Board"}
            </h3>
            <p className="text-body-sm text-on-surface-variant">
              {ar ? activeCase.coupleLabelAr : activeCase.coupleLabelEn} (
              {activeCase.mrn})
            </p>
            <textarea
              id="escalation-reason"
              name="escalationReason"
              rows={3}
              value={escalationReason}
              onChange={(e) => setEscalationReason(e.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-3 text-body-sm text-on-surface focus:outline-none focus:border-secondary"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setBoardModalOpen(false)}
                className="rounded-lg border border-outline-variant px-4 py-2 text-label-md text-on-surface hover:bg-surface-container cursor-pointer"
              >
                {ar ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={() => {
                  escalateCounselorCase(activeCase.id, escalationReason);
                  setBoardModalOpen(false);
                }}
                className="rounded-lg bg-primary text-on-primary px-4 py-2 text-label-md cursor-pointer"
              >
                {ar ? "تأكيد التصعيد" : "Confirm Escalation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
