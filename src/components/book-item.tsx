/* 책 한 권의 정보를 카드 형태로 보여주는 공통 컴포넌트. 클릭 시 해당 책 상세 페이지(/book/[id])로 이동합니다. */
import { BookData } from "@/types";
import Link from "next/link";
import style from "./book-item.module.css";

export default function BookItem({ id, title, subTitle, author, publisher, coverImgUrl }: BookData) {
   // 속성(Props)으로 전달받은 값들을 전개 연산자를 통해 받아옵니다 (id, title, 등).
   return (
      // Link 태그를 활용하여 클릭 시 `/books/1`, `/books/2` 형태의 상세 페이지로 이동하도록 설정합니다.
      <Link href={`/book/${id}`} className={style.searchbar_container}>
         <img src={coverImgUrl} />
         <div>
            <div className={style.title}>{title}</div>
            <div className={style.subTitle}>{subTitle}</div>
            <br />
            <div className={style.author}>{author}|{publisher}</div>
         </div>
      </Link>
   );
}