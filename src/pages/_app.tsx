//app에서 루트컴포턴트  (글로벌설정을관리)
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { useRouter } from "next/router";



export default function App({ Component, pageProps }: AppProps) {//Component는 현재 페이지를 의미, // pageProps는 현재 페이지의 props를 의미
  const router = useRouter();
  return (
    <><header>
      <br></br>
      <Link href="/">홈</Link>&nbsp;
      <Link href="/search">검색</Link>&nbsp;
      <Link href="/book/[id]">도서</Link>&nbsp;
      <br />
      <button onClick={() => router.push("/book/1")}>1번도서</button>&nbsp;
      <button onClick={() => router.push("/book/2")}>2번도서</button>&nbsp;
      <button onClick={() => router.back()}>뒤로가기</button>&nbsp;
      <button onClick={() => router.forward()}>앞으로가기</button>&nbsp;
      <button onClick={() => router.reload()}>새로고침</but ton>&nbsp;


    </header>

      <Component {...pageProps} />
    </>
  );
}
