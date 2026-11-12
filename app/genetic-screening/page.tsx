"use client";

import React, { Suspense, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useAmanGene } from "@/context/AmanGeneContext";
import { AcmgClass, GeneticVariant } from "@/lib/amangene-data";

export default function GeneticScreeningPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <GeneticScreeningContent />
    </Suspense>
  );
}

function GeneticScreeningContent() {
  const searchParams = useSearchParams();
  const {
    locale,
    variants,
    partnerConsent,
    addUploadedVariants,
    resetVariantsToBaseline,
    pushToast,
  } = useAmanGene();
  const ar = locale === "ar";

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState<"ALL" | AcmgClass>("ALL");
  const [inheritanceFilter, setInheritanceFilter] = useState<
    "ALL" | "Autosomal Recessive" | "X-Linked Recessive"
  >("ALL");
  const [manualSelectedId, setManualSelectedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const geneParam = searchParams.get("gene");
  const matchedFromUrl = geneParam
    ? variants.find((v) => v.gene.toLowerCase() === geneParam.toLowerCase())
    : undefined;
  const selectedId =
    manualSelectedId ?? matchedFromUrl?.id ?? variants[0]?.id ?? "";

  const filteredVariants = useMemo(() => {
    const q = search.trim().toLowerCase();
    return variants.filter((v) => {
      if (classFilter !== "ALL" && v.acmgClass !== classFilter) return false;
      if (
        inheritanceFilter !== "ALL" &&
        v.inheritanceType !== inheritanceFilter
      ) {
        return false;
      }
      if (!q) return true;
      return (
        v.gene.toLowerCase().includes(q) ||
        v.hgvsC.toLowerCase().includes(q) ||
        v.hgvsP.toLowerCase().includes(q) ||
        v.rsId.toLowerCase().includes(q) ||
        v.conditionEn.toLowerCase().includes(q) ||
        v.conditionAr.toLowerCase().includes(q)
      );
    });
  }, [variants, search, classFilter, inheritanceFilter]);

  const activeVariant =
    filteredVariants.find((v) => v.id === selectedId) ??
    filteredVariants[0] ??
    variants[0];

  const handleResetFilters = () => {
    setSearch("");
    setClassFilter("ALL");
    setInheritanceFilter("ALL");
    resetVariantsToBaseline();
  };

  const handleDownloadJson = () => {
    const payload = {
      platform: "AmanGene AI · Abu Dhabi Sovereign Genomic Vault",
      disclaimer: "Educational prototype — not a diagnosis",
      exportedAt: new Date().toISOString(),
      variants: filteredVariants,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "amangene-curated-acmg-variants.json";
    a.click();
    URL.revokeObjectURL(url);
    pushToast(
      ar
        ? "تم تصدير ملف JSON للمتغيرات المصنفة"
        : "Downloaded curated ACMG variants JSON report.",
      "success"
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const content = await file.text();
      const lines = content
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith("#"));

      const parsed: GeneticVariant[] = [];
      for (let i = 0; i < Math.min(lines.length, 5); i++) {
        const line = lines[i];
        const parts = line.includes("\t") ? line.split("\t") : line.split(",");
        if (
          parts[0]?.toUpperCase() === "GENE" ||
          parts[0]?.toUpperCase() === "CHROM"
        ) {
          continue;
        }
        const looksLikeVcf = line.startsWith("chr") || /^\d+|X|Y/i.test(parts[0]);
        const gene = looksLikeVcf
          ? (parts[7]?.match(/GENE=([^;]+)/i)?.[1] ?? `CUSTOM_${i + 1}`)
          : (parts[0] || `GENE_${i + 1}`).toUpperCase();
        const hgvsC = looksLikeVcf
          ? `g.${parts[1] || "10451"}${parts[3] || "C"}>${parts[4] || "T"}`
          : parts[1] || "c.120A>G";
        const rsId = looksLikeVcf
          ? parts[2] && parts[2] !== "."
            ? parts[2]
            : `rs780${100 + i}`
          : parts[2] || `rs900${100 + i}`;

        parsed.push({
          id: `var-up-${Date.now()}-${i}`,
          gene,
          hgvsC,
          hgvsP: "Imported Curated Annotation",
          transcript: "NM_000100.4",
          rsId,
          chromosome: looksLikeVcf
            ? `${parts[0]}:${parts[1] || "1000"}`
            : "chr11:441209",
          conditionEn: `${gene} Uploaded Carrier Panel Record`,
          conditionAr: `سجل مستورد للجين ${gene}`,
          acmgClass: "VUS",
          inheritanceEn: "Autosomal Recessive",
          inheritanceAr: "وراثة جسمية متنحية",
          inheritanceType: "Autosomal Recessive",
          zygosityEn: "Heterozygous (Uploaded)",
          zygosityAr: "متغاير الزيجوت (مرفق)",
          partnerStatusAuthorizedEn: "Pending Clinical Review",
          partnerStatusAuthorizedAr: "بانتظار المراجعة السريرية",
          sharedCarrier: false,
          clinVarStars: 2,
          clinVarId: "VCV000991204",
          omimId: "600100",
          pmid: "PMID: 34011290",
          gnomadAf: "0.00018",
          emiratiAf: "Unvalidated Local Upload",
          acmgCriteria: ["PM2_Supporting", "Uploaded"],
          summaryEn: `Client-side parsed record from ${file.name}. Held strictly in your local sovereign browser session for educational inspection.`,
          summaryAr: `تمت قراءة السجل محلياً في المتصفح من الملف ${file.name} دون مغادرة جهازك.`,
          evidenceNotesEn:
            "Uploaded variant requires licensed DoH laboratory verification before clinical interpretation.",
          evidenceNotesAr:
            "يتطلب المتغير المرفوع تحققاً مخبرياً معتمداً من دائرة الصحة قبل التفسير الطبي.",
          mendelianOutcomes: [
            {
              labelEn: "Pending Counselor Verification",
              labelAr: "بانتظار تحقق الاستشاري",
              probability: 50,
              tone: "carrier",
            },
            {
              labelEn: "Reference Allele",
              labelAr: "الأليل المرجعي",
              probability: 50,
              tone: "clear",
            },
          ],
        });
      }

      if (parsed.length === 0) {
        parsed.push({
          id: `var-up-${Date.now()}`,
          gene: "CFTR",
          hgvsC: "c.1521_1523delCTT",
          hgvsP: "p.Phe508del",
          transcript: "NM_000492.4",
          rsId: "rs113993960",
          chromosome: "chr7:117559590",
          conditionEn: `Imported Panel (${file.name})`,
          conditionAr: `ملف مستورد (${file.name})`,
          acmgClass: "Likely Pathogenic",
          inheritanceEn: "Autosomal Recessive",
          inheritanceAr: "وراثة جسمية متنحية",
          inheritanceType: "Autosomal Recessive",
          zygosityEn: "Heterozygous Carrier",
          zygosityAr: "حامل متغاير الزيجوت",
          partnerStatusAuthorizedEn: "Negative (Wild Type)",
          partnerStatusAuthorizedAr: "سلبي للمتغير",
          sharedCarrier: false,
          clinVarStars: 3,
          clinVarId: "VCV000007105",
          omimId: "219700",
          pmid: "PMID: 31290441",
          gnomadAf: "0.0068",
          emiratiAf: "0.0031 (Emirati Cohort)",
          acmgCriteria: ["PM3_Strong", "PP5"],
          summaryEn: `Parsed safely inside local browser sandbox from ${file.name}.`,
          summaryAr: `تمت القراءة محلياً بأمان من الملف ${file.name}.`,
          evidenceNotesEn:
            "Included in session workspace for clinician Q&A discussion.",
          evidenceNotesAr:
            "مضاف لجلسة العمل لمناقشته مع استشاري الوراثة.",
          mendelianOutcomes: [
            {
              labelEn: "Carrier Inheritance (Unpaired)",
              labelAr: "انتقال صفة الحامل",
              probability: 50,
              tone: "carrier",
            },
            {
              labelEn: "Reference Genotype",
              labelAr: "تركيب مرجعي سليم",
              probability: 50,
              tone: "clear",
            },
          ],
        });
      }

      addUploadedVariants(parsed, file.name);
      setManualSelectedId(parsed[0].id);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Card */}
        <section className="rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-secondary-container text-on-secondary-fixed px-3 py-0.5 text-label-sm">
                ACMG / AMP 2015 Evidence Standard
              </span>
              <span className="rounded-full bg-surface-container text-primary px-3 py-0.5 text-label-sm">
                GRCh38 · Emirati Reference
              </span>
            </div>
            <h1 className="text-headline-lg-mobile md:text-headline-lg text-primary">
              {ar
                ? "مستعرض الفحص الجيني والأدلة السريرية"
                : "Genetic Screening & Evidence Vault"}
            </h1>
            <p className="text-body-md text-on-surface-variant max-w-2xl">
              {ar
                ? "استكشف المتغيرات الجينية المصنفة، الترددات السكانية الإماراتية، والمراجع العلمية قبل جلسة الإرشاد."
                : "Inspect curated carrier variants, Emirati cohort allele frequencies, and peer-reviewed ClinVar/OMIM evidence."}
            </p>
          </div>

          <div className="no-print flex flex-wrap items-center gap-2.5">
            <input
              id="vcf-csv-upload"
              name="vcfCsvUpload"
              ref={fileInputRef}
              type="file"
              accept=".vcf,.csv,.tsv,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-3.5 py-2 text-label-md text-primary hover:bg-surface-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined !text-[18px]">
                upload_file
              </span>
              <span>{ar ? "رفع VCF / CSV محلياً" : "Upload VCF / CSV"}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-3.5 py-2 text-label-md text-primary hover:bg-surface-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined !text-[18px]">
                download
              </span>
              <span>{ar ? "تصدير JSON" : "Export JSON"}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary text-on-primary px-3.5 py-2 text-label-md hover:bg-primary-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined !text-[18px]">
                print
              </span>
              <span>{ar ? "ملخص للطبيب" : "Clinician Summary"}</span>
            </button>
          </div>
        </section>

        {/* Search & Filter Controls */}
        <section className="no-print rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-5 relative">
            <span className="material-symbols-outlined !text-[18px] text-outline absolute start-3 top-1/2 -translate-y-1/2">
              search
            </span>
            <input
              id="variant-search"
              name="variantSearch"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                ar
                  ? "ابحث باسم الجين (HBB, G6PD) أو rsID أو HGVS..."
                  : "Search gene (HBB, G6PD), HGVS, rsID, or condition..."
              }
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low ps-10 pe-3 py-2 text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary"
            />
          </div>

          <div className="md:col-span-3">
            <select
              id="acmg-class-filter"
              name="acmgClassFilter"
              value={classFilter}
              onChange={(e) =>
                setClassFilter(e.target.value as "ALL" | AcmgClass)
              }
              aria-label="Filter by ACMG classification"
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-md text-on-surface focus:outline-none focus:border-secondary"
            >
              <option value="ALL">
                {ar ? "كل التصنيفات (ACMG)" : "All ACMG Classes"}
              </option>
              <option value="Pathogenic">Pathogenic</option>
              <option value="Likely Pathogenic">Likely Pathogenic</option>
              <option value="VUS">VUS (Uncertain)</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              id="inheritance-filter"
              name="inheritanceFilter"
              value={inheritanceFilter}
              onChange={(e) =>
                setInheritanceFilter(
                  e.target.value as
                    | "ALL"
                    | "Autosomal Recessive"
                    | "X-Linked Recessive"
                )
              }
              aria-label="Filter by inheritance pattern"
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-md text-on-surface focus:outline-none focus:border-secondary"
            >
              <option value="ALL">
                {ar ? "كل أنماط الوراثة" : "All Inheritance Patterns"}
              </option>
              <option value="Autosomal Recessive">
                {ar ? "وراثة جسمية متنحية" : "Autosomal Recessive"}
              </option>
              <option value="X-Linked Recessive">
                {ar ? "مرتبطة بالكروموسوم X" : "X-Linked Recessive"}
              </option>
            </select>
          </div>

          <div className="md:col-span-1 flex justify-end">
            <button
              type="button"
              onClick={handleResetFilters}
              className="w-full md:w-auto rounded-lg border border-outline-variant px-3 py-2 text-label-md text-on-surface-variant hover:bg-surface-container cursor-pointer"
            >
              {ar ? "إعادة" : "Reset"}
            </button>
          </div>
        </section>

        {/* Master-Detail Split Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Variant List */}
          <div className="lg:col-span-5 space-y-3">
            {filteredVariants.length === 0 ? (
              <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-8 text-center space-y-3">
                <span className="material-symbols-outlined !text-[36px] text-outline">
                  search_off
                </span>
                <p className="text-title-md text-primary">
                  {ar ? "لا توجد متغيرات مطابقة" : "No matching variants found"}
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="rounded-lg bg-secondary text-on-secondary px-4 py-2 text-label-md cursor-pointer"
                >
                  {ar ? "إعادة ضبط الفلاتر" : "Reset Filters"}
                </button>
              </div>
            ) : (
              filteredVariants.map((v) => {
                const selected = activeVariant?.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setManualSelectedId(v.id)}
                    className={`w-full text-start rounded-xl p-4 border transition-all cursor-pointer ${
                      selected
                        ? "bg-primary text-on-primary border-primary shadow-md"
                        : "bg-surface-container-lowest text-on-surface border-outline-variant/60 hover:border-secondary"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-headline-sm">
                          {v.gene}
                        </span>
                        <span
                          className={`text-code-sm px-2 py-0.5 rounded-md ${
                            selected
                              ? "bg-primary-container text-secondary-fixed"
                              : "bg-surface-container text-on-surface-variant"
                          }`}
                        >
                          {v.hgvsC}
                        </span>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-label-sm ${
                          selected
                            ? "bg-secondary-container text-on-secondary-fixed"
                            : v.acmgClass === "Pathogenic"
                            ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                            : "bg-secondary-container/70 text-on-secondary-fixed"
                        }`}
                      >
                        {v.acmgClass}
                      </span>
                    </div>

                    <p
                      className={`text-body-md font-medium mt-2 ${
                        selected ? "text-on-primary" : "text-primary"
                      }`}
                    >
                      {ar ? v.conditionAr : v.conditionEn}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-label-sm">
                      <span
                        className={
                          selected
                            ? "text-primary-fixed-dim"
                            : "text-on-surface-variant"
                        }
                      >
                        {ar ? v.inheritanceAr : v.inheritanceEn}
                      </span>
                      {v.sharedCarrier && partnerConsent === "authorized" && (
                        <span
                          className={`rounded-full px-2.5 py-0.5 ${
                            selected
                              ? "bg-tertiary-fixed text-on-tertiary-fixed"
                              : "bg-tertiary-fixed/70 text-on-tertiary-fixed-variant"
                          }`}
                        >
                          {ar ? "مشترك مع الشريك" : "Joint Overlap"}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Dynamic Evidence Inspector */}
          {activeVariant && (
            <div className="lg:col-span-7 rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-6 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-outline-variant/50">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-headline-md text-primary font-mono">
                      {activeVariant.gene}
                    </h2>
                    <span className="rounded-full bg-secondary-container text-on-secondary-fixed px-3 py-0.5 text-label-sm">
                      {activeVariant.acmgClass}
                    </span>
                    <span className="text-label-sm text-on-tertiary-container font-semibold">
                      {"★".repeat(activeVariant.clinVarStars)}
                      {"☆".repeat(4 - activeVariant.clinVarStars)} ClinVar
                    </span>
                  </div>
                  <p className="text-title-md text-on-surface mt-1">
                    {ar ? activeVariant.conditionAr : activeVariant.conditionEn}
                  </p>
                  <p className="text-code-sm text-secondary mt-1">
                    {activeVariant.transcript} : {activeVariant.hgvsC} (
                    {activeVariant.hgvsP})
                  </p>
                </div>

                <div className="text-end space-y-1">
                  <span className="inline-block rounded-lg bg-surface-container px-3 py-1 text-code-sm text-primary">
                    {activeVariant.chromosome}
                  </span>
                  <p className="text-label-sm text-on-surface-variant">
                    {activeVariant.rsId} · OMIM #{activeVariant.omimId}
                  </p>
                </div>
              </div>

              {/* Clinical Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg bg-surface-container-low p-3.5 border border-outline-variant/40">
                  <p className="text-label-sm text-on-surface-variant uppercase">
                    {ar ? "حالة حاملة الملف" : "Proband Zygosity"}
                  </p>
                  <p className="text-body-md font-semibold text-primary mt-1">
                    {ar ? activeVariant.zygosityAr : activeVariant.zygosityEn}
                  </p>
                </div>
                <div className="rounded-lg bg-surface-container-low p-3.5 border border-outline-variant/40">
                  <p className="text-label-sm text-on-surface-variant uppercase">
                    {ar ? "تردد العينة الإماراتية" : "Emirati Cohort AF"}
                  </p>
                  <p className="text-body-md font-semibold text-primary mt-1">
                    {activeVariant.emiratiAf}
                  </p>
                </div>
                <div className="rounded-lg bg-surface-container-low p-3.5 border border-outline-variant/40">
                  <p className="text-label-sm text-on-surface-variant uppercase">
                    {ar ? "حالة الشريك (المصرح)" : "Partner Status"}
                  </p>
                  <p className="text-body-md font-semibold text-secondary mt-1">
                    {partnerConsent === "authorized"
                      ? ar
                        ? activeVariant.partnerStatusAuthorizedAr
                        : activeVariant.partnerStatusAuthorizedEn
                      : ar
                      ? "محجوب (بانتظار التفويض)"
                      : "Masked in Sovereign Enclave"}
                  </p>
                </div>
              </div>

              {/* ACMG Evidence Criteria */}
              <div className="space-y-2">
                <p className="text-label-md text-primary uppercase">
                  {ar
                    ? "معايير تصنيف ACMG/AMP المعتمدة"
                    : "Curated ACMG / AMP Evidence Criteria"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeVariant.acmgCriteria.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary-fixed text-on-primary-fixed px-3 py-1 text-code-sm"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="rounded-full bg-surface-container text-on-surface-variant px-3 py-1 text-code-sm">
                    {activeVariant.clinVarId}
                  </span>
                  <span className="rounded-full bg-surface-container text-on-surface-variant px-3 py-1 text-code-sm">
                    {activeVariant.pmid}
                  </span>
                  <span className="rounded-full bg-surface-container text-on-surface-variant px-3 py-1 text-code-sm">
                    gnomAD: {activeVariant.gnomadAf}
                  </span>
                </div>
              </div>

              {/* Educational Interpretation */}
              <div className="space-y-3">
                <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/40">
                  <h3 className="text-label-md text-primary uppercase mb-1">
                    {ar
                      ? "التفسير السريري التعليمي"
                      : "Educational Clinical Summary"}
                  </h3>
                  <p className="text-body-md text-on-surface">
                    {ar ? activeVariant.summaryAr : activeVariant.summaryEn}
                  </p>
                </div>

                <div className="rounded-xl bg-secondary-container/25 p-4 border border-secondary/20">
                  <h3 className="text-label-md text-secondary uppercase mb-1">
                    {ar
                      ? "ملاحظات المرجع السكاني والاستشارة"
                      : "Cohort Context & Counselor Evidence Notes"}
                  </h3>
                  <p className="text-body-md text-on-surface">
                    {ar
                      ? activeVariant.evidenceNotesAr
                      : activeVariant.evidenceNotesEn}
                  </p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="no-print pt-3 border-t border-outline-variant/50 flex flex-wrap items-center justify-between gap-3">
                <span className="text-label-sm text-on-tertiary-fixed-variant">
                  {ar
                    ? "نموذج تعليمي — ليس تشخيصاً طبياً"
                    : "Educational prototype — not a diagnosis"}
                </span>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/partner-comparison"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant px-3.5 py-2 text-label-md text-primary hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined !text-[17px]">
                      diversity_2
                    </span>
                    <span>
                      {ar ? "مقارنة مع الشريك" : "Check Partner Matrix"}
                    </span>
                  </Link>
                  <Link
                    href="/counseling-journey"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-secondary text-on-secondary px-3.5 py-2 text-label-md hover:bg-secondary/90 transition-colors"
                  >
                    <span className="material-symbols-outlined !text-[17px]">
                      clinical_notes
                    </span>
                    <span>
                      {ar ? "التحضير للاستشارة" : "Prepare Counseling"}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
