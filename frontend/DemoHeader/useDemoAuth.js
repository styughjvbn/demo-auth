import { useCallback, useEffect, useState } from "react";
import { EMPTY_ME } from "./demoHeaderConstants";

export const useDemoAuth = ({ authClient, onMeChanged }) => {
  const [me, setMe] = useState(EMPTY_ME);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const applyMe = useCallback(
    (data) => {
      setMe(data);
      onMeChanged?.(data);
    },
    [onMeChanged],
  );

  const refreshMe = useCallback(async () => {
    setError(null);
    const data = await authClient.fetchMe();
    applyMe(data);
    return data;
  }, [applyMe, authClient]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await authClient.fetchMe();
        if (!cancelled) {
          applyMe(data);
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
  }, [applyMe, authClient]);

  useEffect(() => {
    if (!authClient.subscribe) {
      return undefined;
    }

    return authClient.subscribe(() => {
      refreshMe().catch(() => setError("로그인 상태 확인 실패"));
    });
  }, [authClient, refreshMe]);

  const handleDemoLogin = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      await authClient.login();
      await refreshMe();
    } catch {
      setError("임시 로그인 실패");
    } finally {
      setBusy(false);
    }
  }, [authClient, refreshMe]);

  const handleLogout = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      await authClient.logout();
      applyMe(EMPTY_ME);
    } catch {
      setError("로그아웃 실패");
    } finally {
      setBusy(false);
    }
  }, [applyMe, authClient]);

  return {
    me,
    loading,
    busy,
    error,
    handleDemoLogin,
    handleLogout,
    refreshMe,
  };
};
