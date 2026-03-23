import BookItem from "@/components/book-item"; //@는 src 폴더를 의미합니다. 
import SearchbarLayout from "@/components/searchbar-layout";
import books from "@/mock/book.json";
import { ReactNode } from "react";

export default function Page() {
   //const router = useRouter(); // URL 정보와 동작을 다루는 Next.js 라우터 훅

   // router.query를 통해 URL의 쿼리 스트링(예: /search?q=리액트) 값을 가져올 수 있습니다.
   // q는 searchbar-layout.tsx 내부에서 router.push(`/search?q=${search}`)로 보낸 값입니다.
   return (
      <div>
         {books.map((book) => (
            <BookItem key={`search-${book.id}`} {...book} />//key는 고유한 값을 가져야합니다. 
         ))}
      </div>
   );
}

// 이 페이지 역시 SearchbarLayout을 적용하여 상단에 검색창을 위치시킵니다.
// GlobalLayout -> SearchbarLayout -> Search Page 순서로 컴포넌트를 감싸게 됩니다.
Page.getLayout = (page: ReactNode) => {
   return <SearchbarLayout>{page}</SearchbarLayout>;
}