import { ChangeEvent, ReactNode, useState } from "react";

export default function SearchbarLayout({
   children,
}: {
   children: ReactNode //주석?
}) {

   const [search, setSeach] = useState("");//useState는 상태를 관리하는 함수입니다.
   const onChageSearch = (e: ChangeEvent<HTMLInputElement>) => {//ChangeEvent는 리액트에서 이벤트를 처리할 때 사용합니다.
      setSeach(e.target.value);
   }
   return (
      <div>
         <div>
            <div>
               <input value={search} onChange={onChageSearch} placeholder="검색어를입력하시오" />
            </div>
            <button>검색</button>
         </div>
         {children}
      </div>
   );
}
