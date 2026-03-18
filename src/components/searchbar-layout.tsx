import { useRouter } from "next/router";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import style from "./searchbar-layout.module.css";

export default function SearchbarLayout({
   children,
}: {
   children: ReactNode
}) {

   const router = useRouter();
   const [search, setSearch] = useState(""); // useState는 상태를 관리하는 함수입니다.

   const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => { // ChangeEvent는 리액트에서 이벤트를 처리할 때 사용합니다.
      // e는 이벤트 객체입니다.
      setSearch(e.target.value); // e.target.value는 input의 현재 값을 의미합니다.
   };

   useEffect(() => {
      setSearch((router.query.q as string || ""));
   }, [router.query.q]);

   const onSubmit = () => {
      if (!search || router.query.q === search) return;
      router.push(`/search?q=${search}`);
   };
   const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
         onSubmit();
      }
   };

   return (
      <div>
         <div className={style.searchbar_container}>
            <input value={search} onChange={onChangeSearch} placeholder="검색어를입력하시오" />
            <button onClick={onSubmit}>검색</button>
         </div>
         {children}
      </div>
   );
}
