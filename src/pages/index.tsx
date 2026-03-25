/**
 * [페이지] / (홈 - 전체 책 목록)
 *
 * getServerSideProps 에서 MongoDB의 모든 책을 조회한 뒤
 * BookItem 컴포넌트로 카드 목록을 화면에 렌더링합니다.
 *
 * 데이터 흐름:
 *   MongoDB → getServerSideProps → props.books → Home 컴포넌트 → BookItem
 */
import SearchbarLayout from "@/components/searchbar-layout";
import clientPromise from "@/lib/db";
import { BookData } from "@/types";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import style from "./index.module.css";

export async function getServerSideProps(context: GetServerSidePropsContext) { //q를 받음
   const q = context.query.q as string || "";  // 1. 주소창에서 검색어(q) 꺼내기 (검색어가 없으면 빈 문자열)
   // 1. DB에 연결합니다 (clientPromise는 lib/db.ts에서 싱글턴으로 관리)
   const client = await clientPromise;
   const db = client.db("myBookDB");//myBookDB 데이터베이스 연결

   let rawBooks: any[] = [];
   if (q) {
      // 1. q 검색어에 해당하는 책을 찾습니다 (제목 또는 저자로)
      const matchedBooks = await db.collection("books").find({
         $or: [//or은 둘중 하나만 만족해도 됨
            { title: { $regex: q, $options: "i" } },//i는 대소문자 구분 안함
            { author: { $regex: q, $options: "i" } }
         ]
      }).toArray();

      // 2. 검색된 책들의 저자들 목록을 추출합니다
      const matchedAuthors = Array.from(new Set(matchedBooks.map(b => b.author).filter(Boolean)));

      // 3. "저자가 같으면 여러 권이라도 모두 나오게" 해당 저자가 쓴 모든 책을 검색합니다
      if (matchedAuthors.length > 0) {
         rawBooks = await db.collection("books").find({
            author: { $in: matchedAuthors }
         }).toArray();
      }
   } else {
      // 검색어가 없으면 전체 목록 반환
      rawBooks = await db.collection("books").find({}).toArray();
   }

   // map을 사용해서 _id를 string으로 변환해준다.
   const books: BookData[] = rawBooks.map(({ _id, ...rest }) => ({ // _id는 ObjectId 타입이라서 string으로 변환해줘야함
      id: _id.toString(),            // ObjectId → string
      title: rest.title ?? "",       // null이면 빈 문자열로 변환
      author: rest.author ?? "", //null이면 빈 문자열로 변환
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
         books, // 이미 직렬화 가능한 형태로 변환된 books를 반환합니다
      }
   };
}

export default function Home({ books }: InferGetServerSidePropsType<typeof getServerSideProps>) {
   const router = useRouter();

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
            <div className={style.tableContainer}>
               <table className={style.table}>
                  <thead>
                     <tr>
                        <th style={{ width: "80px" }}>표지</th>
                        <th>책 이름</th>
                        <th>저자</th>
                        <th>출판사</th>
                     </tr>
                  </thead>
                  <tbody>
                     {books.map((book: BookData) => (
                        <tr
                           key={book.id}
                           className={style.row}
                           onClick={() => router.push(`/book/${book.id}`)}
                        >
                           <td>
                              {book.coverImgUrl ? (
                                 <img src={book.coverImgUrl} className={style.coverImg} alt={book.title} />
                              ) : (
                                 <div className={style.coverImg} style={{ background: "#eee" }} />
                              )}
                           </td>
                           <td>
                              <span className={style.bookTitle}>{book.title}</span>
                              <span className={style.bookSubtitle}>{book.subTitle}</span>
                           </td>
                           <td>{book.author}</td>
                           <td>{book.publisher}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </div>
   );
}

// GlobalLayout 위에 SearchbarLayout을 추가로 감쌉니다
// 홈에서도 검색창을 사용할 수 있도록 설정합니다
Home.getLayout = (page: ReactNode) => {
   return <SearchbarLayout>{page}</SearchbarLayout>;
};