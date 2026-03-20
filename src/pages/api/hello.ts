//miniBackEnd
//api 폴더는 api 요청을 처리하는 폴더입니다.

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {//Data는 json형식으로 응답, <>는 제네릭으로 Data타입을 의미
  name: string;
};

export default function handler(//req는 요청, res는 응답,handler는 함수(api요청을처리)
  req: NextApiRequest,//요청객체, NextApiRequest는 next.js에서 제공하는 요청객체 
  res: NextApiResponse<Data>,//응답객체, Data는 json형식으로 응답,<Data>는 제네릭으로 Data타입을 의미
) {
  res.status(200).json({ name: "John Doe" });//200은 성공을 의미, json은 json형식으로 응답, name은 "John Doe"를 의미
}
