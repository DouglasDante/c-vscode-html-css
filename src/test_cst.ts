// export const enum StyleType {
//   ID = "#",
//   CLASS = ".",
// }

import { Uri, workspace } from "vscode"
import { txt_parse } from "./parser";

// export interface Style {
//   index: number;
//   line: number;
//   col: number;
//   type: StyleType;
//   selector: string;
// }

// {
//   const map = new Map<string, string[]>();

//   map.set(`key 1`, [`value1`, `value2`]);
//   map.set(`key 2`, [`value1`, `value2`]);
//   map.set(`key 3`, [`value1`, `value2`]);

//   console.log("출력 테스트: ", `${map.get('key 1')}`);
//   console.log("출력 테스트 1: ", `${map.get("Key 2")}`);
//   console.log("출력 테스트 2: ", `${map.get("key 3")}`);

//   console.log("\n- 업데이트 -\n");

//   map.set("key 2", ["change value"]);

//   console.log("출력 테스트 3: ", `${map.get("key 2")}`);

//   console.log("\n------\n");

//   console.log(`맵 출력 테스트: ${map.get("key 1")}`);
//   console.log(`맵 출력 테스트 2: ${map.get("key 4")}`);

//   console.log("\n------\n");

//   console.log(`소유 테스트: ${map.has("key 1")}`);
//   console.log(`소유 테스트 1: ${map.has("key 4")}`);

//   console.log("\n- 순차 반환 테스트 -\n");

//   for (const [key, values] of map) {
//     console.log(`키: ${key}, 값: ${values}`);
//   }

//   console.log("\n------\n");

//   const map_f_arr = Array.from(map);
//   for (const [key, values] of map_f_arr) {
//     console.log(`배열 내용 키: ${key}, 값: ${values}`);
//   }

//   console.log("\n------\n");

//   const map_enteries = map.entries();
//   for (const dter of map_enteries) {
//     console.log(`페어 인덱스 키: ${dter[0]}, 값: ${dter[1]}`);
//   }

//   for (const [key, values] of map_enteries) {
//     console.log(`페어 키: ${key}, 값: ${values}`);
//   }

//   console.log("\n------\n");

//   map.forEach((values, key, target_map) => {
//     console.log(`forEach 키: ${key}, 값: ${values}`);
//   });
// }

// {
//   const test1 = async () => {
//     let value = await 1;
//     console.log("숫자 출력: ", value);

//     value = await Promise.resolve(1);
//     console.log("프로미스 값 출력: ", value);
//   };

//   async function test2() {
//     let value = await "hello";
//     console.log("기본 값 출력: ", value);

//     value = await Promise.resolve("hello");
//     console.log("프로미스 값 출력: ", value);
//   }

//   // test1().then(() => { test2() });

//   for (let dter = 0; dter < 5; dter += 1) {
//     test1().then(() => test2());
//   }
// }

export async function get_txt_test() {
  let txt_str_path = "D:/Coding/master-vsc_extension/c-vscode-html-css/asset/testxt.txt";

  let css_str_path = "D:/Coding/master-vsc_extension/c-vscode-html-css/asset/stylesheet.css";

  let txt_str = await workspace.fs.readFile(Uri.file(txt_str_path)).then(get_str => get_str.toString());

  let css_str = await workspace.fs.readFile(Uri.file(css_str_path)).then(get_str => get_str.toString());

  /** 
   매치에서 0은 전체 매치
   그 다음 숫자는 각 소괄호로 묶은 요소별 매치를 의미한다.
  */
  let css_regexp = /([.#])(-?[_a-zA-Z]+[\\!+_a-zA-Z0-9-]*)(?=[#.,()\s\[\]\^:*"'>=_a-zA-Z0-9-]*{[^}]*})/g;


  // let parse_css_str;

  // while (parse_css_str = css_regexp.exec(css_str)) {
  //   if (parse_css_str) {
  //     console.log(`길이 출력: ${parse_css_str.length}`);
  //     console.log(`내용물 출력 0: ${parse_css_str[0]}`);
  //     console.log(`내용물 출력 1: ${parse_css_str[1]}`);
  //     console.log(`내용물 출력 2: ${parse_css_str[2]}`);
  //   }
  // }

  let txt_regexp = /[\D\d][^\n]+/g;

  let value_tparse = txt_parse(txt_str);

  for (const dter of value_tparse) {
    console.log(`내용 반환: ${dter.selector}`);
  }

  // let parse_txt_str;

  // while (parse_txt_str = txt_regexp.exec(txt_str)) {

  //   if (parse_txt_str) {
  //     console.log("길이 출력: ", parse_txt_str.length);
  //     console.log("내용물 출력: ", parse_txt_str[0]);
  //     console.log(`내용물 길이: ${parse_txt_str[0].length}`);
  //     // console.log("내용물 출력 1: ", parse_txt_str[1]);
  //     // console.log(`내용물 길이 1: ${parse_txt_str[1].length}`);
  //     // for (const dter of parse_str) {
  //     //   console.log("선회 출력: ", dter);
  //     // }
  //   } else {
  //     console.log("내용물 확보 실패");
  //   }
  // }

  // { console.log("내용물 출력: ", get_txt_test()); }
}