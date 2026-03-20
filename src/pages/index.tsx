import BookItem from "@/components/book-item";
import SearchbarLayout from "@/components/searchbar-layout";
import clientPromise from "@/lib/db"; //1. DB 연결 도구 불러오기
import { InferGetServerSidePropsType } from "next";
import { ReactNode } from "react";
import style from "./index.module.css";


export async function getServerSideProps() {//서버에서 실행되는 함수
  // 2. DB에 연결해서 'books' 컬렉션의 모든 데이터를 가져옵니다.
  const client = await clientPromise;//연결
  const db = client.db("myBookDB");
  const booksData = await db.collection("books").find().toArray();

  // 3. Next.js 규칙에 맞게 데이터 형태를 살짝 다듬어줍니다. (MongoDB의 고유 _id를 일반 문자열 id로 변환)
  const allBooks = booksData.map((book) => ({
    title: book.title,
    author: book.author,
    id: book._id.toString(),//몽고디비의 고유 _id를 일반 문자열 id로 변환
  }));
  // 임시로 추천 도서에도 똑같은 데이터를 넣어볼게요.
  return { props: { allBooks, randomBooks: allBooks } };//props는 속성이라는 뜻으로 컴포넌트에 전달할 데이터를 의미합니다.
};


export default function Home({
  allBooks, randomBooks }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  //InferGetServerSidePropsType<typeof getServerSideProps>는 getServerSideProps 
  // 함수의 반환 타입을 추론하여 allBooks와 randomBooks의 타입을 자동으로 설정해줍니다.
  // 홈 페이지 컴포넌트: 기본 방문 경로('/')에 렌더링되는 메인 화면입니다.

  return (
    <div className={style.container}>//style.container는 global-layout.module.css에 정의된 클래스입니다.
      <section>
        <h3>등록된도서</h3>
        {/* books.json의 데이터를 기반으로 추천 도서 목록을 화면에 그립니다. (현재는 전체 목업 데이터를 그대로 렌더링) */}
        {allBooks.map((book) => (
          <BookItem key={book.id} {...book} />//key는 고유한 값을 가져야합니다.   
        ))}
      </section>

    </div>
  );
}

// getLayout을 통해 Home 컴포넌트에만 적용될 특별한 레이아웃을 정의합니다.
// 이 설정 덕분에 _app.tsx에서 컴포넌트를 이 레이아웃(SearchbarLayout)으로 감쌀 수 있습니다.
Home.getLayout = (page: ReactNode) => {
  return <SearchbarLayout>{page}</SearchbarLayout>;
}
