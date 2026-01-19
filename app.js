// app.js
// 학번 + 이름으로 구글 계정 ID 조회 (비밀번호는 표시/저장하지 않음)
// 테스트용: 아래 SAMPLE_ACCOUNTS에 데이터를 넣어 동작 확인

"use strict";

/** =========================
 *  1) 테스트 데이터 (예시)
 *  - 실제 운영에서는 JS에 학생 계정 데이터를 넣는 방식은 강력 비권장입니다.
 *  - 지금은 "동작 확인" 목적의 샘플입니다.
 * ========================= */
const SAMPLE_ACCOUNTS = [
  { studentNo: "30123", name: "홍길동", accountId: "s30123@school.go.kr" },
  { studentNo: "30201", name: "김민지", accountId: "s30201@school.go.kr" },
];

/** =========================
 *  2) DOM 참조
 * ========================= */
const form = document.getElementById("lookupForm");
const studentNoInput = document.getElementById("studentNo");
const studentNameInput = document.getElementById("studentName");

const resultBox = document.getElementById("resultBox");
const accountIdEl = document.getElementById("accountId");
const copyIdBtn = document.getElementById("copyIdBtn");

const errorBox = document.getElementById("errorBox");
const errorMsg = document.getElementById("errorMsg");

/** =========================
 *  3) 유틸
 * ========================= */
function normalizeStudentNo(value) {
  // 숫자만 남기기
  return String(value || "").replace(/[^\d]/g, "").trim();
}

function normalizeName(value) {
  // 앞뒤 공백 제거 + 내부 연속 공백 1칸으로
  return String(value || "").trim().replace(/\s+/g, " ");
}

function showResult(accountId) {
  accountIdEl.textContent = accountId;
  resultBox.hidden = false;
  errorBox.hidden = true;
}

function showError(message) {
  errorMsg.textContent = message;
  errorBox.hidden = false;
  resultBox.hidden = true;
}

function hideAll() {
  resultBox.hidden = true;
  errorBox.hidden = true;
}

function findAccount(studentNo, name) {
  // 정확 일치 검색 (학번, 이름)
  const targetNo = normalizeStudentNo(studentNo);
  const targetName = normalizeName(name);

  return SAMPLE_ACCOUNTS.find(
    (row) =>
      normalizeStudentNo(row.studentNo) === targetNo &&
      normalizeName(row.name) === targetName
  );
}

/** =========================
 *  4) 이벤트: 검색(버튼/엔터)
 * ========================= */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const studentNo = normalizeStudentNo(studentNoInput.value);
  const studentName = normalizeName(studentNameInput.value);

  if (!studentNo) {
    showError("학번을 입력해 주세요.");
    studentNoInput.focus();
    return;
  }
  if (!studentName) {
    showError("이름을 입력해 주세요.");
    studentNameInput.focus();
    return;
  }

  const match = findAccount(studentNo, studentName);
  if (!match) {
    showError("일치하는 정보가 없습니다. 학번/이름을 다시 확인해 주세요.");
    return;
  }

  showResult(match.accountId);
});

/** =========================
 *  5) 이벤트: ID 복사
 * ========================= */
copyIdBtn.addEventListener("click", async () => {
  const text = (accountIdEl.textContent || "").trim();
  if (!text || text === "-") return;

  try {
    await navigator.clipboard.writeText(text);
    copyIdBtn.textContent = "복사 완료";
    setTimeout(() => (copyIdBtn.textContent = "ID 복사"), 900);
  } catch (err) {
    // 클립보드 권한 실패 시 fallback
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);

      copyIdBtn.textContent = "복사 완료";
      setTimeout(() => (copyIdBtn.textContent = "ID 복사"), 900);
    } catch (e2) {
      showError("복사에 실패했습니다. ID를 직접 드래그해서 복사해 주세요.");
    }
  }
});

/** =========================
 *  6) 초기 상태
 * ========================= */
hideAll();
