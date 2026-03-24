/* /create 경로의 책 생성 페이지 (미완성). new.tsx와 유사한 역할이며 현재 작성 중인 파일입니다. */
import { useRouter } from "next/router";
import { useState } from "react";

export default function Page() {
   const [title, setTitle] = useState("");//책 제목을 입력받을 상태
   //const [subTitle,setSubTitle]=useState("");//책 부제를 입력받을 상태
   const [author, setAuthor] = useState("");//책 저자를 입력받을 상태
   //const [coverImgUrl,setCoverImgUrl]=useState("");//책 표지 이미지를 입력받을 상태
   //const [description,setDescription]=useState("");//책 설명을 입력받을 상태

   const router = useRouter();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      //여기에 나중에
   }

}
