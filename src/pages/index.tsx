import SearchbarLayout from "@/components/searchbar-layout";
import { ReactNode } from "react";

export default function Home() {//js에서 함수는 사실객체이다
  // useEffect(() => {
  //   throw new E  rror("");
  // }, []);
  return (
    <div>
      <h1 className='style.title'>인덱스페이지</h1>
    </div>
  );
}

Home.getLayout = (page: ReactNode) => {
  return <SearchbarLayout>{page}</SearchbarLayout>;
}
