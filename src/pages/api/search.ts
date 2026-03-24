/**
 * [API] /api/search?q=검색어
 *
 * GET → 쿼리 파라미터 q 로 전달된 검색어를 포함하는 책 목록을 반환합니다.
 *       제목(title) 또는 저자(author) 에서 대소문자 구별 없이 검색합니다.
 *
 * 예시: /api/search?q=리액트
 */

import clientPromise from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method !== "GET") {
      return res.status(405).json({ message: "허용되지 않는 메서드입니다." });
   }

   // URL의 ?q= 값을 꺼냅니다 (없으면 빈 문자열로 처리)
   const q = (req.query.q as string) ?? "";

   try {
      const client = await clientPromise;
      const db = client.db("myBookDB");

      // $regex: 정규식 포함 검색 / $options: "i" 는 대소문자 무시(case-insensitive)
      // title 또는 author 중 하나라도 검색어를 포함하면 결과에 포함합니다
      const rawBooks = await db.collection("books").find({
         $or: [
            { title: { $regex: q, $options: "i" } },
            { author: { $regex: q, $options: "i" } },
         ],
      }).toArray();

      // ObjectId(_id) → 문자열(id) 로 변환
      const books = rawBooks.map(({ _id, ...rest }) => ({
         ...rest,
         id: _id.toString(),
      }));

      return res.status(200).json(books);
   } catch (err) {
      console.error("검색 오류:", err);
      return res.status(500).json({ success: false, message: "검색 중 오류가 발생했습니다." });
   }
}
