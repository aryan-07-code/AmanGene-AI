"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AppShell } from "@/components/AppShell";
import { useAmanGene } from "@/context/AmanGeneContext";

export default function PartnerPingPage() {
  const { locale, setPartnerConsentStatus, pushToast } = useAmanGene();
  const ar = locale === "ar";

  const [channel, setChannel] = useState<"whatsapp" | "sms">("whatsapp");
  const [pingSentCount, setPingSentCount] = useState(1);

  const handleDispatchPing = () => {
    setPartnerConsentStatus(
      "pending",
      "Fatima Al Mansoori (Ping Gateway)",
      "فاطمة المنصوري (بوابة الإشعارات)"
    );
    setPingSentCount((c) => c + 1);
    pushToast(
      ar
        ? "تم إرسال دعوة التفويض الآمنة إلى هاتف سلطان الزعابي"
        : "Dispatched encrypted consent link to Sultan Al Zaabi.",
      "info"
    );
  };

  return (
    <AppShell variant="minimal">
      <div className="max-w-5xl mx-auto w-full px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Explanatory Controls */}
        <div className="lg:col-span-6 space-y-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-container text-on-secondary-fixed px-3 py-1 text-label-sm">
            <span className="material-symbols-outlined !text-[15px]">
              notifications_active
            </span>
            {ar
              ? "محاكاة إشعار الشريك (واتساب وSMS)"
              : "Counterparty Out-of-Band Notification Flow"}
          </span>

          <h1 className="text-headline-lg-mobile md:text-headline-lg text-primary">
            {ar
              ? "دعوة سلطان الزعابي للموافقة المتبادلة"
              : "Partner Reciprocal Consent Ping Simulator"}
          </h1>

          <p className="text-body-md text-on-surface-variant">
            {ar
              ? "يستلم الشريك رابطاً مشفراً لمرة واحدة بدون تضمين أي بيانات جينية داخل الرسالة النصية أو تطبيق المحادثة."
              : "Counterparties receive a zero-PHI one-time sovereign notification link. Zero genetic variants or personal diagnoses ever travel over WhatsApp or SMS."}
          </p>

          {/* Channel Selector */}
          <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-4 space-y-3">
            <p className="text-label-md text-primary uppercase">
              {ar ? "اختر قناة المحاكاة" : "Select Simulated Notification Channel"}
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setChannel("whatsapp")}
                className={`rounded-lg px-4 py-2.5 text-label-md border transition-colors cursor-pointer ${
                  channel === "whatsapp"
                    ? "bg-primary text-on-primary border-primary"
                    : "bg-surface-container-low text-on-surface border-outline-variant hover:border-secondary"
                }`}
              >
                {ar ? "واتساب الموثق" : "Verified WhatsApp"}
              </button>
              <button
                type="button"
                onClick={() => setChannel("sms")}
                className={`rounded-lg px-4 py-2.5 text-label-md border transition-colors cursor-pointer ${
                  channel === "sms"
                    ? "bg-primary text-on-primary border-primary"
                    : "bg-surface-container-low text-on-surface border-outline-variant hover:border-secondary"
                }`}
              >
                {ar ? "رسالة SMS حكومية" : "Abu Dhabi Gov SMS"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleDispatchPing}
              className="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-label-md text-primary hover:bg-surface-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined !text-[18px]">
                send
              </span>
              <span>
                {ar
                  ? `إرسال إشعار تجريبي (#${pingSentCount})`
                  : `Send Lock & Ping (#${pingSentCount})`}
              </span>
            </button>

            <Link
              href="/partner-consent"
              className="inline-flex items-center gap-2 rounded-lg bg-secondary text-on-secondary px-5 py-2.5 text-label-md font-semibold hover:bg-secondary/90 transition-colors"
            >
              <span>
                {ar
                  ? "فتح شاشة تفويض سلطان"
                  : "Continue to Sultan Auth Screen →"}
              </span>
            </Link>
          </div>
        </div>

        {/* Right Realistic Mobile Frame */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-sm rounded-[2rem] border-8 border-primary bg-surface-container-lowest shadow-2xl overflow-hidden">
            {/* Phone Status Strip */}
            <div className="bg-primary text-on-primary px-5 py-2.5 flex items-center justify-between text-label-sm">
              <span>09:41 AM</span>
              <span className="rounded-full bg-primary-container px-2.5 py-0.5 text-[10px]">
                UAE 5G · Etisalat
              </span>
              <span>98%</span>
            </div>

            {channel === "whatsapp" ? (
              /* WhatsApp Screen 11 */
              <div className="bg-[#e8f0ec] min-h-[470px] flex flex-col">
                <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3">
                  <Image
                    src="/images/doh-emblem.png"
                    alt="AmanGene Official"
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full bg-white p-1 object-contain"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-sm truncate">
                        AmanGene DoH Abu Dhabi
                      </p>
                      <span className="material-symbols-outlined !text-[15px] text-secondary-container">
                        verified
                      </span>
                    </div>
                    <p className="text-[11px] text-white/80">
                      {ar ? "حساب حكومي موثق" : "Official Business Account"}
                    </p>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                  <div className="rounded-xl bg-white p-4 shadow-sm border border-outline-variant/40 space-y-3 text-body-sm">
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container text-on-secondary-fixed px-2.5 py-0.5 text-label-sm">
                      Zero-PHI Sovereign Alert
                    </span>
                    <p className="font-semibold text-primary">
                      {ar
                        ? "مرحباً سلطان الزعابي،"
                        : "Marhaba Sultan Al Zaabi,"}
                    </p>
                    <p className="text-on-surface-variant">
                      {ar
                        ? "دعتك فاطمة المنصوري لإتمام الموافقة المتبادلة لفحص الحامل الوراثي قبل الزواج عبر الهوية الرقمية الإماراتية."
                        : "Fatima Al Mansoori invited you to review and sign reciprocal premarital carrier comparison consent via UAE PASS."}
                    </p>
                    <div className="rounded-lg bg-surface-container-low p-2.5 text-code-sm text-secondary break-all">
                      https://amangene.doh.gov.ae/auth/sultan-8842
                    </div>
                    <Link
                      href="/partner-consent"
                      className="flex items-center justify-center gap-2 w-full rounded-lg bg-[#075E54] text-white py-2.5 text-label-md font-semibold hover:opacity-95 transition-opacity"
                    >
                      <span className="material-symbols-outlined !text-[18px]">
                        fingerprint
                      </span>
                      <span>
                        {ar
                          ? "فتح بوابة الموافقة (UAE PASS)"
                          : "Open Authorization Portal"}
                      </span>
                    </Link>
                  </div>

                  <p className="text-center text-label-sm text-on-surface-variant">
                    {ar
                      ? "تشفير تام من الطرف إلى الطرف · لا تتضمن الرسالة أي نتائج طبية"
                      : "End-to-end encrypted · Zero clinical results included"}
                  </p>
                </div>
              </div>
            ) : (
              /* SMS Screen 12 */
              <div className="bg-surface-container-low min-h-[470px] flex flex-col">
                <div className="bg-surface-container-lowest border-b border-outline-variant/60 px-4 py-3 flex items-center gap-3">
                  <span className="h-9 w-9 rounded-full bg-primary text-on-primary flex items-center justify-center">
                    <span className="material-symbols-outlined !text-[18px]">
                      shield
                    </span>
                  </span>
                  <div>
                    <p className="text-title-md text-primary">DOH-AMANGENE</p>
                    <p className="text-label-sm text-secondary">
                      {ar ? "مرسل حكومي موثق" : "Verified Abu Dhabi Sender"}
                    </p>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <p className="text-center text-label-sm text-on-surface-variant">
                      Today · 09:40 GST
                    </p>
                    <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-4 shadow-xs space-y-3 text-body-sm">
                      <p className="text-on-surface font-medium">
                        {ar
                          ? "دائرة الصحة - أبوظبي (أمان جين): سلطان الزعابي، لديك طلب موافقة متبادلة مع فاطمة المنصوري لمقارنة نتائج الفحص قبل الزواج. لم تُرفق أي بيانات وراثية في هذه الرسالة."
                          : "[DoH Abu Dhabi · AmanGene AI] Sultan Al Zaabi: Fatima Al Mansoori has shared a reciprocal consent request for premarital carrier comparison. No genomic data is transmitted via SMS."}
                      </p>
                      <Link
                        href="/partner-consent"
                        className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-primary text-on-primary py-2.5 text-label-md hover:bg-primary-container transition-colors"
                      >
                        <span className="material-symbols-outlined !text-[17px]">
                          open_in_new
                        </span>
                        <span>
                          {ar
                            ? "تأكيد الهوية عبر UAE PASS"
                            : "Verify via UAE PASS"}
                        </span>
                      </Link>
                    </div>
                  </div>

                  <p className="text-center text-label-sm text-on-surface-variant">
                    {ar
                      ? "نموذج تعليمي — ليس تشخيصاً طبياً"
                      : "Educational prototype — not a diagnosis"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
