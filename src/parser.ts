/*
 * Copyright (c) 1986-2024 Ecmel Ercan (https://ecmel.dev/)
 * Licensed under the MIT License
 */

import lineColumn from "line-column";

export const enum StyleType {
  ID = "#",
  CLASS = ".",
  TestAttribute = "test_attribute"
}

export interface Style {
  index: number;
  line: number;
  col: number;
  type: StyleType;
  selector: string;
}

/** 
 css파일의 코드를 문자열 덩어리로 받아서 원하는 요소만 남도록(클래스와 태그 아이디의 이름) 정규식으로 파싱하여 스타일 배열에 담아 묶어서 반환한다.
*/
export function parse(text: string) {
  /** 
   css 파일에서 소스코드를 가지고 오면 (.)을 포함한 클래스 이름을 가져오는 정규식이다
  */
  const selector =
    /([.#])(-?[_a-zA-Z]+[\\!+_a-zA-Z0-9-]*)(?=[#.,()\s\[\]\^:*"'>=_a-zA-Z0-9-]*{[^}]*})/g;
  // const str_selector = / /g;
  const styles: Style[] = [];
  const lc = lineColumn(text, { origin: 0 });
  let match,
    lci,
    index,
    line = 0,
    col = 0;
  /** 
   정규식 패턴을 이용하여 들어오는 텍스트에 대해 검색 하고, 결과 값을 반환한다.
  */
  while ((match = selector.exec(text))) {
    /** 
     match[0]의 경우 ([.#])와 클래스 및 태그 식별자가 분리 되기 전의 형태이며

     match[1]의 경우 . | #

     match[2]의 경우 식별자만 할당된다.
    */
    // console.log(`매치 길이 출력: ${match.length}`);
    // console.log("매치 0 할당 여부 확인: ", match[0]);
    // console.log("매치 1 할당 여부 확인: ", match[1]);
    // console.log("매치 2 할당 여부 확인: ", match[2]);

    index = match.index;
    lci = lc.fromIndex(index);

    if (lci) {
      line = lci.line;
      col = lci.col + 1;
    }

    styles.push({
      index,
      line,
      col,
      /** 
       클래스와 아이디 태그의 첫 문자가 특수기호 이므로 단순 인덱스로 파싱이 가능하다.

       단순 텍스트 문자를 완성아이템으로 던지기 위해서는 따로 스타일을 할당할 방법이 필요하다.
      */
      type: match[1] as StyleType,
      selector: match[2].replaceAll("\\", ''),
    });
  }
  return styles;
}

export function txt_parse(text: string) {
  const selector = /[\D\d][^\n]+/g;
  // const str_selector = / /g;
  const styles: Style[] = [];
  const lc = lineColumn(text, { origin: 0 });
  let match,
    lci,
    index,
    line = 0,
    col = 0;
  while ((match = selector.exec(text))) {
    index = match.index;
    lci = lc.fromIndex(index);

    if (lci) {
      line = lci.line;
      col = lci.col + 1;
    }
    styles.push({
      index,
      line,
      col,
      type: StyleType.TestAttribute,
      selector: match.toString(),
    });
  }
  return styles;
}