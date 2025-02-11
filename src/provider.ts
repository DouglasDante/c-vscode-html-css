/*
 * Copyright (c) 1986-2024 Ecmel Ercan (https://ecmel.dev/)
 * Licensed under the MIT License
 */

import {
  CancellationToken,
  CompletionContext,
  CompletionItem,
  CompletionItemKind,
  CompletionItemProvider,
  CompletionList,
  Definition,
  DefinitionProvider,
  Diagnostic,
  DiagnosticSeverity,
  Location,
  LocationLink,
  Position,
  ProviderResult,
  Range,
  RelativePattern,
  SnippetString,
  TextDocument,
  Uri,
  window,
  workspace,
  WorkspaceFolder,
} from "vscode";
import { getStyleSheets } from "./settings";
import { Style, StyleType, parse } from "./parser";
import { getLineAndCharacterOfPosition } from "typescript";

const start = new Position(0, 0);
const cache = new Map<string, Style[]>();
const cache_str = new Map<string, string[]>();


export class Provider implements CompletionItemProvider, DefinitionProvider {
  /** 
   url 주소 파서 정규식 반환
  */
  private get isRemote() {
    return /^https?:\/\//i;
  }

  /** 
   모든 영문자 및 숫자 파서 정규식 반환
  */
  private get wordRange() {
    return /[_a-zA-Z0-9-]+/;
  }

  private get canComplete() {
    return /(id|class|className|[.#]|test_attribute)\s*[=:]?\s*(["'])(?:.(?!\2))*$/is;
  }

  /* url을 받아서 내용물이 있으면 문자열로 반환한다. */
  private async fetch(url: string) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return res.text();
      }
      throw new Error(res.statusText);
    } catch (error) {
      window.showErrorMessage(`Fetching ${url} failed. ${error}`);
    }
    return "";
  }

  /** 
   
  */
  private async getRemote(name: string) {
    let styles = cache.get(name);
    if (!styles) {
      const content = await this.fetch(name);
      // console.log("펫치 반환 컨텐츠 검사: ", content);
      styles = parse(content);
      cache.set(name, styles);
    }
    // console.log("스타일 검사: ", styles);
    return styles;
  }

  /** 로컬 uri를 가져와서 css 클래스 이름이 반환되도록 파싱한다. */
  private async getLocal(uri: Uri) {
    const name = uri.toString();
    let styles = cache.get(name);
    if (!styles) {
      /** 
       인자로 들어온 css 파일 경로를 통해 8비트 바이너리로 가져온다
      */
      const content = await workspace.fs.readFile(uri);
      /** 
       가져온 바이너리를 다시 문자열로 치환한 뒤 원하는 이름만 남도록(클래스 또는 태그 아이디) 파싱하여 스타일에 대입한다.
      */
      styles = parse(content.toString());
      cache.set(name, styles);
    }
    return styles;
  }

  /** 
   워크스페이스 경로와 css.styleSheet 요소를 묶어서 반환하는 함수다.
  */
  private getRelativePattern(folder: WorkspaceFolder, glob: string) {
    return new RelativePattern(folder, glob);
  }

  private async getStyles(document: TextDocument) {
    const styles = new Map<string, Style[]>();
    /** 
     워크스페이스 폴더의 uri를 가져와 워크스페이스 폴더를 반환한다.
    */
    const folder = workspace.getWorkspaceFolder(document.uri);

    /** 
     .vscode/settings.json의 css.styleSheet 요소를 가져온다.
    */
    const globs = getStyleSheets(document);

    console.log("가져온 스타일 시트 출력: ", globs);

    for (const glob of globs) {
      if (this.isRemote.test(glob)) {
        /** 
         하이퍼텍스트 링크로 연결되어 있을 경우 연결하는 함수다.
        */
        styles.set(glob, await this.getRemote(glob));
      } else if (folder) {
        // let value_cst = this.getRelativePattern(folder, glob);

        // console.log("리턴 값 출력 테스트: ", value_cst);

        /** 
         본 코드를 통해 워크스페이스의 경로와 glob(asset\/**\/.css) 패턴을 통해 css 파일 경로를 가져온다
        */
        const files = await workspace.findFiles(
          this.getRelativePattern(folder, glob)
        );
        console.log("파일 목록 출력: ", files);
        /** 
         바로 위코드에서 얻어진 파일 Uri를 통해 css 및 txt 파일을 getLocal로 보내 파싱하게 된다.

         즉 ,여기서 넘겨줄 때 파일 형식을 알려서 스타일 타입을 정할 필요가 있어 보인다. 
        */
        for (const file of files) {
          styles.set(file.toString(), await this.getLocal(file));
        }
      }
    }
    /** 
     이후 html 문서 내부에서도 파싱하여 스타일 클래스를 검색한 뒤 반환 값들을 키와 값으로 넣는다

     클래스가 없으 경우 값은 0이 반환 된다.
    */
    styles.set(document.uri.toString(), parse(document.getText()));

    /** 
     호출 여부 테스트
    */
    // window.showInformationMessage("호출 테스트");
    // console.log("객체 출력 실험: ", styles);
    // console.log("반환 문서 출력 실험: ", document.getText());

    return styles;
  }

  // private async get_str_arr(document: TextDocument) {
  //   const styles = new Map<string, string[]>();
  //   /** 
  //    워크스페이스 폴더의 uri를 가져와 워크스페이스 폴더를 반환한다.
  //   */
  //   const folder = workspace.getWorkspaceFolder(document.uri);
  //   /** 
  //    .vscode/settings.json의 css.styleSheet 요소를 가져온다.
  //   */
  //   const globs = getStyleSheets(document);

  //   for (const glob of globs) {
  //     if (folder) {
  //       // let value_cst = this.getRelativePattern(folder, glob);

  //       // console.log("리턴 값 출력 테스트: ", value_cst);

  //       /** 
  //        본 코드를 통해 워크스페이스의 경로와 glob(asset\/**\/.css) 패턴을 통해 css 파일 경로를 가져온다
  //       */
  //       const files = await workspace.findFiles(
  //         this.getRelativePattern(folder, glob)
  //       );
  //       // console.log("파일 목록 출력: ", files);
  //       for (const file of files) {
  //         styles.set(file.toString(), await this.getLocal(file));
  //       }
  //     }
  //   }
  //   /** 
  //    이후 html 문서 내부에서도 파싱하여 스타일 클래스를 검색한 뒤 반환 값들을 키와 값으로 넣는다

  //    클래스가 없으 경우 값은 0이 반환 된다.
  //   */
  //   styles.set(document.uri.toString(), parse(document.getText()));

  //   /** 
  //    호출 여부 테스트
  //   */
  //   // window.showInformationMessage("호출 테스트");
  //   // console.log("객체 출력 실험: ", styles);
  //   // console.log("반환 문서 출력 실험: ", document.getText());

  //   return styles;
  // }

  /** 
   이곳에서 스타일이냐 txt냐를 검사하여 분기코드를 작성한다.
  */
  private async getCompletionMap(document: TextDocument, type: StyleType) {
    const map = new Map<string, CompletionItem>();
    /** 
     스타일 묶음을 가져온다
    */
    const styles = await this.getStyles(document);

    /** 
     스타일시트 클래스 목록을 배열로 가져와서 검사한다.
    */
    for (const value of styles.values()) {
      for (const style of value) {
        /** 
         클래스냐 ID냐를 검사하여
        */
        if (style.type === type) {
          /** 
           완성시킬 아이템으로 선택자를 키로 넣고, 클래스면 완성아이템 종류로 열거를, 태그이면 값을 넣는다.
          */
          const item = new CompletionItem(
            style.selector,
            style.type === StyleType.ID
              ? CompletionItemKind.Value
              : CompletionItemKind.Enum
          );
          map.set(style.selector, item);
        }
      }
    }
    return map;
  }

  /** 
   해당 코드가 매치 적합시 완성 목록을 가져오는 코드다. 
   
  */
  private async getCompletionItems(
    document: TextDocument,
    position: Position,
    type: StyleType
  ) {
    // console.log("워드 레인지 출력: ", this.wordRange);
    /** 
     html 속성 구문에서 = 등의 특수문자가 있으므로 범위가 파서되어 반환되지 않을 수 있다.
    */
    const range = document.getWordRangeAtPosition(position, this.wordRange);
    // console.log("레인지 출력 - 시작: ", range?.start, ", 끝: ", range?.end);

    /** 
     인수로 받은 타입을 통해 클래스냐 아이디냐를 검사하여 가져온다
    */
    const map = await this.getCompletionMap(document, type);
    // console.log("맵 내용물 출력: ", map);
    const items: CompletionItem[] = [];

    for (const item of map.values()) {
      item.range = range;
      items.push(item);
    }

    // console.log("반환 값 출력: ", items);

    /** 
     실험용 추가 코드
    */
    // window.showInformationMessage("엄준식은 살아있고 위대하다 ! ! !");
    return items;
  }

  provideCompletionItems(
    document: TextDocument,
    position: Position,
    token: CancellationToken,
    context: CompletionContext
  ): ProviderResult<CompletionItem[] | CompletionList<CompletionItem>> {
    /** 
     범위를 검색하여
    */
    const range = new Range(start, position);
    /** 
     범위를 문자열 덩어리로 반환한다
    */
    const text = document.getText(range);
    /** 
     스타일을 검색할 수 있는 정규표현식을 가져온다
    */
    const match = this.canComplete.exec(text);

    // console.log("매치 출력 테스트: ", match);
    // console.log("각 인수 검사");
    // console.log("document란: ", document.getText());
    // console.log("position이란: ", position);
    // console.log("토큰 취소 요청이란 무엇인가?: ", token.isCancellationRequested);
    /** 
     html 문서를 가져오며, 가져온 문서의 텍스트 커서 위치 또한 가져온 뒤
     
     해당 소스에서 커서의 타겟이 html 태그의 class인지 id 인지 검사한다.
     
     match[0]에는 보다 정규식의 구문이 들어가며,
     match[1]에는 타입(class 또는 id)이 들어간다

     만약 각져온 문서에서 추출된 match가 null이 아니고, 취소 토큰의 취소 요청이 없으면 완성 아이템을 호출하여 가져온다.
    */
    let rt_promise: ProviderResult<CompletionItem[] | CompletionList<CompletionItem>> = new Promise((resolve, reject) =>
      /** 
       정규표현식이 존재하고, 토큰이 취소되지 않으면
      */
      match && !token.isCancellationRequested
        ?
        // () => {
        // console.log(" 각 인수 검사");
        // console.log("document란: ", document);
        // console.log("position이란: ", position);
        resolve(
          this.getCompletionItems(
            document,
            position,
            match[1] === "id" ? StyleType.ID : StyleType.CLASS
          )
        )
        // }
        : reject()
    );

    // if (match) {
    // console.log("매치 검사 테스트");
    // console.log("매치 0: ", match[0]);
    // console.log("매치 1: ", match[1])
    // }

    // console.log("토큰 출력 테스트: ", token);
    // console.log("디버그 테스트 출력: ", rt_promise);

    return rt_promise;
  }

  private async getDefinitions(document: TextDocument, position: Position) {
    const range = document.getWordRangeAtPosition(position, this.wordRange);
    const styles = await this.getStyles(document);
    const selector = document.getText(range);
    const locations: Location[] = [];

    for (const entry of styles) {
      if (!this.isRemote.test(entry[0])) {
        entry[1]
          .filter((style) => style.selector === selector)
          .forEach((style) =>
            locations.push(
              new Location(
                Uri.parse(entry[0]),
                new Position(style.line, style.col)
              )
            )
          );
      }
    }
    return locations;
  }

  provideDefinition(
    document: TextDocument,
    position: Position,
    token: CancellationToken
  ): ProviderResult<Definition | LocationLink[]> {
    const range = new Range(start, position);
    const text = document.getText(range);
    const match = this.canComplete.exec(text);

    return new Promise((resolve, reject) =>
      match && !token.isCancellationRequested
        ? resolve(this.getDefinitions(document, position))
        : reject()
    );
  }

  async validate(document: TextDocument) {
    const findSelector = /([^(\[{}\])\s]+)(?![^(\[{]*[}\])])/gi;
    const findAttribute = /(class|className)\s*[=:]\s*(["'])(.*?)\2/gis;
    const diagnostics: Diagnostic[] = [];
    const map = await this.getCompletionMap(document, StyleType.CLASS);
    const text = document.getText();

    let attribute, offset, value, anchor, end, start;

    while ((attribute = findAttribute.exec(text))) {
      offset =
        findAttribute.lastIndex -
        attribute[3].length +
        attribute[3].indexOf(attribute[2]);

      while ((value = findSelector.exec(attribute[3]))) {
        if (!map.has(value[1])) {
          anchor = findSelector.lastIndex + offset;
          end = document.positionAt(anchor);
          start = document.positionAt(anchor - value[1].length);

          diagnostics.push(
            new Diagnostic(
              new Range(start, end),
              `CSS selector '${value[1]}' not found.`,
              DiagnosticSeverity.Warning
            )
          );
        }
      }
    }
    return diagnostics;
  }
}

export function clear() {
  window.showInformationMessage(`Style sheets cache cleared: ${cache.size}`);
  cache.clear();
}

export function invalidate(name: string) {
  cache.delete(name);
}
