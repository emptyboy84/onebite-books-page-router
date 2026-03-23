import clientPromise from "@/lib/db"; //1. DB 연결 도구 불러오기
import { BookData } from "@/types";
import { ObjectId } from "mongodb"; //ObjectId 도구 불러오기
import { GetServerSidePropsContext } from "next";


export async function getServerSideProps(context: GetServerSidePropsContext) {//서버에서 실행되는 함수 
   // 1. DB에 연결해서 'books' 컬렉션의 모든 데이터를 가져옵니다.
   const id = context.params?.id;//URL에서 id 문자열을 꺼내옵니다.
   const client = await clientPromise;
   const db = client.db("myBookDB");
   const booksData = await db.collection("books").find().toArray();

   if (!id || typeof id !== 'string') {
      return { notFound: true };
   }

   //findOne을 사용하되, 문자열 id를 ObjectId로 변환해서 검색합니다! 🔍
   const book = await db.collection("books").findOne({ _id: new ObjectId(id) });

   if (!book) { //책을찾지못했다면
      return { notFound: true };
   }

   //원본 book 데이터에서 _id와 나머지(rest)를 분리합니다.
   const { _id, ...rest } = book;

   //분리해낸 나머지 데이터(rest)만 복사하고, id를 문자열로 추가합니다.
   const bookData = {
      ...rest,
      id: _id.toString()
   }

   // const bookData = {
   //    ...book,//스프레드 연산자: book 객체의 모든 속성을 그대로 가져옴
   //    id: book._id.toString(),//_id를 문자열로 변환
   //    title: book.title.toString(),//
   //    author: book.author.toString(),

   // };

   return {
      props: { book: bookData } //props로 bookData를 전달
   }
};

export default function Page({ book }: { book: BookData }) {
   return (
      <div>
         <h1>{book.title}</h1>
         <p>저자: {book.author}</p>
      </div>
   )
};

// export default function Home({
//   allBooks }: InferGetServerSidePropsType<typeof getServerSideProps>) {
//   //InferGetServerSidePropsType<typeof getServerSideProps>는 getServerSideProps 
//   // 함수의 반환 타입을 추론하여 allBooks의 타입을 자동으로 설정해줍니다.
//   // 홈 페이지 컴포넌트: 기본 방문 경로('/')에 렌더링되는 메인 화면입니다.

//   return (
//     <div className={style.container}>//style.container는 global-layout.module.css에 정의된 클래스입니다.
//       <section>
//         <h3>등록된도서</h3>
//         {/* books.json의 데이터를 기반으로 추천 도서 목록을 화면에 그립니다. (현재는 전체 목업 데이터를 그대로 렌더링) */}
//         {allBooks.map((book) => (
//           <BookItem key={book.id} {...book} />//key는 고유한 값을 가져야합니다.   
//         ))}
//       </section>

//     </div>
//   );
// }

// getLayout을 통해 Home 컴포넌트에만 적용될 특별한 레이아웃을 정의합니다.
// 이 설정 덕분에 _app.tsx에서 컴포넌트를 이 레이아웃(SearchbarLayout)으로 감쌀 수 있습니다.
// Page.getLayout = (page: ReactNode) => {
//   return <SearchbarLayout>{page}</SearchbarLayout>;
// }
