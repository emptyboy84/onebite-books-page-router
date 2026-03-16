import type { NextApiRequest, NextApiResponse } from "next";


export default function handler(req: NextApiRequest, res: NextApiResponse) {
   const currrentTime = new Date().toLocaleDateString();//현재시간을 지역화된 날짜 문자열로 반환
   res.status(200).json({ currrentTime });//json형식으로 응답

}