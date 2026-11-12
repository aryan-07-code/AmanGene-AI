export type Locale = "en" | "ar";

export type PersonaId = "fatima" | "sultan" | "reem";

export type PartnerConsentStatus = "authorized" | "pending" | "declined";

export type AcmgClass = "Pathogenic" | "Likely Pathogenic" | "VUS";

export interface Persona {
  id: PersonaId;
  nameEn: string;
  nameAr: string;
  roleEn: string;
  roleAr: string;
  titleEn: string;
  titleAr: string;
  uaePassId: string;
  emiratesIdMasked: string;
  facilityEn: string;
  facilityAr: string;
  avatarLogin: string;
  avatarMain: string;
  defaultRoute: string;
  badgeEn: string;
  badgeAr: string;
}

export interface GeneticVariant {
  id: string;
  gene: string;
  hgvsC: string;
  hgvsP: string;
  transcript: string;
  rsId: string;
  chromosome: string;
  conditionEn: string;
  conditionAr: string;
  acmgClass: AcmgClass;
  inheritanceEn: string;
  inheritanceAr: string;
  inheritanceType: "Autosomal Recessive" | "X-Linked Recessive";
  zygosityEn: string;
  zygosityAr: string;
  partnerStatusAuthorizedEn: string;
  partnerStatusAuthorizedAr: string;
  sharedCarrier: boolean;
  clinVarStars: number;
  clinVarId: string;
  omimId: string;
  pmid: string;
  gnomadAf: string;
  emiratiAf: string;
  acmgCriteria: string[];
  summaryEn: string;
  summaryAr: string;
  evidenceNotesEn: string;
  evidenceNotesAr: string;
  mendelianOutcomes: {
    labelEn: string;
    labelAr: string;
    probability: number;
    tone: "high" | "carrier" | "clear";
  }[];
}

export interface ConsentScope {
  id: string;
  code: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  regulationEn: string;
  regulationAr: string;
  enabled: boolean;
  lockedNoticeEn?: string;
  lockedNoticeAr?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorEn: string;
  actorAr: string;
  actionEn: string;
  actionAr: string;
  scopeCode: string;
  hash: string;
  status: "VERIFIED" | "REVOKED" | "PENDING";
}

export interface CounselorCase {
  id: string;
  coupleLabelEn: string;
  coupleLabelAr: string;
  mrn: string;
  urgency: "Priority Review" | "Scheduled" | "Signed Off";
  sharedGenes: string[];
  partnerConsent: PartnerConsentStatus;
  intakeScore: string;
  assignedDateEn: string;
  assignedDateAr: string;
  clinicalSummaryEn: string;
  clinicalSummaryAr: string;
  counselorNotes: string;
  certified: boolean;
  certifiedAt?: string;
  escalatedToBoard: boolean;
}

export interface AppointmentSlot {
  id: string;
  dateEn: string;
  dateAr: string;
  timeEn: string;
  timeAr: string;
  modeEn: string;
  modeAr: string;
  locationEn: string;
  locationAr: string;
}

export interface CoordinatorMessage {
  id: string;
  sender: "coordinator" | "user";
  authorEn: string;
  authorAr: string;
  timestamp: string;
  textEn: string;
  textAr: string;
}

export const PERSONAS: Record<PersonaId, Persona> = {
  fatima: {
    id: "fatima",
    nameEn: "Fatima Al Mansoori",
    nameAr: "فاطمة المنصوري",
    roleEn: "Primary Proband · Citizen",
    roleAr: "المستفيدة الرئيسية · مواطنة",
    titleEn: "UAE Premarital Screening Participant",
    titleAr: "مشاركة في برنامج الفحص الجيني قبل الزواج",
    uaePassId: "UAEPASS-784-1996-8842",
    emiratesIdMasked: "784-1996-•••••••-4",
    facilityEn: "Abu Dhabi Genomic Center (DoH)",
    facilityAr: "مركز أبوظبي للجينوم (دائرة الصحة)",
    avatarLogin: "/images/fatima-login.png",
    avatarMain: "/images/fatima-overview.png",
    defaultRoute: "/",
    badgeEn: "Citizen Vault Active",
    badgeAr: "خزينة المواطن نشطة",
  },
  sultan: {
    id: "sultan",
    nameEn: "Sultan Al Zaabi",
    nameAr: "سلطان الزعابي",
    roleEn: "Partner Counterparty",
    roleAr: "الطرف الشريك المصرح له",
    titleEn: "Reciprocal Consent Counterparty",
    titleAr: "الطرف المقابل للموافقة المتبادلة",
    uaePassId: "UAEPASS-784-1994-5109",
    emiratesIdMasked: "784-1994-•••••••-9",
    facilityEn: "Cleveland Clinic Abu Dhabi Node",
    facilityAr: "نقطة كليفلاند كلينك أبوظبي",
    avatarLogin: "/images/sultan-login.png",
    avatarMain: "/images/sultan-login.png",
    defaultRoute: "/partner-consent",
    badgeEn: "Partner Portal Active",
    badgeAr: "بوابة الشريك نشطة",
  },
  reem: {
    id: "reem",
    nameEn: "Dr. Reem Al Hashimi",
    nameAr: "د. ريم الهاشمي",
    roleEn: "Lead Genetic Counselor",
    roleAr: "استشارية الوراثة الطبية",
    titleEn: "DoH Licensed Clinical Geneticist · #DOH-GC-4092",
    titleAr: "استشارية وراثة مرخصة من دائرة الصحة · DOH-GC-4092#",
    uaePassId: "UAEPASS-DOH-4092-GC",
    emiratesIdMasked: "784-1988-•••••••-2",
    facilityEn: "Department of Health Clinical Board",
    facilityAr: "المجلس السريري لدائرة الصحة أبوظبي",
    avatarLogin: "/images/reem-login.png",
    avatarMain: "/images/reem-header.png",
    defaultRoute: "/counselor-workspace",
    badgeEn: "Clinical Review Mode",
    badgeAr: "وضع المراجعة السريرية",
  },
};

export const INITIAL_VARIANTS: GeneticVariant[] = [
  {
    id: "var-hbb",
    gene: "HBB",
    hgvsC: "c.93-21G>A",
    hgvsP: "IVS-I-110 (Splice)",
    transcript: "NM_000518.5",
    rsId: "rs35004220",
    chromosome: "chr11:5226821",
    conditionEn: "Beta-Thalassemia Carrier Trait",
    conditionAr: "صفة حاملة للثلاسيميا بيتا",
    acmgClass: "Pathogenic",
    inheritanceEn: "Autosomal Recessive",
    inheritanceAr: "وراثة جسمية متنحية",
    inheritanceType: "Autosomal Recessive",
    zygosityEn: "Heterozygous Carrier",
    zygosityAr: "حاملة متغايرة الزيجوت",
    partnerStatusAuthorizedEn: "Carrier Detected (Heterozygous)",
    partnerStatusAuthorizedAr: "تم رصد حمل وراثي (متغاير الزيجوت)",
    sharedCarrier: true,
    clinVarStars: 3,
    clinVarId: "VCV000015454",
    omimId: "613985",
    pmid: "PMID: 33281892",
    gnomadAf: "0.00041",
    emiratiAf: "0.0238 (Emirati Cohort)",
    acmgCriteria: ["PVS1_Strong", "PM2_Supporting", "PP5", "PS3"],
    summaryEn:
      "Intronic splice-site variant introducing an aberrant acceptor site in intron 1 of HBB. Single-copy carriers remain asymptomatic; shared partner carrier status merits genetic counseling review.",
    summaryAr:
      "متغير في موقع التضفير الإنتروني ضمن جين HBB. حاملو النسخة الواحدة لا تظهر عليهم أعراض سريرية، وتستدعي الحالة المشتركة مع الشريك جلسة إرشاد وراثي متخصصة.",
    evidenceNotesEn:
      "Validated in Emirati Genome Program reference panel (n=50,000). Recommended discussion focuses purely on Mendelian inheritance probabilities and clinical counseling options without algorithmic scoring.",
    evidenceNotesAr:
      "موثق في المرجع السكاني لبرنامج الجينوم الإماراتي. تركز التوصية التعليمية على احتمالات الوراثة المندلية وخيارات الاستشارة الطبية فقط.",
    mendelianOutcomes: [
      {
        labelEn: "Both Alleles Inherited (Consult Counselor)",
        labelAr: "وراثة نسختين (ينصح بالاستشارة الطبية)",
        probability: 25,
        tone: "high",
      },
      {
        labelEn: "Asymptomatic Carrier",
        labelAr: "حامل غير مصاب (بدون أعراض)",
        probability: 50,
        tone: "carrier",
      },
      {
        labelEn: "Non-Carrier (Typical Variant)",
        labelAr: "غير حامل للمتغير",
        probability: 25,
        tone: "clear",
      },
    ],
  },
  {
    id: "var-g6pd",
    gene: "G6PD",
    hgvsC: "c.563C>T",
    hgvsP: "p.Ser188Phe",
    transcript: "NM_001042351.3",
    rsId: "rs5030868",
    chromosome: "chrX:154534419",
    conditionEn: "G6PD Mediterranean Variant",
    conditionAr: "متغير نقص إنزيم G6PD المتوسطي",
    acmgClass: "Pathogenic",
    inheritanceEn: "X-Linked Recessive",
    inheritanceAr: "وراثة مرتبطة بالكروموسوم X",
    inheritanceType: "X-Linked Recessive",
    zygosityEn: "Heterozygous Carrier",
    zygosityAr: "حاملة متغايرة الزيجوت",
    partnerStatusAuthorizedEn: "Hemizygous Reference (Negative)",
    partnerStatusAuthorizedAr: "مرجع سليم (سلبي للمتغير)",
    sharedCarrier: false,
    clinVarStars: 4,
    clinVarId: "VCV000010361",
    omimId: "300908",
    pmid: "PMID: 31820411",
    gnomadAf: "0.0029",
    emiratiAf: "0.0412 (Emirati Cohort)",
    acmgCriteria: ["PS3", "PM1", "PP3", "PP5"],
    summaryEn:
      "Classic G6PD Mediterranean variant associated with reduced erythrocyte enzyme stability under oxidative triggers (e.g., fava beans or specific sulfonamides).",
    summaryAr:
      "متغير إنزيم G6PD المتوسطي الشائع المرتبط بحساسية خلايا الدم الحمراء لبعض المحفزات الغذائية والدوائية عند ظهور الطراز الجيني الكامل.",
    evidenceNotesEn:
      "High clinical utility for medication safety awareness and preventive lifestyle education during counseling.",
    evidenceNotesAr:
      "فائدة وقائية عالية للتوعية الدوائية والغذائية أثناء جلسة الاستشارة الوراثية.",
    mendelianOutcomes: [
      {
        labelEn: "X-Linked Inheritance Potential",
        labelAr: "احتمال الانتقال عبر الكروموسوم X",
        probability: 50,
        tone: "carrier",
      },
      {
        labelEn: "Reference Allele Transmitted",
        labelAr: "انتقال الأليل المرجعي الطبيعي",
        probability: 50,
        tone: "clear",
      },
    ],
  },
  {
    id: "var-mefv",
    gene: "MEFV",
    hgvsC: "c.2080A>G",
    hgvsP: "p.Met694Val",
    transcript: "NM_000243.3",
    rsId: "rs61752717",
    chromosome: "chr16:3243257",
    conditionEn: "Familial Mediterranean Fever (Carrier)",
    conditionAr: "حامل متغير حمى البحر الأبيض المتوسط",
    acmgClass: "Pathogenic",
    inheritanceEn: "Autosomal Recessive",
    inheritanceAr: "وراثة جسمية متنحية",
    inheritanceType: "Autosomal Recessive",
    zygosityEn: "Heterozygous Carrier",
    zygosityAr: "حاملة متغايرة الزيجوت",
    partnerStatusAuthorizedEn: "Negative (Wild Type)",
    partnerStatusAuthorizedAr: "سلبي (طراز بري طبيعي)",
    sharedCarrier: false,
    clinVarStars: 3,
    clinVarId: "VCV000002538",
    omimId: "249100",
    pmid: "PMID: 30476289",
    gnomadAf: "0.0012",
    emiratiAf: "0.0115 (Emirati Cohort)",
    acmgCriteria: ["PS3", "PM1", "PM5", "PP5"],
    summaryEn:
      "Well-characterized pyrin B30.2 domain variant. Because partner screening is negative for pathogenic MEFV alleles, joint autosomal recessive elevation is not observed.",
    summaryAr:
      "متغير معروف في نطاق البيرين. ونظراً لعدم رصد متغير مشابه لدى الشريك، لا يوجد تداخل وراثي متنحٍ مشترك لهذا الجين.",
    evidenceNotesEn:
      "Educational note covers anti-inflammatory awareness and confirmation of non-shared partner allele status.",
    evidenceNotesAr:
      "تؤكد المراجعة السريرية عدم اشتراك الشريك في هذا المتغير المتنحي.",
    mendelianOutcomes: [
      {
        labelEn: "Carrier Inheritance (Unpaired)",
        labelAr: "انتقال صفة الحامل فقط",
        probability: 50,
        tone: "carrier",
      },
      {
        labelEn: "Reference Genotype",
        labelAr: "تركيب جيني مرجعي سليم",
        probability: 50,
        tone: "clear",
      },
    ],
  },
  {
    id: "var-pkhd1",
    gene: "PKHD1",
    hgvsC: "c.107C>T",
    hgvsP: "p.Thr36Met",
    transcript: "NM_138694.4",
    rsId: "rs137852944",
    chromosome: "chr6:52081619",
    conditionEn: "ARPKD Carrier Finding",
    conditionAr: "نتيجة حمل جين PKHD1",
    acmgClass: "Likely Pathogenic",
    inheritanceEn: "Autosomal Recessive",
    inheritanceAr: "وراثة جسمية متنحية",
    inheritanceType: "Autosomal Recessive",
    zygosityEn: "Heterozygous Carrier",
    zygosityAr: "حاملة متغايرة الزيجوت",
    partnerStatusAuthorizedEn: "Negative (Wild Type)",
    partnerStatusAuthorizedAr: "سلبي (طراز بري طبيعي)",
    sharedCarrier: false,
    clinVarStars: 3,
    clinVarId: "VCV000004128",
    omimId: "263200",
    pmid: "PMID: 32519804",
    gnomadAf: "0.00068",
    emiratiAf: "0.0049 (Emirati Cohort)",
    acmgCriteria: ["PM3_Strong", "PM2_Supporting", "PP3", "PP5"],
    summaryEn:
      "Recurrent missense variant in exon 3 of PKHD1 encoding fibrocystin. Partner sequencing shows full reference sequence across coding exons.",
    summaryAr:
      "متغير متكرر في الإكسون الثالث من جين PKHD1. أظهر فحص الشريك خلوه تماماً من المتغيرات الممرضة في هذا الجين.",
    evidenceNotesEn:
      "Zero joint overlap confirmed after sovereign enclave check; retained in proband vault for longitudinal personal health records.",
    evidenceNotesAr:
      "تم تأكيد عدم وجود تطابق وراثي مشترك عبر الحوسبة السيادية مع حفظ السجل ضمن الخزينة الشخصية.",
    mendelianOutcomes: [
      {
        labelEn: "Carrier Inheritance (Unpaired)",
        labelAr: "انتقال صفة الحامل فقط",
        probability: 50,
        tone: "carrier",
      },
      {
        labelEn: "Reference Genotype",
        labelAr: "تركيب جيني مرجعي سليم",
        probability: 50,
        tone: "clear",
      },
    ],
  },
];

export const INITIAL_CONSENT_SCOPES: ConsentScope[] = [
  {
    id: "scope-carrier",
    code: "SCOPE-01 · ADHICS-CR",
    titleEn: "Personal Carrier Vault & Educational Summary",
    titleAr: "خزينة الحامل الشخصي والملخص التعليمي",
    descriptionEn:
      "Stores curated ACMG carrier findings locally inside the Abu Dhabi sovereign enclave for your private review and clinician-guided education.",
    descriptionAr:
      "حفظ نتائج المتغيرات الجينية المصنفة داخل سحابة أبوظبي السيادية للاطلاع الشخصي والاستشارة الطبية فقط.",
    regulationEn: "UAE Federal Decree-Law No. 45 (PDPL Art. 7)",
    regulationAr: "المرسوم بقانون اتحادي رقم 45 لحماية البيانات الشخصية",
    enabled: true,
  },
  {
    id: "scope-partner",
    code: "SCOPE-02 · ZK-PARTNER",
    titleEn: "Reciprocal Zero-Knowledge Partner Comparison",
    titleAr: "المقارنة الوراثية المتبادلة بدون كشف الخام",
    descriptionEn:
      "Permits aggregate shared autosomal recessive gene overlap checks once your designated partner explicitly signs via UAE PASS. Raw FASTQ/VCF sequences are never exposed.",
    descriptionAr:
      "يسمح بمقارنة التداخل الجيني المتنحي بعد مصادقة الشريك عبر الهوية الرقمية دون مشاركة التسلسل الجيني الخام.",
    regulationEn: "DoH Sovereign Genomic Interoperability Standard v2.4",
    regulationAr: "معيار دائرة الصحة للتبادل الجيني السيادي 2.4",
    enabled: true,
  },
  {
    id: "scope-counselor",
    code: "SCOPE-03 · GC-TRIAGE",
    titleEn: "Licensed Genetic Counselor Clinical Dossier Access",
    titleAr: "وصول استشاري الوراثة السريرية المرخص",
    descriptionEn:
      "Grants Dr. Reem Al Hashimi (DoH #4092) read access to curated ACMG evidence notes and family history ahead of your scheduled counseling session.",
    descriptionAr:
      "يمنح د. ريم الهاشمي صلاحية مراجعة ملخص الأدلة السريرية والتاريخ العائلي قبل جلسة الإرشاد الوراثي.",
    regulationEn: "ADHICS Clinical Access Control Policy §4.2",
    regulationAr: "سياسة التحكم في الوصول السريري ADHICS §4.2",
    enabled: true,
  },
  {
    id: "scope-research",
    code: "SCOPE-04 · EGP-DEID",
    titleEn: "De-Identified Emirati Allele Frequency Contribution",
    titleAr: "المساهمة المجهولة في قاعدة الترددات الوطنية",
    descriptionEn:
      "Contributes strictly anonymized population carrier counts to improve Emirati Cohort ClinVar accuracy. Zero direct identifiers or insurance links.",
    descriptionAr:
      "مشاركة إحصاءات سكانية مجهولة الهوية بالكامل لتحسين دقة المرجع الوطني الإماراتي دون أي ربط شخصي أو تأميني.",
    regulationEn: "Emirati Genome Ethics Board Protocol 2026-B",
    regulationAr: "بروتوكول مجلس أخلاقيات الجينوم الإماراتي 2026-B",
    enabled: false,
    lockedNoticeEn: "Optional · Disabled by default (Zero third-party insurers)",
    lockedNoticeAr: "اختياري · معطل افتراضياً (يمنع مشاركة أي جهة تأمينية)",
  },
];

export const INITIAL_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: "aud-1",
    timestamp: "2026-04-12 09:42:18 GST",
    actorEn: "Sultan Al Zaabi (UAE PASS)",
    actorAr: "سلطان الزعابي (الهوية الرقمية)",
    actionEn: "Signed reciprocal partner enclave consent token",
    actionAr: "توقيع رمز الموافقة المتبادلة لمقارنة الجينوم",
    scopeCode: "SCOPE-02",
    hash: "8f3c...9b12a7e4",
    status: "VERIFIED",
  },
  {
    id: "aud-2",
    timestamp: "2026-04-12 09:15:04 GST",
    actorEn: "Dr. Reem Al Hashimi (#DOH-GC-4092)",
    actorAr: "د. ريم الهاشمي (#DOH-GC-4092)",
    actionEn: "Opened clinical dossier for pre-counseling triage",
    actionAr: "فتح الملف السريري للمراجعة المسبقة للاستشارة",
    scopeCode: "SCOPE-03",
    hash: "4d91...e02c51b8",
    status: "VERIFIED",
  },
  {
    id: "aud-3",
    timestamp: "2026-04-11 16:08:51 GST",
    actorEn: "Fatima Al Mansoori (UAE PASS)",
    actorAr: "فاطمة المنصوري (الهوية الرقمية)",
    actionEn: "Initialized personal proband vault & 4 ACMG summaries",
    actionAr: "تهيئة الخزينة الجينية الشخصية وملخصات ACMG الأربعة",
    scopeCode: "SCOPE-01",
    hash: "1a77...c840f39d",
    status: "VERIFIED",
  },
];

export const INITIAL_COUNSELOR_CASES: CounselorCase[] = [
  {
    id: "fatima-sultan",
    coupleLabelEn: "Fatima Al Mansoori & Sultan Al Zaabi",
    coupleLabelAr: "فاطمة المنصوري وسلطان الزعابي",
    mrn: "ADGC-2026-0891",
    urgency: "Priority Review",
    sharedGenes: ["HBB"],
    partnerConsent: "authorized",
    intakeScore: "1 Shared Recessive Gene (HBB IVS-I-110)",
    assignedDateEn: "Today · 14:30 GST",
    assignedDateAr: "اليوم · 14:30 بتوقيت الخليج",
    clinicalSummaryEn:
      "Both counterparties carry HBB c.93-21G>A (heterozygous). Zero deterministic directive generated; full Mendelian educational counseling and discussion of confirmatory clinical lab follow-up prepared.",
    clinicalSummaryAr:
      "كلا الطرفين يحملان متغير HBB c.93-21G>A بشكل متغاير الزيجوت. الجلسة مخصصة للشرح التعليمي المندلي ومناقشة الفحوصات التأكيدية المعتمدة.",
    counselorNotes:
      "Prepare bilingual visual Punnett diagram for HBB IVS-I-110 carrier education. Confirm CBC + hemoglobin electrophoresis history during video session.",
    certified: false,
    escalatedToBoard: false,
  },
  {
    id: "mariam",
    coupleLabelEn: "Mariam Al Qasimi & Omar Al Dhaheri",
    coupleLabelAr: "مريم القاسمي وعمر الظاهري",
    mrn: "ADGC-2026-0874",
    urgency: "Scheduled",
    sharedGenes: ["CFTR"],
    partnerConsent: "authorized",
    intakeScore: "1 Shared Carrier Gene (CFTR p.Phe508del)",
    assignedDateEn: "Tomorrow · 10:00 GST",
    assignedDateAr: "غداً · 10:00 بتوقيت الخليج",
    clinicalSummaryEn:
      "Reciprocal consent active via Abu Dhabi Sovereign Enclave. Both participants requested Arabic genetic counseling brief prior to follow-up.",
    clinicalSummaryAr:
      "الموافقة المتبادلة مفعلة عبر السحابة السيادية، وطلب الطرفان ملخصاً إرشادياً باللغة العربية قبل الموعد.",
    counselorNotes:
      "Arabic patient leaflet attached. Awaiting maternal aunt clinical report upload.",
    certified: false,
    escalatedToBoard: false,
  },
  {
    id: "khalid",
    coupleLabelEn: "Khalid Al Mazrouei & Noura Al Suwaidi",
    coupleLabelAr: "خالد المزروعي ونورة السويدي",
    mrn: "ADGC-2026-0839",
    urgency: "Signed Off",
    sharedGenes: [],
    partnerConsent: "authorized",
    intakeScore: "0 Shared Autosomal Recessive Variants",
    assignedDateEn: "Completed · 10 Apr 2026",
    assignedDateAr: "مكتمل · 10 أبريل 2026",
    clinicalSummaryEn:
      "No overlapping pathogenic recessive variants detected across targeted Emirati premarital panel. Standard educational certificate issued.",
    clinicalSummaryAr:
      "لم يتم رصد متغيرات متنحية ممرضة مشتركة ضمن لوحة الفحص الإماراتي قبل الزواج، وتم إصدار شهادة الإتمام التعليمي.",
    counselorNotes:
      "Counseling session completed (22 mins). Couple acknowledged educational summary and carrier awareness FAQ.",
    certified: true,
    certifiedAt: "2026-04-10 11:45 GST",
    escalatedToBoard: false,
  },
];

export const APPOINTMENT_SLOTS: AppointmentSlot[] = [
  {
    id: "slot-1",
    dateEn: "Thu, 16 Apr 2026",
    dateAr: "الخميس، 16 أبريل 2026",
    timeEn: "14:30 – 15:15 GST",
    timeAr: "14:30 – 15:15 بتوقيت الخليج",
    modeEn: "Encrypted Video Tele-Genetics",
    modeAr: "استشارة مرئية مشفرة عن بُعد",
    locationEn: "Abu Dhabi Genomic Center · Virtual Suite 04",
    locationAr: "مركز أبوظبي للجينوم · الغرفة الافتراضية 04",
  },
  {
    id: "slot-2",
    dateEn: "Sun, 19 Apr 2026",
    dateAr: "الأحد، 19 أبريل 2026",
    timeEn: "10:00 – 10:45 GST",
    timeAr: "10:00 – 10:45 بتوقيت الخليج",
    modeEn: "In-Person Clinical Suite",
    modeAr: "حضوري في العيادة الوراثية",
    locationEn: "Cleveland Clinic Abu Dhabi · Wing B, Room 214",
    locationAr: "كليفلاند كلينك أبوظبي · الجناح B، غرفة 214",
  },
  {
    id: "slot-3",
    dateEn: "Tue, 21 Apr 2026",
    dateAr: "الثلاثاء، 21 أبريل 2026",
    timeEn: "16:15 – 17:00 GST",
    timeAr: "16:15 – 17:00 بتوقيت الخليج",
    modeEn: "Encrypted Video Tele-Genetics",
    modeAr: "استشارة مرئية مشفرة عن بُعد",
    locationEn: "Abu Dhabi Genomic Center · Virtual Suite 02",
    locationAr: "مركز أبوظبي للجينوم · الغرفة الافتراضية 02",
  },
];

export const INITIAL_MESSAGES: CoordinatorMessage[] = [
  {
    id: "msg-1",
    sender: "coordinator",
    authorEn: "Salma Al Nuaimi · Care Coordinator",
    authorAr: "سلمى النعيمي · منسقة الرعاية",
    timestamp: "09:50 GST",
    textEn:
      "Marhaba Fatima — Dr. Reem has reviewed your HBB & G6PD carrier notes and prepared an educational family tree visual for Thursday's call.",
    textAr:
      "مرحباً فاطمة — راجعت د. ريم ملاحظات جين HBB وG6PD وأعدّت رسماً توضيحياً تعليمياً للجلسة القادمة.",
  },
];

export const INITIAL_REFLECTION_CHECKS = [
  {
    id: "chk-1",
    titleEn: "Confirm family history of anemia or blood transfusions",
    titleAr: "التأكد من التاريخ العائلي لفقر الدم أو نقل الدم",
    checked: true,
  },
  {
    id: "chk-2",
    titleEn: "Review Mendelian 25% / 50% / 25% educational diagram",
    titleAr: "مراجعة الرسم التعليمي لاحتمالات الوراثة المندلية",
    checked: true,
  },
  {
    id: "chk-3",
    titleEn: "List questions on confirmatory CBC & hemoglobin electrophoresis",
    titleAr: "تدوين الأسئلة حول فحوصات الدم التأكيدية",
    checked: false,
  },
  {
    id: "chk-4",
    titleEn: "Confirm both partners attend jointly or authorize summary delivery",
    titleAr: "تأكيد حضور الشريكين معاً أو تفويض استلام الملخص",
    checked: false,
  },
];

export const UI_COPY = {
  en: {
    brandName: "AmanGene AI",
    brandSub: "Abu Dhabi Clinical Genomics",
    navOverview: "Overview Dashboard",
    navScreening: "Genetic Screening",
    navConsent: "Consent & Privacy",
    navPartner: "Partner Comparison",
    navCounseling: "Counseling Journey",
    navCounselor: "Counselor Workspace",
    navPartnerPortal: "Partner Auth (Sultan)",
    navPing: "SMS / WhatsApp Ping",
    navLogin: "Roles & UAE PASS",
    ethicsNotice: "Educational prototype — not a diagnosis",
    ethicsSub: "UAE Sovereign Data Residency · Zero Marriage Scoring Policy",
    notificationsTitle: "Sovereign Vault Notifications",
    markAllRead: "Mark read",
    switchRole: "Switch Persona",
    footerCompliance: "Department of Health Abu Dhabi · ADHICS v2.0 Aligned",
    footerPrivacy:
      "All premarital carrier summaries are purely educational and reviewed by DoH-licensed genetic counselors.",
  },
  ar: {
    brandName: "أمان جين للذكاء الجيني",
    brandSub: "منصة أبوظبي للرعاية الجينومية",
    navOverview: "لوحة النظرة العامة",
    navScreening: "الفحص الجيني",
    navConsent: "الموافقة والخصوصية",
    navPartner: "مقارنة الشريك",
    navCounseling: "رحلة الإرشاد الوراثي",
    navCounselor: "مساحة الاستشاري",
    navPartnerPortal: "تفويض الشريك (سلطان)",
    navPing: "تنبيه واتساب والرسائل",
    navLogin: "الأدوار والهوية الرقمية",
    ethicsNotice: "نموذج تعليمي — ليس تشخيصاً طبياً",
    ethicsSub: "استضافة البيانات داخل الدولة · بدون تقييم عددي للزواج",
    notificationsTitle: "إشعارات الخزينة السيادية",
    markAllRead: "تحديد كمقروء",
    switchRole: "تبديل الدور",
    footerCompliance: "متوافق مع معايير دائرة الصحة – أبوظبي ADHICS v2.0",
    footerPrivacy:
      "جميع ملخصات الفحص الجيني قبل الزواج تعليمية وتتم مراجعتها عبر استشاريي الوراثة المرخصين.",
  },
};
