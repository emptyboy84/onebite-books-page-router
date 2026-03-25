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

export async function getServerSideProps(context: GetServerSidePropsContext) { //q를 받음
   const q = context.query.q as string || "";  // 1. 주소창에서 검색어(q) 꺼내기 (검색어가 없으면 빈 문자열)
   // 1. DB에 연결합니다 (clientPromise는 lib/db.ts에서 싱글턴으로 관리)
   const client = await clientPromise;
   const db = client.db("myBookDB");//myBookDB 데이터베이스 연결

   // 3. 핵심 검색 로직 ($regex 사용)
   // 저자가 쓴 책이 2권 이상이어도 find()가 모두 배열로 찾아옵니다.
   const DupleBooks = q ? await db.collection("books").find({ author: { $regex: q } }).toArray() : await db.collection("books").find({}).toArray();
   //q가 있으면 검색, 없으면 전체

   const books: BookData[] = DupleBooks.map(({ _id, ...rest }) => ({
      id: _id.toString(),            // ObjectId → string
      title: rest.title ?? "",
      author: rest.author ?? "",
      // 선택적 필드는 undefined 대신 null로 변환합니다.
      // Next.js getServerSideProps는 undefined를 JSON 직렬화할 수 없기 때문입니다.
      subTitle: rest.subTitle ?? null,
      publisher: rest.publisher ?? null,
      coverImgUrl: rest.coverImgUrl ?? null, //
      description: rest.description ?? null,
   }));
   // 4. 프론트엔드로 전달 (ObjectId 에러 방지를 위해 변환)

   return {
      props: {
         DupleBooks: JSON.parse(JSON.stringify(DupleBooks)) //ObjectId를 문자열로 변환
      }
   };
}

export default function Home({ DupleBooks }: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
         {DupleBooks.length === 0 ? (
            <p style={{ color: "gray" }}>등록된 책이 없습니다. 위의 버튼으로 추가해보세요!</p>
         ) : (
            // BookItem 컴포넌트에 책 데이터를 스프레드 연산자로 전달합니다
            DupleBooks.map((book: BookData) => <BookItem key={book.id} {...book} />)
         )}
      </div>
   );
}

// GlobalLayout 위에 SearchbarLayout을 추가로 감쌉니다
// 홈에서도 검색창을 사용할 수 있도록 설정합니다
Home.getLayout = (page: ReactNode) => {
   return <SearchbarLayout>{page}</SearchbarLayout>;
};