import React from "react";
import { createRoot } from "react-dom/client";
import { DemoHeaderView } from "../../DemoHeaderView";
import "./preview.css";

const demoProjects = [
  { name: "COCO", url: "https://coco.sjw-project.site" },
  { name: "OZZ", url: "https://ozz.sjw-project.site" },
];

function PreviewApp() {
  return (
    <>
      <DemoHeaderView
        projects={demoProjects}
        me={{
          loggedIn: true,
          user: {
            id: "temp-user-8487bd87",
            nickname: "tempUser-8487bd87",
            role: "DEMO",
          },
        }}
        loading={false}
        busy={false}
        error={null}
        onDemoLogin={() => {}}
        onLogout={() => window.alert("logout clicked")}
        defaultExpanded
      />

      <main className="preview-page">
        <section className="preview-toolbar">
          <button type="button">원래 서비스 버튼</button>
          <button type="button">저장</button>
          <button type="button">공유</button>
        </section>
        <section className="preview-content">
          <h1>기존 데모 사이트 화면</h1>
          <p>
            상단바가 펼쳐진 상태에서도 오른쪽 로그아웃 버튼과 닫기 버튼이
            겹치지 않는지 확인하는 미리보기 화면입니다.
          </p>
        </section>
      </main>
    </>
  );
}

createRoot(document.getElementById("root")).render(<PreviewApp />);
