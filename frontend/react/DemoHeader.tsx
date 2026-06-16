"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./DemoHeader.module.css";

type DemoUser = {
  id: string;
  nickname: string;
  role: "DEMO";
};

type MeResponse = {
  loggedIn: boolean;
  user: DemoUser | null;
};

type DemoProject = {
  name: string;
  url: string;
};

type DemoHeaderProps = {
  apiBaseUrl?: string;
  projects?: DemoProject[];
};

const DEFAULT_API_BASE_URL = "https://auth.sjw-project.site";

const DEFAULT_PROJECTS: DemoProject[] = [
  { name: "Demo Home", url: "https://auth.sjw-project.site" },
  { name: "COCO", url: "https://coco.sjw-project.site" },
];

export function DemoHeader({
  apiBaseUrl = DEFAULT_API_BASE_URL,
  projects = DEFAULT_PROJECTS,
}: DemoHeaderProps) {
  const [me, setMe] = useState<MeResponse>({ loggedIn: false, user: null });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizedApiBaseUrl = useMemo(
    () => apiBaseUrl.replace(/\/+$/, ""),
    [apiBaseUrl],
  );

  const refreshMe = useCallback(async () => {
    setError(null);

    const response = await fetch(`${normalizedApiBaseUrl}/api/me`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("failed to load login state");
    }

    setMe(await response.json());
  }, [normalizedApiBaseUrl]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const response = await fetch(`${normalizedApiBaseUrl}/api/me`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("failed to load login state");
        }
        const data: MeResponse = await response.json();
        if (!cancelled) {
          setMe(data);
        }
      } catch {
        if (!cancelled) {
          setError("로그인 상태 확인 실패");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [normalizedApiBaseUrl]);

  async function handleDemoLogin() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`${normalizedApiBaseUrl}/api/demo-login`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("demo login failed");
      }
      await refreshMe();
    } catch {
      setError("임시 로그인 실패");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    setBusy(true);
    setError(null);
    try {
      await fetch(`${normalizedApiBaseUrl}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
      setMe({ loggedIn: false, user: null });
    } catch {
      setError("로그아웃 실패");
    } finally {
      setBusy(false);
    }
  }

  const currentHost = typeof window === "undefined" ? "" : window.location.host;

  return (
    <header className={styles.demoHeader}>
      <nav className={styles.nav} aria-label="Demo projects">
        {projects.map((project) => {
          const projectHost = new URL(project.url).host;
          const isCurrent = projectHost === currentHost;

          return (
            <a
              className={`${styles.link} ${isCurrent ? styles.linkCurrent : ""}`}
              href={project.url}
              key={project.url}
              aria-current={isCurrent ? "page" : undefined}
            >
              {project.name}
            </a>
          );
        })}
      </nav>

      <div className={styles.auth}>
        {error ? <span className={styles.error}>{error}</span> : null}
        <span className={styles.status}>
          {loading ? "확인 중" : me.loggedIn && me.user ? me.user.nickname : "비로그인"}
        </span>
        {me.loggedIn ? (
          <button className={styles.button} onClick={handleLogout} disabled={busy}>
            로그아웃
          </button>
        ) : (
          <button className={styles.button} onClick={handleDemoLogin} disabled={busy || loading}>
            임시 로그인
          </button>
        )}
      </div>
    </header>
  );
}

export default DemoHeader;
