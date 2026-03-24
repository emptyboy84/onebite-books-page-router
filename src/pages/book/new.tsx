/**
 * [페이지] /book/new (새 책 등록)
 *
 * 제목·저자를 입력받아 POST /api/books 로 전송합니다.
 * 성공하면 홈 페이지(/)로 이동합니다.
 *
 * 데이터 흐름:
 *   사용자 입력 → useState → fetch(POST /api/books) → 홈으로 이동
 */
import { useRouter } from "next/router";
import { useState } from "react";

export default function NewBookPage() {
   const router = useRouter();

   // 입력 상태관리: 각 필드를 useState로 따로 관리합니다
   const [title, setTitle] = useState("");
   const [author, setAuthor] = useState("");
   const [isLoading, setIsLoading] = useState(false); // 중복 제출 방지용 로딩 상태

   // 등록 버튼 클릭 시 실행되는 비동기 함수
   const onSubmit = async () => {
      // 필수 값 검증: 제목과 저자가 없으면 제출하지 않습니다
      if (!title.trim() || !author.trim()) {
         alert("제목과 저자를 모두 입력해주세요.");
         return;
      }

      setIsLoading(true); // 버튼 비활성화 (중복 클릭 방지)

      try {
         // POST /api/books 로 JSON 데이터를 보냅니다
         const response = await fetch("/api/books", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, author }),
         });

         if (response.ok) {
            alert("책이 성공적으로 등록되었습니다.");
            router.push("/"); // 홈 페이지로 이동
         } else {
            const data = await response.json();
            alert(data.message ?? "등록에 실패했습니다.");
         }
      } catch (err) {
         console.error("등록 중 네트워크 오류:", err);
         alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div style={{ maxWidth: 480, margin: "40px auto", padding: "0 16px" }}>
         <h2>✏️ 새로운 책 등록하기</h2>

         <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
            <input
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               placeholder="제목을 입력하세요"
               style={{ padding: "10px 12px", fontSize: 16, border: "1px solid #ccc", borderRadius: 6 }}
            />
            <input
               value={author}
               onChange={(e) => setAuthor(e.target.value)}
               placeholder="저자를 입력하세요"
               style={{ padding: "10px 12px", fontSize: 16, border: "1px solid #ccc", borderRadius: 6 }}
            />

            {/* disabled로 로딩 중 중복 제출을 막습니다 */}
            <button
               onClick={onSubmit}
               disabled={isLoading}
               style={{ padding: "10px", background: "#0070f3", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: isLoading ? "not-allowed" : "pointer" }}
            >
               {isLoading ? "등록 중..." : "등록하기"}
            </button>

            <button
               onClick={() => router.back()}
               style={{ padding: "10px", background: "transparent", border: "1px solid #ccc", borderRadius: 6, fontSize: 16, cursor: "pointer" }}
            >
               돌아가기
            </button>
         </div>
      </div>
   );
}