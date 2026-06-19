import { useEffect, useMemo, useState } from "react";
import { createDemoAuthClient } from "./demoAuthClient";
import { DEFAULT_PROJECTS } from "./demoHeaderConstants";
import { DemoHeaderView } from "./DemoHeaderView";
import { useDemoAuth } from "./useDemoAuth";

export const DemoHeaderStandalone = ({
  apiBaseUrl,
  projects,
  defaultExpanded,
}) => {
  const [fetchedProjects, setFetchedProjects] = useState(DEFAULT_PROJECTS);
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

  useEffect(() => {
    if (projects || !authClient.fetchProjects) {
      return undefined;
    }

    let cancelled = false;

    authClient
      .fetchProjects()
      .then((nextProjects) => {
        if (!cancelled) {
          setFetchedProjects(nextProjects);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFetchedProjects(DEFAULT_PROJECTS);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [authClient, projects]);

  return (
    <DemoHeaderView
      projects={projects ?? fetchedProjects}
      me={me}
      loading={loading}
      busy={busy}
      error={error}
      onDemoLogin={handleDemoLogin}
      onLogout={handleLogout}
      defaultExpanded={defaultExpanded}
    />
  );
};

export default DemoHeaderStandalone;
