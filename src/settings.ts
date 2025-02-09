/*
 * Copyright (c) 1986-2024 Ecmel Ercan (https://ecmel.dev/)
 * Licensed under the MIT License
 */

import Path from "path";
import { TextDocument, workspace } from "vscode";

export function getEnabledLanguages(): string[] {
  return workspace
    .getConfiguration("css")
    .get<string[]>("enabledLanguages", ["html"]);
}

/** 
 각 워크스페이스의 settings.json 파일의 css.stylesheet 구문을 가져온다.
*/
export function getStyleSheets(scope: TextDocument): string[] {
  /** 
   활성화 된 문서의 경로(파일이름을 제외한)를 반환한다.

   여기서 스코프 경로의 위치는 프로바이더가 호출되는 텍스트 도큐먼트 위치다.
   즉, html 파일의 경로가 반환된다.

   스코프는 html 파일을 가리킨다.
  */
  // console.log("스코프 출력: ", scope.getText());
  const path = Path.parse(scope.fileName);

  // console.log("스코프 경로 출력: ", path);

  // let work_config = workspace.getConfiguration("css", scope);
  // let config_get = work_config.get<string[]>("styleSheets", []);
  // for (const dter of value_cst) {
  //   console.log("반환된 문자열 선회 출력: ", dter);
  // }

  // for (const dter of config_get) {
  //   console.log("get config 검사: ", dter);
  // }

  // let replace_test = config_get.map((glob) =>
  //   glob.replace(
  //     /\$\s*{\s*(fileBasenameNoExtension|fileBasename|fileExtname)\s*}/g,
  //     (match, variable) =>
  //       variable === "fileBasename"
  //         ? path.base
  //         : variable === "fileExtname"
  //           ? path.ext
  //           : path.name
  //   )
  // );

  // for (const dter of replace_test) {
  //   console.log("반환된 내용물 검사: ", dter);
  // }

  return workspace
    /** 
     워크스페이스의 구성 목록을 가져온다
     
     여기서 타겟은 .vscode/settings.json 파일의 css.stylesheet 요소를 가져온다.
    */
    .getConfiguration("css", scope)
    .get<string[]>("styleSheets", [])
    .map((glob) =>
      glob.replace(
        /\$\s*{\s*(fileBasenameNoExtension|fileBasename|fileExtname)\s*}/g,
        (match, variable) =>
          variable === "fileBasename"
            ? path.base
            : variable === "fileExtname"
              ? path.ext
              : path.name
      )
    );
}

export const enum AutoValidation {
  NEVER = "Never",
  SAVE = "Save",
  ALWAYS = "Always",
}

export function getAutoValidation(scope: TextDocument): AutoValidation {
  return workspace
    .getConfiguration("css", scope)
    .get<AutoValidation>("autoValidation", AutoValidation.NEVER);
}
