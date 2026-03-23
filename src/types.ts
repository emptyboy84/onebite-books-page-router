export interface BookData {
   id: string | number;
   title: string;
   /*선택적 프로퍼티(Optional Property) 라고 부르는 아주 유용한 문법입니다. 
   "이 데이터는 있을 수도 있고 없을 수도 있어(필수가 아니야)"라고 컴퓨터에게 미리 알려주는 유연한 방패 역할을 하죠. 🛡️*/
   subTitle?: string;
   author: string;
   //선택적 프로퍼티(Optional Property) 라고 부르는 아주 유용한 문법입니다. 
   publisher?: string;
   coverImgUrl?: string;
   description?: string;

}