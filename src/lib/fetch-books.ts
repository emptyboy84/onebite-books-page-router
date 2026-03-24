/**
 * [유틸] fetchBooks
 *
 * GET /api/books 를 호출하여 전체 책 목록을 가져오는 클라이언트용 유틸 함수입니다.
 * 클라이언트 컴포넌트(useEffect 등)에서 사용할 때 활용합니다.
 *
 * ※ getServerSideProps / getStaticProps 같은 서버 사이드 함수에서는
 *   clientPromise로 DB에 직접 접근하는 것이 더 효율적입니다.
 *
 * 사용 예:
 *   const books = await fetchBooks();
 */
import { BookData } from "@/types";

export default async function fetchBooks(): Promise<BookData[]> {
   // 클라이언트에서는 상대 경로, 서버에서는 절대경로가 필요합니다.
   // 이 함수는 클라이언트(브라우저)에서 사용하는 것을 가정합니다.
   const url = "/api/books";
   try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`서버 오류: ${response.status}`);
      return await response.json() as BookData[];
   } catch (err) {
      console.error("fetchBooks 오류:", err);
      return []; // 오류 발생 시 빈 배열 반환
   }
}