/**
 * [API] /api/book/[id]
 *
 * GET    → id에 해당하는 책 1권의 상세 데이터를 반환합니다.
 * PUT    → id에 해당하는 책의 { title, author } 를 수정합니다.
 * DELETE → id에 해당하는 책을 컬렉션에서 삭제합니다.
 *
 * URL 파라미터 :id 는 MongoDB ObjectId 문자열 형태여야 합니다.
 */

import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) { //id와 q를 받음
   // URL에서 [id] 파라미터를 꺼냅니다 (예: /api/book/abc123)
   const { id } = req.query;
   const q = req.query.q;//

   // id 유효성 검증 (없거나 배열이면 거부)
   if (!id || typeof id !== "string") {
      return res.status(400).json({ success: false, message: "유효한 책 ID가 필요합니다." });
   }

   let objectId: ObjectId;
   try {
      // 문자열을 MongoDB ObjectId 타입으로 변환 (실패하면 잘못된 ID 형식)
      objectId = new ObjectId(id);
   } catch {
      return res.status(400).json({ success: false, message: "올바르지 않은 ID 형식입니다." });
   }

   const client = await clientPromise;
   const db = client.db("myBookDB");
   const collection = db.collection("books");

   // ── GET: 책 1권 조회 ────────────────────────────────────────────────
   if (req.method === "GET") {
      try {
         const book = await collection.findOne({ _id: objectId });

         if (!book) {
            return res.status(404).json({ success: false, message: "해당 책을 찾을 수 없습니다." });
         }

         // _id → id 직렬화
         const { _id, ...rest } = book;
         return res.status(200).json({ ...rest, id: _id.toString() });
      } catch (err) {
         console.error("단건 조회 오류:", err);
         return res.status(500).json({ success: false, message: "책 조회 중 오류가 발생했습니다." });
      }
   }

   // ── PUT: 책 수정 ────────────────────────────────────────────────────
   if (req.method === "PUT") {
      const { title, author } = req.body;

      // 수정할 값이 하나도 없으면 거부
      if (!title && !author) {
         return res.status(400).json({ success: false, message: "수정할 제목 또는 저자를 입력해주세요." });
      }

      try {
         // $set: 지정한 필드만 덮어씁니다 (나머지 필드는 유지됩니다)
         const updateFields: Record<string, string> = {};
         if (title) updateFields.title = title;
         if (author) updateFields.author = author;

         const result = await collection.updateOne(
            { _id: objectId },
            { $set: updateFields }
         );

         if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: "수정할 책을 찾을 수 없습니다." });
         }

         console.log("수정된 책 ID:", id, "→", updateFields);
         return res.status(200).json({ success: true, message: "책이 성공적으로 수정되었습니다." });
      } catch (err) {
         console.error("수정 오류:", err);
         return res.status(500).json({ success: false, message: "책 수정 중 오류가 발생했습니다." });
      }
   }

   // ── DELETE: 책 삭제 ─────────────────────────────────────────────────
   if (req.method === "DELETE") {
      try {
         const result = await collection.deleteOne({ _id: objectId });

         if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "삭제할 책을 찾을 수 없습니다." });
         }

         console.log("삭제된 책 ID:", id);
         return res.status(200).json({ success: true, message: "책이 성공적으로 삭제되었습니다." });
      } catch (err) {
         console.error("삭제 오류:", err);
         return res.status(500).json({ success: false, message: "책 삭제 중 오류가 발생했습니다." });
      }
   }

   // ── 그 외 메서드 ────────────────────────────────────────────────────
   res.status(405).json({ message: "허용되지 않는 메서드입니다." });
}