"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AmanGeneLogo } from "@/components/AmanGeneLogo";
import { useAmanGene } from "@/context/AmanGeneContext";
import { PERSONAS, PersonaId, UI_COPY } from "@/lib/amangene-data";

interface NavItem {
  href: string;
  icon: string;
  labelKey: keyof typeof UI_COPY.en;
}

const CITIZEN_NAV: NavItem[] = [
  { href: "/", icon: "dashboard", labelKey: "navOverview" },
  { href: "/genetic-screening", icon: "genetics", labelKey: "navScreening" },
  {
    href: "/partner-comparison",
    icon: "diversity_2",
    labelKey: "navPartner",
  },
  {
    href: "/consent-privacy",
    icon: "verified_user",
    labelKey: "navConsent",
  },
  {
    href: "/counseling-journey",
    icon: "clinical_notes",
    labelKey: "navCounseling",
  },
];

const WORKFLOW_NAV: NavItem[] = [
  {
    href: "/counselor-workspace",
    icon: "medical_services",
    labelKey: "navCounselor",
  },
  {
    href: "/partner-consent",
    icon: "how_to_reg",
    labelKey: "navPartnerPortal",
  },
  { href: "/partner-ping", icon: "sms", labelKey: "navPing" },
  { href: "/login", icon: "passkey", labelKey: "navLogin" },
];

const MOBILE_TABS: NavItem[] = [
  { href: "/", icon: "dashboard", labelKey: "navOverview" },
  { href: "/genetic-screening", icon: "genetics", labelKey: "navScreening" },
  {
    href: "/partner-comparison",
    icon: "diversity_2",
    labelKey: "navPartner",
  },
  {
    href: "/consent-privacy",
    icon: "verified_user",
    labelKey: "navConsent",
  },
  {
    href: "/counseling-journey",
    icon: "clinical_notes",
    labelKey: "navCounseling",
  },
];

export function AppShell({
  children,
  variant = "full",
}: {
  children: React.ReactNode;
  variant?: "full" | "minimal";
}) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    locale,
    toggleLocale,
    activePersona,
    activePersonaId,
    setActivePersonaId,
    partnerConsent,
    notifications,
    markAllNotificationsRead,
    toasts,
    dismissToast,
  } = useAmanGene();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const t = UI_COPY[locale];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleQuickPersonaSwitch = (id: PersonaId) => {
    setActivePersonaId(id);
    setRoleMenuOpen(false);
    setMobileMenuOpen(false);
    const targetRoute = PERSONAS[id].defaultRoute;
    if (pathname !== targetRoute) {
      router.push(targetRoute);
    }
  };

  if (variant === "minimal") {
    return (
      <div className="min-h-screen flex flex-col bg-surface text-on-surface">
        <header className="no-print sticky top-0 z-30 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/60 px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
            >
              <AmanGeneLogo size={34} />
              <div className="hidden sm:block">
                <p className="text-title-md text-primary leading-tight">
                  {t.brandName}
                </p>
                <p className="text-label-sm text-on-surface-variant">
                  {t.brandSub}
                </p>
              </div>
            </Link>
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-tertiary-fixed px-3 py-1 text-label-sm text-on-tertiary-fixed-variant border border-tertiary-fixed-dim/50">
              <span className="material-symbols-outlined !text-[15px]">
                info
              </span>
              {t.ethicsNotice}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-1.5 text-label-md text-primary hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined !text-[17px]">
                dashboard
              </span>
              <span className="hidden sm:inline">{t.navOverview}</span>
            </Link>
            <Link
              href="/partner-comparison"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-1.5 text-label-md text-secondary hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined !text-[17px]">
                diversity_2
              </span>
              <span>{t.navPartner}</span>
            </Link>
            <button
              type="button"
              onClick={toggleLocale}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-label-md text-on-primary hover:bg-primary-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined !text-[16px]">
                translate
              </span>
              <span>{locale === "en" ? "العربية" : "English"}</span>
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col">{children}</main>

        <footer className="no-print border-t border-outline-variant/40 bg-surface-container-low px-4 md:px-8 py-4 text-body-sm text-on-surface-variant flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Image
              src="/images/doh-emblem.png"
              alt="Department of Health Abu Dhabi"
              width={40}
              height={22}
              className="h-[22px] w-[40px] rounded-sm object-contain bg-white p-0.5"
            />
            <span className="font-medium text-on-surface">
              {t.footerCompliance}
            </span>
          </div>
          <p className="text-center sm:text-end">{t.ethicsNotice}</p>
        </footer>

        <ToastViewport toasts={toasts} dismissToast={dismissToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-surface text-on-surface">
      {/* Desktop Sovereign Sidebar */}
      <aside className="no-print hidden lg:flex w-72 shrink-0 flex-col bg-primary text-on-primary border-e border-primary-container sticky top-0 h-screen">
        <div className="p-6 border-b border-primary-container flex items-center gap-3">
          <AmanGeneLogo size={38} dark />
          <div className="min-w-0">
            <p className="text-title-md text-on-primary truncate">
              {t.brandName}
            </p>
            <p className="text-label-sm text-on-primary-container truncate">
              {t.brandSub}
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
          <div>
            <p className="px-3 mb-2 text-label-sm uppercase text-on-primary-container">
              {locale === "ar" ? "مساحة المواطن" : "Citizen & Family Flow"}
            </p>
            <div className="space-y-1">
              {CITIZEN_NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-md transition-colors ${
                      active
                        ? "bg-secondary text-on-secondary font-medium shadow-sm"
                        : "text-primary-fixed-dim hover:bg-primary-container hover:text-on-primary"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined !text-[20px] ${
                        active ? "material-symbols-filled" : ""
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="truncate flex-1">{t[item.labelKey]}</span>
                    {item.href === "/partner-comparison" && (
                      <span
                        className={`h-2 w-2 rounded-full ${
                          partnerConsent === "authorized"
                            ? "bg-secondary-container"
                            : "bg-tertiary-fixed-dim"
                        }`}
                        title={partnerConsent}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <p className="px-3 mb-2 text-label-sm uppercase text-on-primary-container">
              {locale === "ar"
                ? "بوابات الشريك والاستشاري"
                : "Partner & Clinical Flows"}
            </p>
            <div className="space-y-1">
              {WORKFLOW_NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-md transition-colors ${
                      active
                        ? "bg-secondary text-on-secondary font-medium shadow-sm"
                        : "text-primary-fixed-dim hover:bg-primary-container hover:text-on-primary"
                    }`}
                  >
                    <span className="material-symbols-outlined !text-[20px]">
                      {item.icon}
                    </span>
                    <span className="truncate">{t[item.labelKey]}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Active Persona Card in Sidebar */}
        <div className="p-4 border-t border-primary-container bg-primary-container/50 space-y-3">
          <div className="flex items-center gap-3">
            <Image
              src={activePersona.avatarMain}
              alt={activePersona.nameEn}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover border border-secondary-fixed-dim/50"
            />
            <div className="min-w-0 flex-1">
              <p className="text-body-sm font-semibold text-on-primary truncate">
                {locale === "ar" ? activePersona.nameAr : activePersona.nameEn}
              </p>
              <p className="text-label-sm text-secondary-fixed truncate">
                {locale === "ar" ? activePersona.roleAr : activePersona.roleEn}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {(["fatima", "sultan", "reem"] as PersonaId[]).map((pid) => {
              const selected = activePersonaId === pid;
              const shortLabel =
                pid === "fatima"
                  ? locale === "ar"
                    ? "فاطمة"
                    : "Fatima"
                  : pid === "sultan"
                  ? locale === "ar"
                    ? "سلطان"
                    : "Sultan"
                  : locale === "ar"
                  ? "د. ريم"
                  : "Dr. Reem";
              return (
                <button
                  key={pid}
                  type="button"
                  onClick={() => handleQuickPersonaSwitch(pid)}
                  className={`px-2 py-1 rounded-md text-label-sm transition-colors cursor-pointer ${
                    selected
                      ? "bg-secondary-container text-on-secondary-fixed font-semibold"
                      : "bg-primary text-primary-fixed-dim hover:bg-secondary/40 hover:text-on-primary"
                  }`}
                >
                  {shortLabel}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 pt-1 text-label-sm text-on-primary-container">
            <Image
              src="/images/doh-emblem.png"
              alt="DoH"
              width={33}
              height={18}
              className="h-[18px] w-[33px] rounded-sm object-contain bg-white/90 p-0.5 shrink-0"
            />
            <span className="truncate">
              {locale === "ar"
                ? "استضافة سيادية · أبوظبي"
                : "Abu Dhabi Sovereign Node"}
            </span>
          </div>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="no-print sticky top-0 z-30 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/60 px-4 md:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg border border-outline-variant text-primary hover:bg-surface-container cursor-pointer"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>

            <Link href="/" className="lg:hidden flex items-center gap-2">
              <AmanGeneLogo size={30} />
              <span className="text-title-md text-primary hidden sm:inline">
                {t.brandName}
              </span>
            </Link>

            <div className="hidden md:inline-flex items-center gap-2 rounded-full bg-tertiary-fixed px-3 py-1 text-label-md text-on-tertiary-fixed-variant border border-tertiary-fixed-dim/50">
              <span className="material-symbols-outlined !text-[16px]">
                policy
              </span>
              <span>{t.ethicsNotice}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 relative">
            <span className="hidden xl:inline-flex items-center gap-1.5 rounded-full bg-secondary-container/60 px-3 py-1 text-label-sm text-on-secondary-fixed-variant">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              {locale === "ar"
                ? "خادم أبوظبي السيادي متصل"
                : "ADHICS Sovereign Enclave Active"}
            </span>

            <button
              type="button"
              onClick={toggleLocale}
              className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-1.5 text-label-md text-primary hover:bg-surface-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined !text-[17px]">
                translate
              </span>
              <span>{locale === "en" ? "العربية" : "EN"}</span>
            </button>

            {/* Notifications Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotifOpen((prev) => !prev);
                  setRoleMenuOpen(false);
                }}
                aria-label="Notifications"
                className="relative inline-flex items-center justify-center h-9 w-9 rounded-lg border border-outline-variant bg-surface-container-lowest text-primary hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined !text-[20px]">
                  notifications
                </span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -end-1 h-4 min-w-4 px-1 rounded-full bg-error text-on-error text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute end-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl bg-surface-container-lowest border border-outline-variant shadow-xl p-4 z-50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-title-md text-primary">
                      {t.notificationsTitle}
                    </p>
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="text-label-sm text-secondary hover:underline cursor-pointer"
                    >
                      {t.markAllRead}
                    </button>
                  </div>
                  <div className="space-y-2.5">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-lg border text-body-sm ${
                          n.read
                            ? "border-outline-variant/40 bg-surface-container-low/50 text-on-surface-variant"
                            : "border-secondary/30 bg-secondary-container/25 text-on-surface"
                        }`}
                      >
                        <p className="font-medium">
                          {locale === "ar" ? n.titleAr : n.titleEn}
                        </p>
                        <p className="text-label-sm text-on-surface-variant mt-1">
                          {locale === "ar" ? n.timeAr : n.timeEn}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Active Persona Quick Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setRoleMenuOpen((prev) => !prev);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest ps-1.5 pe-3 py-1 hover:bg-surface-container transition-colors cursor-pointer"
              >
                <Image
                  src={activePersona.avatarMain}
                  alt={activePersona.nameEn}
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full object-cover"
                />
                <span className="hidden sm:inline text-label-md text-primary max-w-[130px] truncate">
                  {locale === "ar" ? activePersona.nameAr : activePersona.nameEn}
                </span>
                <span className="material-symbols-outlined !text-[16px] text-on-surface-variant">
                  expand_more
                </span>
              </button>

              {roleMenuOpen && (
                <div className="absolute end-0 mt-2 w-72 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-xl p-3 z-50 space-y-2">
                  <p className="px-2 text-label-sm uppercase text-on-surface-variant">
                    {t.switchRole}
                  </p>
                  {(["fatima", "sultan", "reem"] as PersonaId[]).map((pid) => {
                    const p = PERSONAS[pid];
                    const selected = activePersonaId === pid;
                    return (
                      <button
                        key={pid}
                        type="button"
                        onClick={() => handleQuickPersonaSwitch(pid)}
                        className={`w-full flex items-center gap-3 p-2 rounded-lg text-start transition-colors cursor-pointer ${
                          selected
                            ? "bg-secondary-container/60 text-on-secondary-fixed"
                            : "hover:bg-surface-container text-on-surface"
                        }`}
                      >
                        <Image
                          src={p.avatarMain}
                          alt={p.nameEn}
                          width={34}
                          height={34}
                          className="h-8 w-8 rounded-full object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-body-sm font-semibold truncate">
                            {locale === "ar" ? p.nameAr : p.nameEn}
                          </p>
                          <p className="text-label-sm text-on-surface-variant truncate">
                            {locale === "ar" ? p.roleAr : p.roleEn}
                          </p>
                        </div>
                        {selected && (
                          <span className="material-symbols-outlined !text-[18px] text-secondary">
                            check_circle
                          </span>
                        )}
                      </button>
                    );
                  })}
                  <div className="pt-2 border-t border-outline-variant/50">
                    <Link
                      href="/login"
                      onClick={() => setRoleMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary text-on-primary py-2 text-label-md hover:bg-primary-container transition-colors"
                    >
                      <span className="material-symbols-outlined !text-[17px]">
                        passkey
                      </span>
                      <span>{t.navLogin}</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Ethics Ribbon on mobile */}
        <div className="no-print md:hidden bg-tertiary-fixed/80 border-b border-tertiary-fixed-dim/40 px-4 py-1.5 flex items-center justify-center gap-2 text-label-sm text-on-tertiary-fixed-variant">
          <span className="material-symbols-outlined !text-[14px]">policy</span>
          <span>{t.ethicsNotice}</span>
        </div>

        {/* Page Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6">
          {children}
        </main>

        {/* Compliance Footer (padded above mobile bottom tab bar) */}
        <footer className="no-print mt-auto border-t border-outline-variant/50 bg-surface-container-low px-4 md:px-8 py-5 pb-24 lg:pb-5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-body-sm text-on-surface-variant">
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/doh-emblem.png"
                alt="Department of Health Abu Dhabi"
                width={48}
                height={26}
                className="h-[26px] w-[48px] rounded-sm object-contain bg-white p-0.5 border border-outline-variant/40 shrink-0"
              />
              <div>
                <p className="font-semibold text-on-surface">
                  {t.footerCompliance}
                </p>
                <p className="text-label-sm">{t.ethicsSub}</p>
              </div>
            </div>
            <p className="max-w-xl text-body-sm">{t.footerPrivacy}</p>
          </div>
        </footer>
      </div>

      {/* Mobile Slide-Over Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-primary/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-80 max-w-[85vw] bg-primary text-on-primary h-full flex flex-col p-5 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-primary-container">
              <div className="flex items-center gap-2.5">
                <AmanGeneLogo size={34} dark />
                <span className="text-title-md text-on-primary">
                  {t.brandName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-primary-fixed-dim hover:bg-primary-container cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="py-4 space-y-1 flex-1">
              {[...CITIZEN_NAV, ...WORKFLOW_NAV].map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-md ${
                      active
                        ? "bg-secondary text-on-secondary font-medium"
                        : "text-primary-fixed-dim hover:bg-primary-container"
                    }`}
                  >
                    <span className="material-symbols-outlined !text-[20px]">
                      {item.icon}
                    </span>
                    <span>{t[item.labelKey]}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Fixed Bottom Navigation Bar (Screen 09 alignment) */}
      <nav className="no-print lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant/60 px-2 py-1.5 grid grid-cols-5 gap-1">
        {MOBILE_TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-1 rounded-lg text-[11px] font-medium transition-colors ${
                active
                  ? "text-secondary bg-secondary-container/40 font-semibold"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <span
                className={`material-symbols-outlined !text-[20px] mb-0.5 ${
                  active ? "material-symbols-filled" : ""
                }`}
              >
                {tab.icon}
              </span>
              <span className="truncate max-w-full px-1">
                {tab.labelKey === "navOverview"
                  ? locale === "ar"
                    ? "الرئيسية"
                    : "Home"
                  : tab.labelKey === "navScreening"
                  ? locale === "ar"
                    ? "الفحص"
                    : "Genes"
                  : tab.labelKey === "navPartner"
                  ? locale === "ar"
                    ? "الشريك"
                    : "Compare"
                  : tab.labelKey === "navConsent"
                  ? locale === "ar"
                    ? "الخصوصية"
                    : "Privacy"
                  : locale === "ar"
                  ? "الإرشاد"
                  : "Care"}
              </span>
            </Link>
          );
        })}
      </nav>

      <ToastViewport toasts={toasts} dismissToast={dismissToast} />
    </div>
  );
}

function ToastViewport({
  toasts,
  dismissToast,
}: {
  toasts: { id: string; message: string; tone: "success" | "warning" | "info" }[];
  dismissToast: (id: string) => void;
}) {
  if (toasts.length === 0) return null;
  return (
    <div className="no-print fixed bottom-20 lg:bottom-6 end-4 z-50 flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-2.5 rounded-xl p-3.5 shadow-lg border text-body-sm ${
            toast.tone === "warning"
              ? "bg-tertiary-container text-on-tertiary border-on-tertiary-container/40"
              : toast.tone === "info"
              ? "bg-primary text-on-primary border-secondary/40"
              : "bg-secondary text-on-secondary border-secondary-fixed/40"
          }`}
        >
          <span className="material-symbols-outlined !text-[18px] mt-0.5 shrink-0">
            {toast.tone === "warning"
              ? "gpp_maybe"
              : toast.tone === "info"
              ? "info"
              : "verified"}
          </span>
          <p className="flex-1">{toast.message}</p>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="opacity-75 hover:opacity-100 cursor-pointer"
          >
            <span className="material-symbols-outlined !text-[16px]">
              close
            </span>
          </button>
        </div>
      ))}
    </div>
  );
}
