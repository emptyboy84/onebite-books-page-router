/* 외부 API(/book/random)에서 랜덤 책 목록을 가져오는 fetch 유틸리티 함수. */
import { BookData } from "@/types";

export default async function fetchRandomBooks(): Promise<BookData[]> {
   const url = ``;
   try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("");

      return await response.json();
   } catch (err) {
      console.error(err);
      return [];
   }
}
