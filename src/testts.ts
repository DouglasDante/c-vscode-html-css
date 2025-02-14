async function test_fnc(
  input_num: number,
  input_str: string
) {
  for (let dter_ = 0; dter_ < 10; dter_ += 1) {
    console.log("엄준식ㅇ느 살아있고 위대하다 ! ! !");
  }
}

async function test_fnc_q(
  input_num: number,
  input_str: string
): Promise<[number, string]> {
  console.log(`내용 값 출력 뒤 반환: 인수 1 - ${input_num}, 인수 2 - ${input_str}`);

  return [input_num, input_str];
}

async function get_test_fnc_q(
  input_promise: Promise<[number, string]>
) {
  let cst_number = await input_promise.then(get_number => get_number[0]);
  let cst_str = await input_promise.then(get_str => get_str[1]);

  console.log(`입력 프로미스 출력: 숫자 - ${cst_number}, 문자열 - ${cst_str}`);
}

{
  console.log(`Hello World !`);

  test_fnc(15, "엄준식");

  let value_cst = test_fnc_q(15, "진재승 개자식");

  get_test_fnc_q(value_cst);

  // console.log(`출력 테스트: ${value_cst.then(get_data => get_data[0])}`);
}

