/**
 * [페이지] /search?q=검색어 (검색 결과)
 *
 * URL 쿼리 파라미터 q를 읽어 MongoDB에서 제목/저자 검색 후
 * 결과를 BookItem 카드 목록으로 렌더링합니다.
 *
 * 데이터 흐름:
 *   URL ?q= → getServerSideProps → DB 검색 → props.books → Page → BookItem
 */
import BookItem from "@/components/book-item";
import SearchbarLayout from "@/components/searchbar-layout";
import clientPromise from "@/lib/db";
import { BookData } from "@/types";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { ReactNode } from "react";

export async function getServerSideProps(context: GetServerSidePropsContext) {
   // URL 쿼리에서 검색어 q를 꺼냅니다 (없으면 빈 문자열)
   const q = (context.query.q as string) ?? "";

   try {
      const client = await clientPromise;
      const db = client.db("myBookDB");

      // $regex: 검색어 포함 여부 / $options "i": 대소문자 무시
      // 제목(title) 또는 저자(author) 중 하나라도 포함되면 결과에 포함합니다
      const rawBooks = await db.collection("books").find({
         $or: [
            { title: { $regex: q, $options: "i" } },
            { author: { $regex: q, $options: "i" } },
         ],
      }).toArray();

      // ObjectId(_id) → 문자열(id) 직렬화
      const books: BookData[] = rawBooks.map(({ _id, ...rest }) => ({
         id: _id.toString(),
         title: rest.title ?? "",
         author: rest.author ?? "",
         subTitle: rest.subTitle ?? null,
         publisher: rest.publisher ?? null,
         coverImgUrl: rest.coverImgUrl ?? null,
         description: rest.description ?? null,
      }));

      return { props: { books, q } };
   } catch (err) {
      console.error("검색 오류:", err);
      return { props: { books: [] as BookData[], q } };
   }
}

export default function Page({ books, q }: InferGetServerSidePropsType<typeof getServerSideProps>) {
   return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px" }}>
         {/* 검색 결과 건수 안내 */}
         <p style={{ color: "gray", marginBottom: 16 }}>
            {q ? `"${q}" 검색 결과: ${books.length}건` : "검색어를 입력해주세요."}
         </p>

         {/* 검색 결과가 없을 때 안내 */}
         {books.length === 0 && q && (
            <p style={{ color: "#999" }}>일치하는 책이 없습니다.</p>
         )}

         {/* 검색된 책 목록을 BookItem 카드로 표시합니다 */}
         {books.map((book) => (
            <BookItem key={book.id} {...book} />
         ))}
      </div>
   );
}

// GlobalLayout 위에 SearchbarLayout을 추가로 감쌉니다
// 적용 순서: GlobalLayout → SearchbarLayout → Page
Page.getLayout = (page: ReactNode) => {
   return <SearchbarLayout>{page}</SearchbarLayout>;
};