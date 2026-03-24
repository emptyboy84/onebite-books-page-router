/**
 * [페이지] / (홈 - 전체 책 목록)
 *
 * getServerSideProps 에서 MongoDB의 모든 책을 조회한 뒤
 * BookItem 컴포넌트로 카드 목록을 화면에 렌더링합니다.
 *
 * 데이터 흐름:
 *   MongoDB → getServerSideProps → props.books → Home 컴포넌트 → BookItem
 */
import BookItem from "@/components/book-item";
import SearchbarLayout from "@/components/searchbar-layout";
import clientPromise from "@/lib/db";
import { BookData } from "@/types";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { ReactNode } from "react";

export async function getServerSideProps(_context: GetServerSidePropsContext) {
   // 1. DB에 연결합니다 (clientPromise는 lib/db.ts에서 싱글턴으로 관리)
   const client = await clientPromise;
   const db = client.db("myBookDB");

   // 2. books 컬렉션의 모든 문서를 배열로 가져옵니다
   const rawBooks = await db.collection("books").find().toArray();

   // 3. MongoDB의 ObjectId(_id)는 JSON 직렬화가 안 되므로 문자열 id로 변환합니다
   //    _app.tsx를 통해 props가 클라이언트로 전달될 때 직렬화 오류가 나지 않도록 꼭 필요합니다
   const books: BookData[] = rawBooks.map(({ _id, ...rest }) => ({
      id: _id.toString(),            // ObjectId → string
      title: rest.title ?? "",
      author: rest.author ?? "",
      // 선택적 필드는 undefined 대신 null로 변환합니다.
      // Next.js getServerSideProps는 undefined를 JSON 직렬화할 수 없기 때문입니다.
      subTitle: rest.subTitle ?? null,
      publisher: rest.publisher ?? null,
      coverImgUrl: rest.coverImgUrl ?? null,
      description: rest.description ?? null,
   }));

   return { props: { books } };
}

export default function Home({ books }: InferGetServerSidePropsType<typeof getServerSideProps>) {
   return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px" }}>
         {/* 페이지 헤더 */}
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h1 style={{ margin: 0 }}>📚 도서 목록</h1>
            {/* 새 책 등록 페이지로 이동하는 링크 */}
            <Link href="/book/new" style={{ padding: "8px 16px", background: "#0070f3", color: "#fff", borderRadius: 6, textDecoration: "none", fontWeight: "bold" }}>
               + 책 등록
            </Link>
         </div>

         {/* 책이 한 권도 없을 때 안내 문구 */}
         {books.length === 0 ? (
            <p style={{ color: "gray" }}>등록된 책이 없습니다. 위의 버튼으로 추가해보세요!</p>
         ) : (
            // BookItem 컴포넌트에 책 데이터를 스프레드 연산자로 전달합니다
            books.map((book) => <BookItem key={book.id} {...book} />)
         )}
      </div>
   );
}

// GlobalLayout 위에 SearchbarLayout을 추가로 감쌉니다
// 홈에서도 검색창을 사용할 수 있도록 설정합니다
Home.getLayout = (page: ReactNode) => {
   return <SearchbarLayout>{page}</SearchbarLayout>;
};