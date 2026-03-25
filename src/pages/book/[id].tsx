/**
 * [페이지] /book/[id] (책 상세 + 수정 + 삭제)
 *
 * getServerSideProps 에서 URL의 [id]로 MongoDB에서 책 1권을 조회합니다.
 * - 삭제: DELETE /api/book/[id] 호출 → 홈으로 이동
 * - 수정: 수정 모드 토글 → PUT /api/book/[id] 호출 → 갱신
 *
 * 데이터 흐름:
 *   URL [id] → getServerSideProps → props.book → Page 컴포넌트
 *   [수정] 사용자 입력 → PUT /api/book/[id] → router.replace(같은 페이지 갱신)
 *   [삭제] DELETE /api/book/[id] → router.push("/")
 */
import clientPromise from "@/lib/db";
import { BookData } from "@/types";
import { ObjectId } from "mongodb";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

export async function getServerSideProps(context: GetServerSidePropsContext) {
   const id = context.params?.id;


   // id가 없거나 문자열이 아니면 404 페이지를 반환합니다
   if (!id || typeof id !== "string") return { notFound: true };

   try {
      const client = await clientPromise;
      const db = client.db("myBookDB");

      // ObjectId로 변환하여 해당 책을 조회합니다
      const book = await db.collection("books").findOne({ _id: new ObjectId(id) });

      // 책이 없으면 404
      if (!book) return { notFound: true };

      // _id(ObjectId) → id(string) 직렬화
      const { _id, ...rest } = book;
      const bookData: BookData = {
         id: _id.toString(),
         title: rest.title ?? "",
         author: rest.author ?? "",
         subTitle: rest.subTitle ?? null,
         publisher: rest.publisher ?? null,
         coverImgUrl: rest.coverImgUrl ?? null,
         description: rest.description ?? null,
      };

      return { props: { book: bookData } };
   } catch {
      // ObjectId 변환 실패 등의 오류도 404로 처리합니다
      return { notFound: true };
   }
}

export default function BookDetailPage({ book }: { book: BookData }) {
   const router = useRouter();

   // 수정 모드 여부 (false: 보기 모드, true: 수정 모드)
   const [isEditing, setIsEditing] = useState(false);

   // 수정 중인 값을 별도 state로 관리합니다 (원본 book은 건드리지 않음)
   const [editTitle, setEditTitle] = useState(book.title);
   const [editAuthor, setEditAuthor] = useState(book.author);
   const [isLoading, setIsLoading] = useState(false);

   // ── 삭제 ────────────────────────────────────────────────────────────
   const handleDelete = async () => {
      if (!confirm(`"${book.title}"을(를) 정말 삭제하시겠습니까?`)) return;

      setIsLoading(true);
      try {
         const response = await fetch(`/api/book/${book.id}`, { method: "DELETE" });

         if (response.ok) {
            alert("책이 삭제되었습니다.");
            router.push("/"); // 삭제 후 홈으로 이동
         } else {
            alert("삭제에 실패했습니다.");
         }
      } catch {
         alert("네트워크 오류가 발생했습니다.");
      } finally {
         setIsLoading(false);
      }
   };

   // ── 수정 저장 ────────────────────────────────────────────────────────
   const handleEdit = async () => {
      if (!editTitle.trim() || !editAuthor.trim()) {
         alert("제목과 저자를 모두 입력해주세요.");
         return;
      }

      setIsLoading(true);
      try {
         // PUT /api/book/[id] 로 수정할 데이터를 전송합니다
         const response = await fetch(`/api/book/${book.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: editTitle, author: editAuthor }),
         });

         if (response.ok) {
            alert("수정되었습니다.");
            setIsEditing(false);
            // 같은 페이지를 다시 불러와서 최신 데이터를 표시합니다
            router.replace(router.asPath);
         } else {
            alert("수정에 실패했습니다.");
         }
      } catch {
         alert("네트워크 오류가 발생했습니다.");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div style={{ maxWidth: 600, margin: "40px auto", padding: "0 16px" }}>
         {/* ── 보기 모드 ── */}
         {!isEditing ? (
            <>
               <h1>{book.title}</h1>
               <p style={{ color: "gray" }}>저자: {book.author}</p>
               {book.description && <p>{book.description}</p>}

               <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                  {/* 수정 버튼: 수정 모드로 전환합니다 */}
                  <button
                     onClick={() => setIsEditing(true)}
                     style={{ padding: "8px 20px", background: "#0070f3", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
                  >
                     ✏️ 수정하기
                  </button>

                  {/* 삭제 버튼 */}
                  <button
                     onClick={handleDelete}
                     disabled={isLoading}
                     style={{ padding: "8px 20px", background: "#e00", color: "#fff", border: "none", borderRadius: 6, cursor: isLoading ? "not-allowed" : "pointer" }}
                  >
                     🗑️ 삭제하기
                  </button>

                  <button
                     onClick={() => router.push("/")}
                     style={{ padding: "8px 20px", background: "transparent", border: "1px solid #ccc", borderRadius: 6, cursor: "pointer" }}
                  >
                     목록으로
                  </button>
               </div>
            </>
         ) : (
            /* ── 수정 모드 ── */
            <>
               <h2>✏️ 책 정보 수정</h2>
               <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                  <input
                     value={editTitle}
                     onChange={(e) => setEditTitle(e.target.value)}
                     placeholder="제목"
                     style={{ padding: "10px 12px", fontSize: 16, border: "1px solid #ccc", borderRadius: 6 }}
                  />
                  <input
                     value={editAuthor}
                     onChange={(e) => setEditAuthor(e.target.value)}
                     placeholder="저자"
                     style={{ padding: "10px 12px", fontSize: 16, border: "1px solid #ccc", borderRadius: 6 }}
                  />

                  <div style={{ display: "flex", gap: 12 }}>
                     <button
                        onClick={handleEdit}
                        disabled={isLoading}
                        style={{ flex: 1, padding: "10px", background: "#0070f3", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: isLoading ? "not-allowed" : "pointer" }}
                     >
                        {isLoading ? "저장 중..." : "저장하기"}
                     </button>
                     {/* 취소 버튼: 수정 전 값으로 복원하고 보기 모드로 돌아갑니다 */}
                     <button
                        onClick={() => {
                           setEditTitle(book.title);
                           setEditAuthor(book.author);
                           setIsEditing(false);
                        }}
                        style={{ flex: 1, padding: "10px", background: "transparent", border: "1px solid #ccc", borderRadius: 6, fontSize: 16, cursor: "pointer" }}
                     >
                        취소
                     </button>
                  </div>
               </div>
            </>
         )}
      </div>
   );
}
