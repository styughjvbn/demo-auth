import { useMemo } from "react";
import { createDemoAuthClient } from "./demoAuthClient";
import { DEFAULT_PROJECTS } from "./demoHeaderConstants";
import { DemoHeaderView } from "./DemoHeaderView";
import { useDemoAuth } from "./useDemoAuth";

export const DemoHeaderStandalone = ({
  apiBaseUrl,
  projects = DEFAULT_PROJECTS,
}) => {
  const authClient = useMemo(
    () => createDemoAuthClient(apiBaseUrl),
    [apiBaseUrl],
  );
  const {
    me,
    loading,
    busy,
    error,
    handleDemoLogin,
    handleLogout,
  } = useDemoAuth({ authClient });

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

export default DemoHeaderStandalone;
