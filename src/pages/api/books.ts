/*확장자 (.ts vs .tsx): API 파일은 사용자에게 보여줄 화면(UI)을 그리는 
곳이 아니라 데이터만 처리하는 곳입니다. 그래서 화면을 그리는 
기능이 들어간 .tsx 대신, 순수하게 코드만 적는 .ts 확장자를 사용합니다*/
import clientPromise from "@/lib/db"; //// 방금 만든 DB 연결 도구를 수입(import)해 옵니다!
import type { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   // 프론트엔드에서 데이터(POST 요청)를 보냈을 때만 처리합니다.

   if (req.method === 'POST') {
      // req.body 안에 우리가 화면에서 보낸 title, author 데이터가 들어옵니다!
      const { title, author } = req.body;
      try {
         // 1. 대기시켜둔 DB 연결 통로를 엽니다.
         const client = await clientPromise;
         // 2. 'myBookDB'라는 이름의 데이터베이스 창고를 선택합니다.
         const db = client.db("myBookDB");
         // 3. 'books' 컬렉션(테이블(서랍))에 제목과저자를 삽입(insert)합니다.
         await db.collection("books").insertOne({ title, author });//insertOne는 몽고디비에서 데이터를 삽입하는 함수입니다.
         // 성공적으로 저장했다고 프론트엔드에 알려줍니다.
         //// 성공적으로 저장했다고 프론트엔드에 알려줍니다.
         res.status(200).json({ message: "책이 성공적으로 등록되었습니다." });

         console.log("서버에도착한데이터", title, author);
         // 나중에는 여기서 데이터베이스(DB)에 데이터를 저장하는 코드가 들어갑니다.
         // 지금은 일단 성공했다는 응답만 보냅니다.
         // 프론트엔드에 "성공적으로 잘 받았어!"라고 응답(200 OK)을 보냅니다.
      } catch (err) {
         // 만약 에러가 나면 500(서버 에러) 상태 코드를 보냅니다.
         res.status(500).json({ message: "디비저장중 에러가 발생했습니다." });
         console.error("", err);
      }
   }
}