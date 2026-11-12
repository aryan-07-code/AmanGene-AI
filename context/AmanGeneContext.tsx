"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  APPOINTMENT_SLOTS,
  AppointmentSlot,
  AuditLogEntry,
  ConsentScope,
  CoordinatorMessage,
  CounselorCase,
  GeneticVariant,
  INITIAL_AUDIT_LOG,
  INITIAL_CONSENT_SCOPES,
  INITIAL_COUNSELOR_CASES,
  INITIAL_MESSAGES,
  INITIAL_REFLECTION_CHECKS,
  INITIAL_VARIANTS,
  Locale,
  PERSONAS,
  PartnerConsentStatus,
  Persona,
  PersonaId,
} from "@/lib/amangene-data";

export interface ReflectionCheck {
  id: string;
  titleEn: string;
  titleAr: string;
  checked: boolean;
}

export interface VaultNotification {
  id: string;
  titleEn: string;
  titleAr: string;
  timeEn: string;
  timeAr: string;
  read: boolean;
}

export interface ToastItem {
  id: string;
  message: string;
  tone: "success" | "warning" | "info";
}

interface PersistedState {
  locale: Locale;
  activePersonaId: PersonaId;
  partnerConsent: PartnerConsentStatus;
  consentScopes: ConsentScope[];
  auditLog: AuditLogEntry[];
  variants: GeneticVariant[];
  reflectionChecks: ReflectionCheck[];
  appointment: AppointmentSlot;
  coordinatorMessages: CoordinatorMessage[];
  counselorCases: CounselorCase[];
  pedigreeFileName: string | null;
}

const STORAGE_KEY = "amangene_ai_state_v1";

const DEFAULT_PERSISTED_STATE: PersistedState = {
  locale: "en",
  activePersonaId: "fatima",
  partnerConsent: "authorized",
  consentScopes: INITIAL_CONSENT_SCOPES,
  auditLog: INITIAL_AUDIT_LOG,
  variants: INITIAL_VARIANTS,
  reflectionChecks: INITIAL_REFLECTION_CHECKS,
  appointment: APPOINTMENT_SLOTS[0],
  coordinatorMessages: INITIAL_MESSAGES,
  counselorCases: INITIAL_COUNSELOR_CASES,
  pedigreeFileName: "Al_Mansoori_Family_Pedigree_2026.ped",
};

const INITIAL_NOTIFICATIONS: VaultNotification[] = [
  {
    id: "notif-1",
    titleEn: "Sultan Al Zaabi signed reciprocal consent token",
    titleAr: "سلطان الزعابي وقّع رمز الموافقة المتبادلة",
    timeEn: "24m ago",
    timeAr: "منذ 24 دقيقة",
    read: false,
  },
  {
    id: "notif-2",
    titleEn: "Dr. Reem reviewed HBB educational summary",
    titleAr: "د. ريم راجعت الملخص التعليمي لجين HBB",
    timeEn: "1h ago",
    timeAr: "منذ ساعة",
    read: false,
  },
  {
    id: "notif-3",
    titleEn: "ADHICS Sovereign Key Rotation verified",
    titleAr: "تم التحقق من تدوير مفاتيح ADHICS السيادية",
    timeEn: "Yesterday",
    timeAr: "أمس",
    read: true,
  },
];

let clientSnapshot: PersistedState = DEFAULT_PERSISTED_STATE;
let hasHydratedStorage = false;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function parsePersistedState(raw: string | null): PersistedState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      locale:
        parsed.locale === "en" || parsed.locale === "ar"
          ? parsed.locale
          : DEFAULT_PERSISTED_STATE.locale,
      activePersonaId:
        parsed.activePersonaId === "fatima" ||
        parsed.activePersonaId === "sultan" ||
        parsed.activePersonaId === "reem"
          ? parsed.activePersonaId
          : DEFAULT_PERSISTED_STATE.activePersonaId,
      partnerConsent:
        parsed.partnerConsent === "authorized" ||
        parsed.partnerConsent === "pending" ||
        parsed.partnerConsent === "declined"
          ? parsed.partnerConsent
          : DEFAULT_PERSISTED_STATE.partnerConsent,
      consentScopes:
        Array.isArray(parsed.consentScopes) && parsed.consentScopes.length > 0
          ? parsed.consentScopes
          : DEFAULT_PERSISTED_STATE.consentScopes,
      auditLog:
        Array.isArray(parsed.auditLog) && parsed.auditLog.length > 0
          ? parsed.auditLog
          : DEFAULT_PERSISTED_STATE.auditLog,
      variants:
        Array.isArray(parsed.variants) && parsed.variants.length > 0
          ? parsed.variants
          : DEFAULT_PERSISTED_STATE.variants,
      reflectionChecks:
        Array.isArray(parsed.reflectionChecks) &&
        parsed.reflectionChecks.length > 0
          ? parsed.reflectionChecks
          : DEFAULT_PERSISTED_STATE.reflectionChecks,
      appointment: parsed.appointment ?? DEFAULT_PERSISTED_STATE.appointment,
      coordinatorMessages:
        Array.isArray(parsed.coordinatorMessages) &&
        parsed.coordinatorMessages.length > 0
          ? parsed.coordinatorMessages
          : DEFAULT_PERSISTED_STATE.coordinatorMessages,
      counselorCases:
        Array.isArray(parsed.counselorCases) && parsed.counselorCases.length > 0
          ? parsed.counselorCases
          : DEFAULT_PERSISTED_STATE.counselorCases,
      pedigreeFileName:
        parsed.pedigreeFileName !== undefined
          ? parsed.pedigreeFileName
          : DEFAULT_PERSISTED_STATE.pedigreeFileName,
    };
  } catch {
    return null;
  }
}

function updatePersistedState(
  updater: (prev: PersistedState) => PersistedState
) {
  clientSnapshot = updater(clientSnapshot);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clientSnapshot));
    } catch {
      // Ignore storage quota errors
    }
  }
  notifyListeners();
}

function subscribeStore(callback: () => void): () => void {
  listeners.add(callback);

  if (typeof window !== "undefined" && !hasHydratedStorage) {
    hasHydratedStorage = true;
    queueMicrotask(() => {
      const restored = parsePersistedState(
        window.localStorage.getItem(STORAGE_KEY)
      );
      if (restored) {
        clientSnapshot = restored;
        notifyListeners();
      }
    });
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    const restored = parsePersistedState(event.newValue);
    if (restored) {
      clientSnapshot = restored;
      notifyListeners();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }

  return () => {
    listeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

function getClientSnapshot(): PersistedState {
  return clientSnapshot;
}

function getServerSnapshot(): PersistedState {
  return DEFAULT_PERSISTED_STATE;
}

function createShortHash(): string {
  const hex = Math.floor(Math.random() * 0xffffffff)
    .toString(16)
    .padStart(8, "0");
  const tail = Math.floor(Math.random() * 0xffffffff)
    .toString(16)
    .padStart(8, "0");
  return `${hex.slice(0, 4)}...${tail}`;
}

function formatGstNow(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}:${ss} GST`;
}

function makeAuditEntry(
  actorEn: string,
  actorAr: string,
  actionEn: string,
  actionAr: string,
  scopeCode: string,
  status: AuditLogEntry["status"] = "VERIFIED"
): AuditLogEntry {
  return {
    id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    timestamp: formatGstNow(),
    actorEn,
    actorAr,
    actionEn,
    actionAr,
    scopeCode,
    hash: createShortHash(),
    status,
  };
}

interface AmanGeneContextValue {
  locale: Locale;
  isRtl: boolean;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  activePersonaId: PersonaId;
  activePersona: Persona;
  setActivePersonaId: (id: PersonaId) => void;
  partnerConsent: PartnerConsentStatus;
  setPartnerConsentStatus: (
    status: PartnerConsentStatus,
    actorEn?: string,
    actorAr?: string
  ) => void;
  consentScopes: ConsentScope[];
  toggleConsentScope: (scopeId: string) => void;
  revokeAllConsents: () => void;
  restoreDefaultConsents: () => void;
  auditLog: AuditLogEntry[];
  variants: GeneticVariant[];
  addUploadedVariants: (incoming: GeneticVariant[], sourceName: string) => void;
  resetVariantsToBaseline: () => void;
  reflectionChecks: ReflectionCheck[];
  toggleReflectionCheck: (checkId: string) => void;
  pedigreeFileName: string | null;
  setPedigreeFileName: (name: string | null) => void;
  appointment: AppointmentSlot;
  setAppointmentSlot: (slot: AppointmentSlot) => void;
  coordinatorMessages: CoordinatorMessage[];
  sendCoordinatorMessage: (text: string) => void;
  counselorCases: CounselorCase[];
  updateCounselorNotes: (caseId: string, notes: string) => void;
  certifyCounselorCase: (caseId: string) => void;
  escalateCounselorCase: (caseId: string, reason: string) => void;
  notifications: VaultNotification[];
  markAllNotificationsRead: () => void;
  toasts: ToastItem[];
  pushToast: (message: string, tone?: ToastItem["tone"]) => void;
  dismissToast: (id: string) => void;
}

const AmanGeneContext = createContext<AmanGeneContextValue | null>(null);

export function AmanGeneProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const persisted = useSyncExternalStore(
    subscribeStore,
    getClientSnapshot,
    getServerSnapshot
  );

  const [notifications, setNotifications] = useState<VaultNotification[]>(
    INITIAL_NOTIFICATIONS
  );
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    document.documentElement.lang = persisted.locale;
    document.documentElement.dir = persisted.locale === "ar" ? "rtl" : "ltr";
  }, [persisted.locale]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const pushToast = useCallback(
    (message: string, tone: ToastItem["tone"] = "success") => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-2), { id, message, tone }]);
      window.setTimeout(() => {
        dismissToast(id);
      }, 4200);
    },
    [dismissToast]
  );

  const setLocale = useCallback((nextLocale: Locale) => {
    updatePersistedState((prev) => ({ ...prev, locale: nextLocale }));
  }, []);

  const toggleLocale = useCallback(() => {
    updatePersistedState((prev) => ({
      ...prev,
      locale: prev.locale === "en" ? "ar" : "en",
    }));
  }, []);

  const setActivePersonaId = useCallback(
    (id: PersonaId) => {
      updatePersistedState((prev) => ({ ...prev, activePersonaId: id }));
      const p = PERSONAS[id];
      pushToast(
        persisted.locale === "ar"
          ? `تم التبديل إلى: ${p.nameAr}`
          : `Switched workspace identity to ${p.nameEn}`,
        "info"
      );
    },
    [persisted.locale, pushToast]
  );

  const setPartnerConsentStatus = useCallback(
    (
      status: PartnerConsentStatus,
      actorEn = "Sultan Al Zaabi (UAE PASS)",
      actorAr = "سلطان الزعابي (الهوية الرقمية)"
    ) => {
      updatePersistedState((prev) => {
        const audit =
          status === "authorized"
            ? makeAuditEntry(
                actorEn,
                actorAr,
                "Signed reciprocal partner comparison consent",
                "توقيع الموافقة المتبادلة لمقارنة الجينوم",
                "SCOPE-02",
                "VERIFIED"
              )
            : status === "declined"
            ? makeAuditEntry(
                actorEn,
                actorAr,
                "Declined or paused partner comparison access",
                "تم تعليق أو رفض مقارنة الجينوم المتبادلة",
                "SCOPE-02",
                "REVOKED"
              )
            : makeAuditEntry(
                actorEn,
                actorAr,
                "Reset reciprocal enclave to awaiting partner authorization",
                "إعادة حالة المقارنة إلى انتظار موافقة الشريك",
                "SCOPE-02",
                "PENDING"
              );

        return {
          ...prev,
          partnerConsent: status,
          consentScopes:
            status === "authorized"
              ? prev.consentScopes.map((s) =>
                  s.id === "scope-partner" ? { ...s, enabled: true } : s
                )
              : prev.consentScopes,
          counselorCases: prev.counselorCases.map((c) =>
            c.id === "fatima-sultan" ? { ...c, partnerConsent: status } : c
          ),
          auditLog: [audit, ...prev.auditLog.slice(0, 14)],
        };
      });
    },
    []
  );

  const toggleConsentScope = useCallback(
    (scopeId: string) => {
      const target = persisted.consentScopes.find((s) => s.id === scopeId);
      if (!target) return;
      const nextEnabled = !target.enabled;

      updatePersistedState((prev) => {
        const persona = PERSONAS[prev.activePersonaId];
        const audit = makeAuditEntry(
          `${persona.nameEn} (UAE PASS)`,
          `${persona.nameAr} (الهوية الرقمية)`,
          `${nextEnabled ? "Enabled" : "Revoked"} consent scope ${target.code}`,
          `${nextEnabled ? "تفعيل" : "إلغاء"} نطاق الموافقة ${target.code}`,
          target.code.split(" ")[0],
          nextEnabled ? "VERIFIED" : "REVOKED"
        );
        return {
          ...prev,
          partnerConsent:
            scopeId === "scope-partner"
              ? nextEnabled
                ? "authorized"
                : "pending"
              : prev.partnerConsent,
          consentScopes: prev.consentScopes.map((s) =>
            s.id === scopeId ? { ...s, enabled: nextEnabled } : s
          ),
          auditLog: [audit, ...prev.auditLog.slice(0, 14)],
        };
      });

      pushToast(
        persisted.locale === "ar"
          ? `تم تحديث ${target.titleAr} وتسجيل البصمة الرقمية`
          : `${target.code} ${nextEnabled ? "enabled" : "revoked"} and logged to ADHICS ledger`,
        nextEnabled ? "success" : "warning"
      );
    },
    [persisted.consentScopes, persisted.locale, pushToast]
  );

  const revokeAllConsents = useCallback(() => {
    updatePersistedState((prev) => {
      const persona = PERSONAS[prev.activePersonaId];
      const audit = makeAuditEntry(
        `${persona.nameEn} (Emergency Override)`,
        `${persona.nameAr} (إلغاء طارئ)`,
        "Emergency revocation executed across all active data scopes",
        "تنفيذ الإلغاء الطارئ لجميع نطاقات مشاركة البيانات",
        "ALL-SCOPES",
        "REVOKED"
      );
      return {
        ...prev,
        partnerConsent: "declined",
        consentScopes: prev.consentScopes.map((s) => ({
          ...s,
          enabled: false,
        })),
        auditLog: [audit, ...prev.auditLog.slice(0, 14)],
      };
    });

    pushToast(
      persisted.locale === "ar"
        ? "تم تنفيذ الإلغاء الطارئ وإغلاق جميع تصاريح المشاركة"
        : "Emergency revocation complete. All external sharing scopes locked.",
      "warning"
    );
  }, [persisted.locale, pushToast]);

  const restoreDefaultConsents = useCallback(() => {
    updatePersistedState((prev) => {
      const persona = PERSONAS[prev.activePersonaId];
      const audit = makeAuditEntry(
        `${persona.nameEn} (UAE PASS)`,
        `${persona.nameAr} (الهوية الرقمية)`,
        "Restored standard DoH premarital sovereign permissions",
        "استعادة الصلاحيات القياسية لبرنامج الفحص قبل الزواج",
        "SCOPE-01..03",
        "VERIFIED"
      );
      return {
        ...prev,
        partnerConsent: "authorized",
        consentScopes: INITIAL_CONSENT_SCOPES,
        auditLog: [audit, ...prev.auditLog.slice(0, 14)],
      };
    });

    pushToast(
      persisted.locale === "ar"
        ? "تمت استعادة إعدادات الخصوصية القياسية"
        : "Standard sovereign consent scopes restored.",
      "success"
    );
  }, [persisted.locale, pushToast]);

  const addUploadedVariants = useCallback(
    (incoming: GeneticVariant[], sourceName: string) => {
      updatePersistedState((prev) => {
        const persona = PERSONAS[prev.activePersonaId];
        const existingGenes = new Set(
          prev.variants.map((v) => `${v.gene}-${v.hgvsC}`)
        );
        const uniqueIncoming = incoming.filter(
          (v) => !existingGenes.has(`${v.gene}-${v.hgvsC}`)
        );
        const audit = makeAuditEntry(
          persona.nameEn,
          persona.nameAr,
          `Imported curated genomic panel (${sourceName})`,
          `استيراد ملف متغيرات جينية (${sourceName})`,
          "VAULT-VCF",
          "VERIFIED"
        );
        return {
          ...prev,
          variants: [...uniqueIncoming, ...prev.variants],
          auditLog: [audit, ...prev.auditLog.slice(0, 14)],
        };
      });

      pushToast(
        persisted.locale === "ar"
          ? `تم تحليل وإضافة متغيرات من ${sourceName}`
          : `Parsed ${incoming.length} annotated record(s) from ${sourceName}`,
        "success"
      );
    },
    [persisted.locale, pushToast]
  );

  const resetVariantsToBaseline = useCallback(() => {
    updatePersistedState((prev) => ({
      ...prev,
      variants: INITIAL_VARIANTS,
    }));
    pushToast(
      persisted.locale === "ar"
        ? "تمت استعادة المتغيرات المرجعية الأربعة"
        : "Restored 4 baseline Emirati premarital variants.",
      "info"
    );
  }, [persisted.locale, pushToast]);

  const toggleReflectionCheck = useCallback((checkId: string) => {
    updatePersistedState((prev) => ({
      ...prev,
      reflectionChecks: prev.reflectionChecks.map((c) =>
        c.id === checkId ? { ...c, checked: !c.checked } : c
      ),
    }));
  }, []);

  const setPedigreeFileName = useCallback(
    (name: string | null) => {
      updatePersistedState((prev) => ({
        ...prev,
        pedigreeFileName: name,
      }));
      if (name) {
        pushToast(
          persisted.locale === "ar"
            ? `تم إرفاق شجرة العائلة: ${name}`
            : `Attached family pedigree record: ${name}`,
          "success"
        );
      }
    },
    [persisted.locale, pushToast]
  );

  const setAppointmentSlot = useCallback(
    (slot: AppointmentSlot) => {
      updatePersistedState((prev) => {
        const audit = makeAuditEntry(
          "Fatima Al Mansoori (UAE PASS)",
          "فاطمة المنصوري (الهوية الرقمية)",
          `Updated genetic counseling appointment to ${slot.dateEn} ${slot.timeEn}`,
          `تحديث موعد الاستشارة الوراثية إلى ${slot.dateAr}`,
          "COUNSELING",
          "VERIFIED"
        );
        return {
          ...prev,
          appointment: slot,
          auditLog: [audit, ...prev.auditLog.slice(0, 14)],
        };
      });
      pushToast(
        persisted.locale === "ar"
          ? `تم تأكيد الموعد الجديد: ${slot.dateAr}`
          : `Appointment confirmed for ${slot.dateEn} · ${slot.timeEn}`,
        "success"
      );
    },
    [persisted.locale, pushToast]
  );

  const sendCoordinatorMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const nowTime = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    updatePersistedState((prev) => {
      const persona = PERSONAS[prev.activePersonaId];
      const userMsg: CoordinatorMessage = {
        id: `msg-${Date.now()}`,
        sender: "user",
        authorEn: persona.nameEn,
        authorAr: persona.nameAr,
        timestamp: `${nowTime} GST`,
        textEn: trimmed,
        textAr: trimmed,
      };
      return {
        ...prev,
        coordinatorMessages: [...prev.coordinatorMessages, userMsg],
      };
    });

    window.setTimeout(() => {
      updatePersistedState((prev) => {
        const reply: CoordinatorMessage = {
          id: `msg-rep-${Date.now()}`,
          sender: "coordinator",
          authorEn: "Salma Al Nuaimi · Care Coordinator",
          authorAr: "سلمى النعيمي · منسقة الرعاية",
          timestamp: `${nowTime} GST`,
          textEn:
            "Received securely inside the Abu Dhabi clinical thread. Dr. Reem has been notified before your upcoming counseling consultation.",
          textAr:
            "تم استلام رسالتك بأمان ضمن القناة السريرية، وتم إشعار د. ريم قبل موعد الجلسة.",
        };
        return {
          ...prev,
          coordinatorMessages: [...prev.coordinatorMessages, reply],
        };
      });
    }, 650);
  }, []);

  const updateCounselorNotes = useCallback((caseId: string, notes: string) => {
    updatePersistedState((prev) => ({
      ...prev,
      counselorCases: prev.counselorCases.map((c) =>
        c.id === caseId ? { ...c, counselorNotes: notes } : c
      ),
    }));
  }, []);

  const certifyCounselorCase = useCallback(
    (caseId: string) => {
      const stamp = formatGstNow();
      updatePersistedState((prev) => {
        const audit = makeAuditEntry(
          "Dr. Reem Al Hashimi (#DOH-GC-4092)",
          "د. ريم الهاشمي (#DOH-GC-4092)",
          `Clinically certified counseling summary for ${caseId.toUpperCase()}`,
          `اعتماد وتوقيع ملخص الإرشاد الوراثي للحالة ${caseId.toUpperCase()}`,
          "DOH-SIGN",
          "VERIFIED"
        );
        return {
          ...prev,
          counselorCases: prev.counselorCases.map((c) =>
            c.id === caseId
              ? {
                  ...c,
                  certified: true,
                  urgency: "Signed Off",
                  certifiedAt: stamp,
                }
              : c
          ),
          auditLog: [audit, ...prev.auditLog.slice(0, 14)],
        };
      });

      pushToast(
        persisted.locale === "ar"
          ? "تم توثيق التقرير السريري بتوقيع دائرة الصحة"
          : "Clinical summary signed off and anchored to DoH compliance record.",
        "success"
      );
    },
    [persisted.locale, pushToast]
  );

  const escalateCounselorCase = useCallback(
    (caseId: string, reason: string) => {
      updatePersistedState((prev) => {
        const audit = makeAuditEntry(
          "Dr. Reem Al Hashimi (#DOH-GC-4092)",
          "د. ريم الهاشمي (#DOH-GC-4092)",
          `Requested DoH Multidisciplinary Genomics Board review (${caseId})`,
          `طلب مراجعة المجلس السريري متعدد التخصصات (${caseId})`,
          "MDT-BOARD",
          "PENDING"
        );
        return {
          ...prev,
          counselorCases: prev.counselorCases.map((c) =>
            c.id === caseId
              ? {
                  ...c,
                  escalatedToBoard: true,
                  counselorNotes: `${c.counselorNotes}\n[MDT Board Escalation]: ${reason}`,
                }
              : c
          ),
          auditLog: [audit, ...prev.auditLog.slice(0, 14)],
        };
      });

      pushToast(
        persisted.locale === "ar"
          ? "تم رفع الملف إلى مجلس الجينوم السريري للمراجعة"
          : "Case queued for DoH Multidisciplinary Genomics Board.",
        "info"
      );
    },
    [persisted.locale, pushToast]
  );

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const activePersona = PERSONAS[persisted.activePersonaId];
  const isRtl = persisted.locale === "ar";

  const value = useMemo<AmanGeneContextValue>(
    () => ({
      locale: persisted.locale,
      isRtl,
      setLocale,
      toggleLocale,
      activePersonaId: persisted.activePersonaId,
      activePersona,
      setActivePersonaId,
      partnerConsent: persisted.partnerConsent,
      setPartnerConsentStatus,
      consentScopes: persisted.consentScopes,
      toggleConsentScope,
      revokeAllConsents,
      restoreDefaultConsents,
      auditLog: persisted.auditLog,
      variants: persisted.variants,
      addUploadedVariants,
      resetVariantsToBaseline,
      reflectionChecks: persisted.reflectionChecks,
      toggleReflectionCheck,
      pedigreeFileName: persisted.pedigreeFileName,
      setPedigreeFileName,
      appointment: persisted.appointment,
      setAppointmentSlot,
      coordinatorMessages: persisted.coordinatorMessages,
      sendCoordinatorMessage,
      counselorCases: persisted.counselorCases,
      updateCounselorNotes,
      certifyCounselorCase,
      escalateCounselorCase,
      notifications,
      markAllNotificationsRead,
      toasts,
      pushToast,
      dismissToast,
    }),
    [
      persisted,
      isRtl,
      setLocale,
      toggleLocale,
      activePersona,
      setActivePersonaId,
      setPartnerConsentStatus,
      toggleConsentScope,
      revokeAllConsents,
      restoreDefaultConsents,
      addUploadedVariants,
      resetVariantsToBaseline,
      toggleReflectionCheck,
      setPedigreeFileName,
      setAppointmentSlot,
      sendCoordinatorMessage,
      updateCounselorNotes,
      certifyCounselorCase,
      escalateCounselorCase,
      notifications,
      markAllNotificationsRead,
      toasts,
      pushToast,
      dismissToast,
    ]
  );

  return (
    <AmanGeneContext.Provider value={value}>
      {children}
    </AmanGeneContext.Provider>
  );
}

export function useAmanGene() {
  const ctx = useContext(AmanGeneContext);
  if (!ctx) {
    throw new Error("useAmanGene must be used inside AmanGeneProvider");
  }
  return ctx;
}
