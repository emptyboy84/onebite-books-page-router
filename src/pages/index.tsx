import BookItem from "@/components/book-item";
import SearchbarLayout from "@/components/searchbar-layout";
import books from "@/mock/books.json";
import { InferGetServerSidePropsType } from "next";
import { ReactNode, useEffect } from "react";
import style from "./index.module.css";


export function getServerSideProps() {
  const data = "임시데이터";
  return { props: { data } };
};


export default function Home({
  data, }: InferGetServerSidePropsType<typeof getServerSideProps>) {//
  // 홈 페이지 컴포넌트: 기본 방문 경로('/')에 렌더링되는 메인 화면입니다.
  useEffect(() => {
    console.log(window.history);
  }, []);
  return (
    <div className={style.container}>
      <section>
        <h3>지금추천도서</h3>
        {/* books.json의 데이터를 기반으로 추천 도서 목록을 화면에 그립니다. (현재는 전체 목업 데이터를 그대로 렌더링) */}
        {books.map((book) => (
          <BookItem key={`recommend-${book.id}`} {...book} />
        ))}
      </section>
      <section>
        <h3>등록된모든도서</h3>
        {books.map((book) => (
          <BookItem key={`all-${book.id}`} {...book} />//key는 고유한 값을 가져야합니다.   
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
