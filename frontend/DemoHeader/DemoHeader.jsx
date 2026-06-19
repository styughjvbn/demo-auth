import { useCallback, useMemo } from "react";
import { demoLogin, demoLogout, fetchDemoMe } from "api/demoAuth";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { DEMO_AUTH_CHANGED_EVENT, DEFAULT_PROJECTS } from "./demoHeaderConstants";
import { DemoHeaderView } from "./DemoHeaderView";
import { useDemoAuth } from "./useDemoAuth";

export const DemoHeader = ({
  projects = DEFAULT_PROJECTS,
}) => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.loginState);

  const logoutCocoUser = useCallback(() => {
    dispatch({ type: "loginSlice/logout" });
  }, [dispatch]);

  const loginDemoUser = useCallback(
    (user) => {
      dispatch({
        type: "loginSlice/login",
        access_token: "",
        token_type: "demo",
        id: "demo",
        name: user.nickname,
        role: 0,
        exp: 0,
        imagetoken: new Date().getTime(),
        tutor: 0,
        alarm: 0,
        is_demo: true,
      });
    },
    [dispatch],
  );

  const syncCocoUser = useCallback((data) => {
    if (data.loggedIn && userInfo.access_token && !userInfo.is_demo) {
      logoutCocoUser();
    }
    if (
      data.loggedIn &&
      data.user &&
      (!userInfo.is_demo || userInfo.name !== data.user.nickname)
    ) {
      loginDemoUser(data.user);
    } else if (!data.loggedIn && userInfo.is_demo) {
      logoutCocoUser();
    }
  }, [
    loginDemoUser,
    logoutCocoUser,
    userInfo.access_token,
    userInfo.is_demo,
    userInfo.name,
  ]);

  const authClient = useMemo(() => ({
    fetchMe: fetchDemoMe,
    login: async () => {
      if (userInfo.access_token && !userInfo.is_demo) {
        logoutCocoUser();
      }
      return demoLogin();
    },
    logout: demoLogout,
    subscribe: (listener) => {
      if (typeof window === "undefined") {
        return undefined;
      }

      window.addEventListener(DEMO_AUTH_CHANGED_EVENT, listener);
      return () => window.removeEventListener(DEMO_AUTH_CHANGED_EVENT, listener);
    },
  }), [logoutCocoUser, userInfo.access_token, userInfo.is_demo]);

  const {
    me,
    loading,
    busy,
    error,
    handleDemoLogin,
    handleLogout,
  } = useDemoAuth({
    authClient,
    onMeChanged: syncCocoUser,
  });

  return (
    <DemoHeaderView
      projects={projects}
      me={me}
      loading={loading}
      busy={busy}
      error={error}
      onDemoLogin={handleDemoLogin}
      onLogout={handleLogout}
    />
  );
};
