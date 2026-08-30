"use client";

import { useState } from "react";

type Notification = {
  id: number;
  title: string;
  description: string;
  time: string;
  unread: boolean;
};

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "AI Workforce Ready",
    description:
      "Your GrowthAI workspace is ready for AI employee configuration.",
    time: "Just now",
    unread: true,
  },
  {
    id: 2,
    title: "Plan & Billing",
    description:
      "Your billing workspace is available to review your current plan.",
    time: "Today",
    unread: true,
  },
  {
    id: 3,
    title: "Website Connection",
    description:
      "Connect your business website to prepare your GrowthAI workflow.",
    time: "Yesterday",
    unread: false,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  function markAsRead(id: number) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
  }

  function markAllAsRead() {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  }

  return (
    <main className="min-h-screen bg-[#06090F] px-5 py-8 text-white sm:px-8 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
                Notifications
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
                Stay in control.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45 sm:text-base">
                Important updates from your GrowthAI workspace,
                AI workforce, billing, and connected systems.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/60 transition hover:bg-white/[0.07] hover:text-white"
              >
                Mark all as read
              </button>
            )}
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
          <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4 sm:px-6">
            <div>
              <p className="text-sm font-medium">
                Recent notifications
              </p>

              <p className="mt-1 text-xs text-white/30">
                {unreadCount} unread
              </p>
            </div>
          </div>

          <div>
            {notifications.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-sm font-medium">
                  You&apos;re all caught up.
                </p>

                <p className="mt-2 text-sm text-white/35">
                  New GrowthAI updates will appear here.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <article
                  key={notification.id}
                  className={[
                    "flex gap-4 border-b border-white/[0.06] p-5 transition last:border-b-0 sm:p-6",
                    notification.unread
                      ? "bg-white/[0.035]"
                      : "bg-transparent",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                      notification.unread
                        ? "bg-white"
                        : "bg-white/15",
                    ].join(" ")}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <h2 className="text-sm font-semibold">
                        {notification.title}
                      </h2>

                      <span className="text-xs text-white/25">
                        {notification.time}
                      </span>
                    </div>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
                      {notification.description}
                    </p>

                    {notification.unread && (
                      <button
                        type="button"
                        onClick={() => markAsRead(notification.id)}
                        className="mt-4 text-xs font-medium text-white/50 underline underline-offset-4 transition hover:text-white"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
