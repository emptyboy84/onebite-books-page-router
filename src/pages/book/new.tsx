import { useRouter } from "next/router"; // 1. 라우터 기능 불러오기
import { useState } from "react";


export default function Page() {
   const router = useRouter();// 2. 라우터 객체 생성,라우터 사용 준비하기

   // 제목과 저자를 기억할 상태(State)를 만듭니다. 초기값은 빈 문자열("")입니다.
   const [title, setTitle] = useState("");//useState 함수는 실행되고 나면 항상 두 개의 요소를 가진 배열을 결과로 돌려줍니다.
   //첫 번째 요소: 현재 기억하고 있는 값 (예: title)
   //두 번째 요소: 그 값을 업데이트할 때 쓰는 함수 (예: setTitle)

   const [author, setAuthor] = useState("");

   const onChangTitle = (e: React.ChangeEvent<HTMLInputElement>) => {//e: 이벤트(Event) 객체를 의미합니다.
      //e.target은 이벤트가 발생한 HTML 요소를 가리킵니다. (여기서는 input 태그)
      //React.ChangeEvent<...>: 이 변수는 "리액트에서 값이 변하는 이벤트"라고 타입을 딱 정해주는 거예요.


      setTitle(e.target.value);//e.target.value는 이벤트가 발생한 요소(여기서는 input 태그)의 현재 값을 의미합니다.

   };

   const onChangAuthor = (e: React.ChangeEvent<HTMLInputElement>) => {//e: 이벤트(Event) 객체를 의미합니다.
      setAuthor(e.target.value);
   };
   // 서버로 데이터를 전송하는 제출 함수
   const onSubmit = async () => {//async는 비동기 함수를 의미합니다.
      const response = await fetch("/api/books", {//await는 비동기 함수를 호출하고 그 결과가 반환될 때까지 기다립니다.
         method: "POST", // 새로운 데이터를 생성할 때는 POST 방식을 사용합니다.
         headers: {
            "Content-Type": "application/json",// JSON 형태로 데이터를 보낸다고 알려줍니다.
         },
         body: JSON.stringify({ title, author })// 상태(State)에 저장된 데이터를 포장합니다.
      });
      if (response.ok) {
         alert("책이 성공적으로 등록되었습니다.");
         router.push("/")// 3. 성공 시 메인 페이지('/')로 이동! 🚗

      }


   };

   return (
      <div>
         <h2>새로운 책 등록하기</h2>
         <input value={title} onChange={onChangTitle} placeholder="제목을입력하세요" />
         <input value={author} onChange={onChangAuthor} placeholder="저자를입력하세요" />
         {/* 버튼을 누르면 onSubmit 함수가 실행됩니다 */}
         <button onClick={onSubmit}>등록하기</button>
         {/* 익명 함수(화살표 함수)'**라고 부릅니다. 버튼을 눌렀을 때 그 자리에서 임시로 딱 한 번만 실행하고 
         말 거라서 굳이 이름을 붙이지 않은 것이죠.*/}
      </div>
   );
}