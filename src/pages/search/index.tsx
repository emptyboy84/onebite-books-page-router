import { useRouter } from "next/router"; //next.js에서 라우터를 사용하기 위한 hook

export default function Page() {

   const router = useRouter();
   return (
      <div>
         <h1>검색 페이지</h1>
         검색: {router.query.q}
      </div>
   );
}