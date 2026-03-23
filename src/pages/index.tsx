import clientPromise from "@/lib/db";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {//서버에서 실행되는 함수 
  // 1. DB에 연결해서 'books' 컬렉션의 모든 데이터를 가져옵니다.
  const client = await clientPromise;//DB 연결
  const db = client.db("myBookDB");//DB 선택

  // 모든 책 데이터를 배열 형태로 싹 다 가져옵니다! 📚
  const books = await db.collection("books").find().toArray();

  // 프론트엔드로 보내기 전에 ObjectId를 문자열로 변환해줍니다.
  const bookData = books.map((book) => {
    const { _id, ...rest } = book;//_id를 제외한 나머지 속성을 rest에 할당
    return {
      ...rest,//스프레드 연산자: book 객체의 모든 속성을 그대로 가져옴
      id: _id.toString(),//_id를 문자열로 변환
      title: book.title.toString(),
      author: book.author.toString(),
    }
  })



  return {
    props: { books: bookData } //props로 bookData를 전달
  }
};

export default function Home({ books }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div style={{ padding: "20px" }}>
      <h1>📚 내 책장 (전체 목록)</h1>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <a href={`/book/${book.id}`}>{book.title} </a>({book.author})
          </li>
        ))}
      </ul>
    </div>
  );
};