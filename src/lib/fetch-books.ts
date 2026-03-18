import { BookData } from "@/types";

export default async function fetchBooks(): Promise<BookData[]> {
   const url = `http://localhost:8080/book`;
   try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("");

      return await response.json();
   } catch (err) {
      console.error("", err);
      return [];
   }
}