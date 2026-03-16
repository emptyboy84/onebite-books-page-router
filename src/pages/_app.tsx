//app에서 루트컴포턴트  (글로벌설정을관리)
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactNode } from "react";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactNode) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

//css는 여기서만불러온다
import GlobalLayout from "@/components/global-layout";
import "@/styles/globals.css";
//import "../pages/index.module.css";


export default function App({ Component, pageProps }: AppPropsWithLayout) {// Component는 현재 접속한 페이지 
  // 컴포넌트를 의미합니다. (예: index.tsx의 Home 컴포넌트)
  // pageProps는 해당 페이지에 전달되는 초기 데이터(props)를 의미합니다.
  //AppProwWithLayout은 AppProps를 상속받고 Component에 getLayout을 추가한 타입입니다.

  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);// 1. 페이지별 맞춤 레이아웃 함수 가져오기

  return (// 3. 화면에 렌더링할 내용 반환

    <GlobalLayout>
      {/* GlobalLayout으로 전체 앱의 공통 레이아웃(예: 상단 헤더, 푸터 등)을 감싸줍니다. */}
      {getLayout(<Component {...pageProps} />)}
    </GlobalLayout>

  );
}
