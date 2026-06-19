import type { ReactElement } from "react";

export type DemoUser = {
  id: string;
  nickname: string;
  role: "DEMO";
};

export type DemoMe = {
  loggedIn: boolean;
  user: DemoUser | null;
};

export type DemoProject = {
  name: string;
  url: string;
};

export type DemoAuthClient = {
  fetchMe: () => Promise<DemoMe>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  subscribe?: (listener: () => void) => (() => void) | undefined;
};

export type DemoHeaderStandaloneProps = {
  apiBaseUrl?: string;
  projects?: DemoProject[];
};

export type DemoHeaderViewProps = {
  projects?: DemoProject[];
  me: DemoMe;
  loading: boolean;
  busy: boolean;
  error: string | null;
  onDemoLogin: () => void;
  onLogout: () => void;
};

export type UseDemoAuthOptions = {
  authClient: DemoAuthClient;
  onMeChanged?: (me: DemoMe) => void;
};

export type UseDemoAuthResult = {
  me: DemoMe;
  loading: boolean;
  busy: boolean;
  error: string | null;
  handleDemoLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
  refreshMe: () => Promise<DemoMe>;
};

export function DemoHeaderStandalone(
  props: DemoHeaderStandaloneProps,
): ReactElement;
export { DemoHeaderStandalone as DemoHeader };
export default DemoHeaderStandalone;

export function DemoHeaderView(props: DemoHeaderViewProps): ReactElement;
export function createDemoAuthClient(apiBaseUrl?: string): DemoAuthClient;
export function useDemoAuth(options: UseDemoAuthOptions): UseDemoAuthResult;
