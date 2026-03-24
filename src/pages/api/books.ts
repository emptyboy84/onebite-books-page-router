/**
 * [API] /api/books
 *
 * GET  → MongoDB 'books' 컬렉션의 전체 책 목록을 반환합니다.
 * POST → 요청 body의 { title, author } 데이터를 books 컬렉션에 저장합니다.
 *
 * ※ _id(ObjectId) 는 JSON으로 직접 직렬화하면 오류가 나기 때문에
 *    문자열 id 로 변환한 뒤 응답합니다.
 */

import clientPromise from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

   // ── GET: 전체 책 목록 조회 ──────────────────────────────────────────
   if (req.method === "GET") {
      try {
         const client = await clientPromise;
         const db = client.db("myBookDB");

         const rawBooks = await db.collection("books").find().toArray();

         // ObjectId(_id) → 문자열(id) 로 변환해서 반환
         const books = rawBooks.map(({ _id, ...rest }) => ({
            ...rest,
            id: _id.toString(),
         }));

         return res.status(200).json(books);
      } catch (err) {
         console.error("전체 조회 오류:", err);
         return res.status(500).json({ success: false, message: "전체 목록 조회 중 오류가 발생했습니다." });
      }
   }

   // ── POST: 새 책 등록 ────────────────────────────────────────────────
   if (req.method === "POST") {
      const { title, author } = req.body;

      // 필수 값 검증
      if (!title || !author) {
         return res.status(400).json({ success: false, message: "제목과 저자는 필수 입력값입니다." });
      }

      try {
         const client = await clientPromise;
         const db = client.db("myBookDB");

         // books 컬렉션에 새 책을 삽입하고 생성된 문서 ID를 응답으로 돌려줍니다
         const result = await db.collection("books").insertOne({ title, author });

         console.log("등록된 책:", title, author);
         return res.status(201).json({ success: true, id: result.insertedId.toString() });
      } catch (err) {
         console.error("등록 오류:", err);
         return res.status(500).json({ success: false, message: "책 등록 중 오류가 발생했습니다." });
      }
   }

   // ── 그 외 메서드 ────────────────────────────────────────────────────
   res.status(405).json({ message: "허용되지 않는 메서드입니다." });
}
