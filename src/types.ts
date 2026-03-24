/* 프로젝트 전체에서 공통으로 사용하는 TypeScript 타입(인터페이스) 정의 파일. */
export interface BookData {
   id: string | number;
   title: string;
   // 선택적 필드(Optional): DB에 해당 값이 없으면 null로 들어옵니다.
   // getServerSideProps에서 undefined는 직렬화 불가 → null로 변환하므로 타입도 null 허용
   subTitle?: string | null;
   author: string;
   publisher?: string | null;
   coverImgUrl?: string | null;
   description?: string | null;
}