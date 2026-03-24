import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;//.env.local에 적은 주소를가져온다 as string은 문자열로 변환하라는 뜻
const options = {};//옵션  

let client: MongoClient;//전역변수로 선언
let clientPromise: Promise<MongoClient>;//전역변수로 선언 

if (!process.env.MONGODB_URI) {//MONGODB_URI가 없으면
   throw new Error("Please add your Mongo URI to .env.local");//에러를 던진다 
}

//개발환경에서는 연결을 재사용하도록 설정합니다.

if (process.env.NODE_ENV === "development") {//개발환경에서는 연결을 재사용  안하면 핫리로드할때마다 연결해서 느려짐
   const globalWithMongo = global as typeof globalThis & { //globalThis는 전역객체로 mongoClientPromise가 없어서 
      //에러가 나는데 typeof globalThis로 타입을 지정해서 에러를 해결합니다.
      _mongoClientPromise?: Promise<MongoClient>//
   };

   if (!globalWithMongo._mongoClientPromise) {//_mongoClientPromise가 없으면
      client = new MongoClient(uri, options);//연결
      globalWithMongo._mongoClientPromise = client.connect();//연결
   }
   clientPromise = globalWithMongo._mongoClientPromise;
} else {
   // 실제 배포(운영) 환경에서는 매번 새로 연결해도 괜찮도록 최적화되어 있습니다.

   client = new MongoClient(uri, options);
   clientPromise = client.connect();
}

export default clientPromise;
