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
      type: match[1] as StyleType,
      selector: match[2].replaceAll("\\", ''),
    });
  }
  return styles;
}