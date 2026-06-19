import { DEFAULT_PROJECTS } from "./demoHeaderConstants";
import "./DemoHeader.css";

export const DemoHeaderView = ({
  projects = DEFAULT_PROJECTS,
  me,
  loading,
  busy,
  error,
  onDemoLogin,
  onLogout,
}) => {
  const currentHost = typeof window === "undefined" ? "" : window.location.host;

  return (
    <header className="demo-header">
      <nav className="demo-header__nav" aria-label="Demo projects">
        {projects.map((project) => {
          const projectHost = new URL(project.url).host;
          const isCurrent = projectHost === currentHost;

          return (
            <a
              className={`demo-header__link ${
                isCurrent ? "demo-header__link--current" : ""
              }`}
              href={project.url}
              key={project.url}
              aria-current={isCurrent ? "page" : undefined}
            >
              {project.name}
            </a>
          );
        })}
      </nav>

      <div className="demo-header__auth">
        {error ? <span className="demo-header__error">{error}</span> : null}
        <span className="demo-header__status">
          {loading
            ? "확인 중"
            : me.loggedIn && me.user
              ? me.user.nickname
              : "비로그인"}
        </span>
        {me.loggedIn ? (
          <button
            className="demo-header__button"
            onClick={onLogout}
            disabled={busy}
            type="button"
          >
            로그아웃
          </button>
        ) : (
          <button
            className="demo-header__button"
            onClick={onDemoLogin}
            disabled={busy || loading}
            type="button"
          >
            임시 로그인
          </button>
        )}
      </div>
    </header>
  );
};
