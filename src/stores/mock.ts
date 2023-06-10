import { DUAL_LISTBOX_CHECK_NON_SELECT, GridTableDataProps } from "stores/type";

const GridTableData: Array<GridTableDataProps> = [];
GridTableData.push({
  num: "연번",
  name: "이름",
  activityName: "활동명",
  year: "출생연도",
  position: "포지션",
  army: "군필여부",
});
for (let i = 0; i < 10000; i++) {
  GridTableData.push({
    num: "",
    name: "김남준",
    activityName: "RM",
    year: "1994",
    position: "리더, 메인래퍼",
    army: "미필",
  });
  GridTableData.push({
    num: "",
    name: "김석진",
    activityName: "진",
    year: "1992",
    position: "서브보컬",
    army: "군필",
  });
  GridTableData.push({
    num: "",
    name: "민윤기",
    activityName: "슈가",
    year: "1993",
    position: "리드래퍼",
    army: "미필",
  });
  GridTableData.push({
    num: "",
    name: "정호석",
    activityName: "제이홉",
    year: "1994",
    position: "메인댄서, 서브래퍼",
    army: "군필",
  });
  GridTableData.push({
    num: "",
    name: "박지민",
    activityName: "지민",
    year: "1995",
    position: "메인댄서, 리드보컬",
    army: "미필",
  });
  GridTableData.push({
    num: "",
    name: "김태형",
    activityName: "뷔",
    year: "1995",
    position: "서브보컬",
    army: "미필",
  });
  GridTableData.push({
    num: "",
    name: "전정국",
    activityName: "정국",
    year: "1997",
    position: "메인보컬, 리드댄서, 서브래퍼",
    army: "미필",
  });
}

const primary = [
  {
    name: "국내증시",
    visible: true,
    checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
    child: [
      {
        name: "화장품",
        visible: true,
        checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
        child: [
          {
            name: "현대바이오",
            visible: false,
            checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
            child: [],
          },
          {
            name: "마녀공장",
            visible: false,
            checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
            child: [],
          },
          {
            name: "엔에프씨",
            visible: false,
            checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
            child: [],
          },
        ],
      },
      {
        name: "반도체와 반도체장비",
        visible: true,
        checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
        child: [
          {
            name: "한국전자홀딩스",
            visible: false,
            checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
            child: [],
          },
          {
            name: "타이거일렉",
            visible: false,
            checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
            child: [],
          },
          {
            name: "이오테크닉스",
            visible: false,
            checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
            child: [],
          },
          {
            name: "SK하이닉스",
            visible: false,
            checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
            child: [],
          },
        ],
      },
    ],
  },
  {
    name: "해외증시",
    visible: true,
    checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
    child: [
      {
        name: "미국",
        visible: true,
        checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
        child: [
          {
            name: "다우 산업",
            visible: false,
            checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
            child: [],
          },
          {
            name: "다우 운송",
            visible: false,
            checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
            child: [],
          },
          {
            name: "나스닥 종합",
            visible: false,
            checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
            child: [],
          },
        ],
      },
      {
        name: "중국",
        visible: true,
        checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
        child: [
          {
            name: "상해종합",
            visible: false,
            checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
            child: [],
          },
          {
            name: "상해 A",
            visible: false,
            checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
            child: [],
          },
          {
            name: "상해 B",
            visible: false,
            checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
            child: [],
          },
        ],
      },
    ],
  },
];
const secondary = [
  {
    name: "국내증시",
    visible: true,
    checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
    child: [
      {
        name: "화장품",
        visible: true,
        checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
        child: [
          {
            name: "코스나인",
            visible: false,
            checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
            child: [],
          },
          {
            name: "아모레퍼시픽",
            visible: false,
            checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
            child: [],
          },
          {
            name: "클리오",
            visible: false,
            checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
            child: [],
          },
        ],
      },
      {
        name: "반도체와 반도체장비",
        visible: true,
        checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
        child: [
          {
            name: "하나마이크론",
            visible: false,
            checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
            child: [],
          },
          {
            name: "미래산업",
            visible: false,
            checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
            child: [],
          },
          {
            name: "미래반도체",
            visible: false,
            checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
            child: [],
          },
        ],
      },
    ],
  },
  {
    name: "해외증시",
    visible: true,
    checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
    child: [
      {
        name: "미국",
        visible: true,
        checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
        child: [
          {
            name: "나스닥 100",
            visible: false,
            checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
            child: [],
          },
          {
            name: "S&P 500",
            visible: false,
            checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
            child: [],
          },
          {
            name: "필라델피아 반도체",
            visible: false,
            checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
            child: [],
          },
        ],
      },
      {
        name: "홍콩",
        visible: true,
        checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
        child: [
          {
            name: "항셍",
            visible: false,
            checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
            child: [],
          },
          {
            name: "항셍 차이나기업(H)",
            visible: false,
            checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
            child: [],
          },
          {
            name: "항셍 차이나대기업(R)",
            visible: false,
            checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
            child: [],
          },
        ],
      },
    ],
  },
];

const DualListBoxData = {
  primary: primary,
  secondary: secondary,
};
const mock = {
  GridTableData,
  DualListBoxData,
};

export { mock };
