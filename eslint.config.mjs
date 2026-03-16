import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

// ESM(ECMAScript Modules) 환경에서는 __dirname과 __filename이 기본적으로 제공되지 않으므로
// import.meta.url을 사용하여 현재 파일의 경로와 디렉토리 경로를 직접 구합니다.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 기존의 .eslintrc 형식(Legacy)의 설정 파일들을
// 새로운 Flat Config 형식(eslint.config.mjs)에서 사용할 수 있도록 변환해주는 도구(Compat)입니다.
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// ESLint 설정 배열
const eslintConfig = [
  // Next.js의 웹 성능 향상 기본 규칙(core-web-vitals)과 TypeScript 지원 규칙을 가져와 적용합니다.
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // 사용자 정의 규칙을 설정하는 부분입니다.
    rules: {
      // 사용되지 않는 변수가 있어도 경고나 에러를 띄우지 않도록 끕니다(off).
      "@typescript-eslint/no-unused-vars": "off",
      // 'any' 타입을 명시적으로 사용해도 경고나 에러를 띄우지 않도록 끕니다(off).
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
