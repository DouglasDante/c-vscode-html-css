// export const enum StyleType {
//   ID = "#",
//   CLASS = ".",
// }

import { Uri, workspace } from "vscode"

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

  // console.log("경로 호출: ", txt_str_path);

  // let txt_uri = Uri.file(txt_str_path).toString();

  let txt_str = await workspace.fs.readFile(Uri.file(txt_str_path)).then(get_str => get_str.toString());

  let txtr_arr = txt_str.split("\n");


  for (const dter of txtr_arr) {
    console.log("각 요소 선회 하며 출력: ", dter);
  }

  // console.log("출력 테스트: ", txt_str);
  // return txt_str;
}

// { console.log("내용물 출력: ", get_txt_test()); }
