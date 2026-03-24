/* GET /api/time 요청에 현재 서버 시간을 JSON으로 반환하는 API 테스트 핸들러. */
import type { NextApiRequest, NextApiResponse } from "next";


export default function handler(req: NextApiRequest, res: NextApiResponse) {
   const currrentTime = new Date().toLocaleDateString();//현재시간을 지역화된 날짜 문자열로 반환
   res.status(200).json({ currrentTime });//json형식으로 응답

}