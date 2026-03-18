//import { useRouter } from "next/router";
import book from "@/mock/books.json";
import style from "./[id].module.css";


export default function Page() {
   const {
      id,
      title,
      subTitle,
      author,
      publisher,
      coverImgUrl,
      description
   } = book[0];


   return (
      <div className={style.container}>
         <div
            className={style.cover_img_container}
            style={{ backgroundImage: `url('${coverImgUrl}')` }}
         > {/*style은 인라인 스타일을 적용할 때 사용합니다. */}
            <img src={coverImgUrl} />
         </div>
         <div className={style.title}>{title}</div>
         <div className={style.subTitle}>{subTitle}</div>
         <div className={style.author}>
            {author} | {publisher}
         </div>
         <div className={style.description}>{description}</div>
      </div>
   );
}
