/* 모든 페이지에 공통으로 적용되는 최상위 레이아웃. 상단 헤더(로고)와 하단 푸터(책 등록 링크)를 포함합니다. */
import Link from "next/link";
import { ReactNode } from "react";
import style from "./global-layout.module.css";


// 글로벌 레이아웃 컴포넌트: 모든 페이지에 공통으로 적용될 레이아웃(헤더, 푸터 등)을 정의합니다.
export default function GlobalLayout({
   children }: { children: ReactNode }) { // children은 GlobalLayout 태그 사이에 들어오는 하위 요소(현재 페이지 컴포넌트)를 의미합니다.
   return (
      <div className={style.container}> {/*style.container는 global-layout.module.css에 정의된 클래스입니다.*/}
         {/* 상단 헤더 영역 */}
         <header>
            <Link href="/">Onebite books</Link>&nbsp;
         </header>

         {/* 메인 컨텐츠 영역: _app.tsx에서 전달한 <Component {...pageProps} />가 여기에 나타납니다. */}
         <main>
            {children}
         </main>

         {/* 하단 푸터 영역 */}
         <footer>
         </footer>
      </div>
   );
}