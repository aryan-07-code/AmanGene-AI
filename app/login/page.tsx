"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { AmanGeneLogo } from "@/components/AmanGeneLogo";
import { useAmanGene } from "@/context/AmanGeneContext";
import { PERSONAS, PersonaId } from "@/lib/amangene-data";

export default function LoginRolesPage() {
  const router = useRouter();
  const { locale, activePersonaId, setActivePersonaId, pushToast } =
    useAmanGene();
  const ar = locale === "ar";

  const [selectedRole, setSelectedRole] = useState<PersonaId>(activePersonaId);
  const [authenticating, setAuthenticating] = useState(false);

  const handleAuthenticate = (roleId: PersonaId) => {
    setSelectedRole(roleId);
    setAuthenticating(true);
    window.setTimeout(() => {
      setActivePersonaId(roleId);
      setAuthenticating(false);
      router.push(PERSONAS[roleId].defaultRoute);
    }, 650);
  };

  const handleDirectPass = () => {
    pushToast(
      ar
        ? "تم بدء المصادقة البيومترية عبر الهوية الرقمية UAE PASS"
        : "Initiating sovereign UAE PASS cryptographic handshake...",
      "info"
    );
    handleAuthenticate(selectedRole);
  };

  return (
    <AppShell variant="minimal">
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-8 py-8 md:py-12 space-y-8">
        {/* Sovereign Gateway Header */}
        <section className="rounded-xl bg-primary text-on-primary p-6 md:p-10 border border-primary-container shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <AmanGeneLogo size={42} dark />
              <div className="h-8 w-px bg-on-primary-container/40" />
              <Image
                src="/images/doh-emblem.png"
                alt="Department of Health Abu Dhabi"
                width={70}
                height={38}
                className="h-[38px] w-[70px] rounded-md bg-white p-1 object-contain"
              />
              <span className="rounded-full bg-secondary-container text-on-secondary-fixed px-3 py-1 text-label-sm font-semibold">
                ADHICS v2.0 · UAE PDPL
              </span>
            </div>

            <h1 className="text-headline-lg-mobile md:text-headline-lg text-on-primary">
              {ar
                ? "بوابة الوصول السيادي والهوية الرقمية (UAE PASS)"
                : "Sovereign Identity & Clinical Role Gateway"}
            </h1>
            <p className="text-body-lg text-primary-fixed-dim">
              {ar
                ? "اختر دورك في مسار الفحص الجيني قبل الزواج لاستكشاف صلاحيات الخزينة الخاصة، تفويض الشريك، أو مساحة مراجعة استشاري الوراثة."
                : "Select an authenticated role to experience citizen genomic privacy controls, reciprocal partner UAE PASS authorization, or licensed counselor triage."}
            </p>
          </div>

          <div className="lg:col-span-5 rounded-xl bg-primary-container/80 border border-on-primary-container/30 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-label-md text-secondary-fixed uppercase">
                {ar ? "الحساب المحدد" : "Selected Identity"}
              </span>
              <span className="text-code-sm text-primary-fixed-dim">
                {PERSONAS[selectedRole].uaePassId}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Image
                src={PERSONAS[selectedRole].avatarLogin}
                alt={PERSONAS[selectedRole].nameEn}
                width={52}
                height={52}
                className="h-13 w-13 rounded-full object-cover border-2 border-secondary-container"
              />
              <div>
                <p className="text-title-md text-on-primary">
                  {ar
                    ? PERSONAS[selectedRole].nameAr
                    : PERSONAS[selectedRole].nameEn}
                </p>
                <p className="text-body-sm text-secondary-fixed">
                  {ar
                    ? PERSONAS[selectedRole].roleAr
                    : PERSONAS[selectedRole].roleEn}
                </p>
              </div>
            </div>
            <button
              type="button"
              disabled={authenticating}
              onClick={handleDirectPass}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-secondary text-on-secondary py-3 px-4 text-label-md font-semibold hover:bg-secondary/90 disabled:opacity-60 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined !text-[20px]">
                {authenticating ? "progress_activity" : "fingerprint"}
              </span>
              <span>
                {authenticating
                  ? ar
                    ? "جارٍ التحقق البيومتري..."
                    : "Verifying UAE PASS Signature..."
                  : ar
                  ? "تسجيل الدخول عبر الهوية الرقمية"
                  : "Sign In with UAE PASS"}
              </span>
            </button>
          </div>
        </section>

        {/* 3 Role Persona Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(["fatima", "sultan", "reem"] as PersonaId[]).map((pid) => {
            const p = PERSONAS[pid];
            const isSelected = selectedRole === pid;
            const roleHighlights =
              pid === "fatima"
                ? ar
                  ? [
                      "مراجعة 4 متغيرات ACMG والأدلة السريرية",
                      "التحكم بنطاقات الموافقة وسجل SHA-256",
                      "متابعة جلسة الإرشاد مع د. ريم",
                    ]
                  : [
                      "Inspect 4 curated ACMG variants & evidence",
                      "Manage PDPL consent scopes & audit ledger",
                      "Prepare genetic counseling questions & chat",
                    ]
                : pid === "sultan"
                ? ar
                  ? [
                      "مراجعة دعوة الشريك عبر واتساب/SMS",
                      "توقيع تفويض المقارنة المتبادلة بيومترياً",
                      "فك قفل مقارنة HBB مع حماية البيانات الخام",
                    ]
                  : [
                      "Review partner invitation from Fatima",
                      "Sign biometric UAE PASS reciprocal token",
                      "Unlock joint HBB summary with raw sequence shielded",
                    ]
                : ar
                ? [
                    "فرز 3 ملفات أزواج مسجلة للمراجعة",
                    "تحديث الملاحظات السريرية واعتماد التقرير",
                    "التصعيد لمجلس الجينوم متعدد التخصصات",
                  ]
                : [
                    "Triage 3 active couple premarital dossiers",
                    "Edit clinical notes & issue DoH sign-off",
                    "Escalate cases to MDT Genomics Board",
                  ];

            return (
              <div
                key={pid}
                onClick={() => setSelectedRole(pid)}
                className={`rounded-xl bg-surface-container-lowest border p-6 flex flex-col justify-between gap-5 cursor-pointer transition-all ${
                  isSelected
                    ? "border-secondary ring-2 ring-secondary/25 shadow-md"
                    : "border-outline-variant/60 hover:border-secondary/60"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <Image
                      src={p.avatarLogin}
                      alt={p.nameEn}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-full object-cover border-2 border-secondary-container"
                    />
                    <span
                      className={`rounded-full px-3 py-1 text-label-sm ${
                        isSelected
                          ? "bg-secondary text-on-secondary"
                          : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      {ar ? p.badgeAr : p.badgeEn}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-headline-sm text-primary">
                      {ar ? p.nameAr : p.nameEn}
                    </h2>
                    <p className="text-body-sm font-medium text-secondary">
                      {ar ? p.roleAr : p.roleEn}
                    </p>
                    <p className="text-label-sm text-on-surface-variant mt-1">
                      {ar ? p.titleAr : p.titleEn}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-2 border-t border-outline-variant/40">
                    {roleHighlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-body-sm text-on-surface-variant"
                      >
                        <span className="material-symbols-outlined !text-[16px] text-secondary mt-0.5 shrink-0">
                          check_circle
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAuthenticate(pid);
                  }}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-label-md transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-primary text-on-primary hover:bg-primary-container"
                      : "bg-surface-container text-primary hover:bg-secondary-container"
                  }`}
                >
                  <span>
                    {ar ? "الدخول بهذا الدور" : "Enter Workspace as Role"}
                  </span>
                  <span className="material-symbols-outlined !text-[17px] rtl:rotate-180">
                    arrow_forward
                  </span>
                </button>
              </div>
            );
          })}
        </section>

        {/* Ethical Safeguards Strip */}
        <section className="rounded-xl bg-surface-container-low border border-outline-variant/60 p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-body-sm">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-secondary mt-0.5">
              dns
            </span>
            <div>
              <p className="font-semibold text-primary">
                {ar ? "استضافة البيانات في الإمارات" : "UAE Sovereign Residency"}
              </p>
              <p className="text-on-surface-variant">
                {ar
                  ? "جميع الملفات الجينومية مشفرة داخل إمارة أبوظبي."
                  : "All genomic records remain encrypted inside Abu Dhabi enclaves."}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-on-tertiary-fixed-variant mt-0.5">
              policy
            </span>
            <div>
              <p className="font-semibold text-primary">
                {ar
                  ? "نموذج تعليمي — ليس تشخيصاً طبياً"
                  : "Educational Prototype — Not a Diagnosis"}
              </p>
              <p className="text-on-surface-variant">
                {ar
                  ? "مخصص للتثقيف الصحي ومراجعة استشاري الوراثة."
                  : "Designed strictly for carrier literacy alongside licensed clinicians."}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-secondary mt-0.5">
              block
            </span>
            <div>
              <p className="font-semibold text-primary">
                {ar ? "حظر تقييم الزواج رقمياً" : "Zero Marriage Compatibility Scores"}
              </p>
              <p className="text-on-surface-variant">
                {ar
                  ? "لا تصدر المنصة أي نسب توافق أو توصيات بالرفض أو القبول."
                  : "Platform strictly excludes algorithmic compatibility or reproductive directives."}
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
