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
