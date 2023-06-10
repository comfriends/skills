import { useEffect, useMemo, useState } from "react";

import classNames from "classnames/bind";
import _ from "lodash";

import styles from "assets/css/default.module.scss";
import ic_tree_arrow_down from "assets/images/ic_tree_arrow_down.svg";
import ic_tree_arrow_up from "assets/images/ic_tree_arrow_up.svg";
import {
  DUAL_LISTBOX_CHECK_FULL_SELECT,
  DUAL_LISTBOX_CHECK_NON_SELECT,
  DUAL_LISTBOX_CHECK_SOME_SELECT,
  DualListboxDataProps,
  DualListboxProps,
} from "stores/type";

const cx = classNames.bind(styles);

const DualListbox = ({ primaryData, secondaryData }: DualListboxProps) => {
  const TYPE_TO_PRIMARY = 0;
  const TYPE_TO_SECONDARY = 1;

  const [primaryMock, setPrimaryMock] =
    useState<DualListboxDataProps[]>(primaryData);
  const [secondaryMock, setSecondaryMock] =
    useState<DualListboxDataProps[]>(secondaryData);
  const [move, setMove] = useState<boolean | null>(null);

  const recursionVisible = (
    mock: Array<DualListboxDataProps>,
    name: string
  ): Array<DualListboxDataProps> => {
    const findIdx = _.findIndex(mock, { name: name });
    if (findIdx === -1) {
      mock.forEach((element) => {
        recursionVisible(element.child, name);
      });
    } else {
      mock[findIdx].visible = !mock[findIdx].visible;
      return mock;
    }
    return mock;
  };
  const recursionCheck = (
    mock: Array<DualListboxDataProps>,
    name: string,
    value: number,
    include: boolean
  ): { mock: Array<DualListboxDataProps>; checkType: number } => {
    const findIdx = _.findIndex(mock, { name: name });

    let checkCnt = 0;
    for (let i = 0; i < mock.length; i++) {
      const element = mock[i];
      if (include || findIdx === i) {
        if (element.child.length > 0) {
          recursionCheck(element.child, name, value, true);
        }
        element.checkType = value;
      } else {
        if (element.child.length > 0) {
          const result = recursionCheck(element.child, name, value, false);
          element.checkType = result.checkType;
        }
      }
      if (element.checkType === DUAL_LISTBOX_CHECK_FULL_SELECT) {
        checkCnt++;
      } else if (element.checkType === DUAL_LISTBOX_CHECK_SOME_SELECT) {
        checkCnt += 0.5;
      }
    }
    return {
      mock: mock,
      checkType:
        checkCnt === mock.length && mock.length > 0
          ? DUAL_LISTBOX_CHECK_FULL_SELECT
          : checkCnt === 0
          ? DUAL_LISTBOX_CHECK_NON_SELECT
          : DUAL_LISTBOX_CHECK_SOME_SELECT,
    };
  };
  const handleTreeVisible = ({ type, data }: ItemProps) => {
    if (data.child.length === 0) return;
    if (type === TYPE_TO_PRIMARY) {
      const tmpMock = recursionVisible(primaryMock, data.name);
      setPrimaryMock([...tmpMock]);
    } else {
      const tmpMock = recursionVisible(secondaryMock, data.name);
      setSecondaryMock([...tmpMock]);
    }
  };
  const handleTreeCheck = ({ type, data }: ItemProps) => {
    if (type === TYPE_TO_PRIMARY) {
      const tmpMock = recursionCheck(
        primaryMock,
        data.name,
        data.checkType === DUAL_LISTBOX_CHECK_NON_SELECT
          ? DUAL_LISTBOX_CHECK_FULL_SELECT
          : DUAL_LISTBOX_CHECK_NON_SELECT,
        false
      ).mock;
      setPrimaryMock([...tmpMock]);
    } else {
      const tmpMock = recursionCheck(
        secondaryMock,
        data.name,
        data.checkType === DUAL_LISTBOX_CHECK_NON_SELECT
          ? DUAL_LISTBOX_CHECK_FULL_SELECT
          : DUAL_LISTBOX_CHECK_NON_SELECT,
        false
      ).mock;
      setSecondaryMock([...tmpMock]);
    }
  };
  const handleCheckTypeTarget = (target: DualListboxDataProps[]) => {
    const tmp = _.filter(target, {
      checkType: DUAL_LISTBOX_CHECK_FULL_SELECT,
    });

    if (tmp.length === target.length) {
      return DUAL_LISTBOX_CHECK_FULL_SELECT;
    } else {
      return DUAL_LISTBOX_CHECK_SOME_SELECT;
    }
  };
  const handleCheckTypeSource = (source: DualListboxDataProps[]) => {
    const tmp = _.filter(source, {
      checkType: DUAL_LISTBOX_CHECK_NON_SELECT,
    });
    if (tmp.length === source.length) {
      return DUAL_LISTBOX_CHECK_NON_SELECT;
    } else {
      return DUAL_LISTBOX_CHECK_SOME_SELECT;
    }
  };
  const sourcePop = (source: DualListboxDataProps[]) => {
    const popData: DualListboxDataProps[] = [];
    source.forEach((element) => {
      if (element.child.length === 0) {
        //leaf
        if (element.checkType === DUAL_LISTBOX_CHECK_FULL_SELECT) {
          popData.push(element);
        }
      } else {
        const result = sourcePop(element.child);
        element.child = _.xorBy(element.child, result.popData, "name");

        if (element.child.length === 0) {
          //해당 element 제거...
          popData.push(element);
        } else {
          element.checkType = handleCheckTypeSource(element.child);
        }
      }
    });
    return { popData: popData, source: source };
  };
  const combineData = (
    target: DualListboxDataProps[],
    source: DualListboxDataProps[]
  ) => {
    const targetAdd = (
      target: DualListboxDataProps[],
      source: DualListboxDataProps[]
    ) => {
      const newChild: DualListboxDataProps[] = [];
      source.forEach((element) => {
        const k = _.findIndex(target, { name: element.name });
        if (element.child.length > 0) {
          if (element.checkType !== DUAL_LISTBOX_CHECK_NON_SELECT) {
            if (k === -1) {
              //부모를 만든다
              target.push({
                name: element.name,
                visible: true,
                checkType: DUAL_LISTBOX_CHECK_FULL_SELECT,
                child: [],
              });
              const result = targetAdd(
                target[target.length - 1].child,
                element.child
              );
              target[target.length - 1].child = [
                ...result.target,
                ...result.newChild,
              ];
            } else {
              const result = targetAdd(target[k].child, element.child);
              target[k].child = [...target[k].child, ...result.newChild];
              target[k].checkType = handleCheckTypeTarget(target[k].child);
            }
          }
        } else {
          //leaf
          if (element.checkType === DUAL_LISTBOX_CHECK_FULL_SELECT) {
            newChild.push(element);
          }
        }
      });

      return { newChild: newChild, target: target };
    };
    const newTarget = targetAdd(target, source).target;
    let newSource = sourcePop(source).source;
    newSource = newSource.filter((element) => element.child.length > 0);
    return { target: newTarget, source: newSource };
  };
  const handleMoveData = (type: number) => {
    if (type === TYPE_TO_PRIMARY) {
      const tmp = _.cloneDeep(primaryMock);
      const result = combineData(tmp, secondaryMock);
      setPrimaryMock(result.target);
      setSecondaryMock(result.source);
    } else {
      const tmp = _.cloneDeep(secondaryMock);
      const result = combineData(tmp, primaryMock);
      setSecondaryMock(result.target);
      setPrimaryMock(result.source);
    }
    if (move === null) {
      setMove(true);
    } else {
      setMove(!move);
    }
  };
  const handleScrollBox = (type: string) => {
    const scroll_box = document.getElementById(type) as HTMLElement;
    if (scroll_box) {
      scroll_box.scrollTop = scroll_box.scrollHeight;
    }
  };

  //use effect
  useEffect(() => {
    if (move === null) return;
    handleScrollBox("primary_scroll_box");
  }, [primaryMock && move]);
  useEffect(() => {
    if (move === null) return;
    handleScrollBox("secondary_scroll_box");
  }, [secondaryMock && move]);

  //component
  interface ListProps {
    data: Array<DualListboxDataProps>;
    depth: number;
    type: number;
  }
  interface ItemProps {
    data: DualListboxDataProps;
    depth: number;
    type: number;
    idx: number;
  }
  const List = ({ data, depth, type }: ListProps) => {
    return (
      <>
        {data?.map((item, i) => (
          <div key={i}>
            <Item data={item} depth={depth} idx={i} type={type} />
          </div>
        ))}
      </>
    );
  };
  const Item = ({ data, depth, idx, type }: ItemProps) => {
    return (
      <div className={cx("dual_listbox_row")}>
        <div
          className={
            data.checkType !== DUAL_LISTBOX_CHECK_NON_SELECT
              ? cx(
                  "item",
                  type === TYPE_TO_PRIMARY ? "primary" : "secondary",
                  depth === 0 ? "title" : ""
                )
              : cx("item", depth === 0 ? "title" : "")
          }
          style={{ paddingLeft: `${20 + depth * 22}px` }}
        >
          {data.visible ? (
            <img
              src={ic_tree_arrow_down}
              alt="ic_tree_arrow_down"
              onClick={() => handleTreeVisible({ type, data, depth, idx })}
            />
          ) : (
            <img
              src={ic_tree_arrow_up}
              alt="ic_tree_arrow_up"
              onClick={() => handleTreeVisible({ type, data, depth, idx })}
            />
          )}

          <div className={cx("chk_label")}>
            <input
              type="checkbox"
              checked={data.checkType > DUAL_LISTBOX_CHECK_NON_SELECT}
              className={
                data.checkType === DUAL_LISTBOX_CHECK_SOME_SELECT
                  ? cx("some_select")
                  : ``
              }
              onChange={() => handleTreeCheck({ type, data, depth, idx })}
            />
          </div>
          {data.name}
        </div>
        {data.visible ? (
          <List data={data.child ?? []} depth={depth + 1} type={type} />
        ) : null}
      </div>
    );
  };
  const Description = useMemo(() => {
    return (
      <div className={cx("description")}>
        <div>
          <h2>Function</h2>
          <ul>
            <li>데이터 이동</li>
            <li>전체 선택, 일부 선택 구분</li>
            <li>데이터 이동시 스크롤 하단으로 자동 이동</li>
          </ul>
        </div>
        <div>
          <h2>How</h2>
          <ul>
            <li>재귀 호출을 통해 트리 구조 데이터 조작</li>
          </ul>
        </div>
      </div>
    );
  }, []);

  return (
    <div className={cx("dual_listbox_container", "inner")}>
      <h1>Dual Listbox: 트리 구조</h1>
      <div className={cx("dual_listbox")}>
        <div className={cx("scroll_box", "pane")} id="primary_scroll_box">
          <List data={primaryMock} depth={0} type={TYPE_TO_PRIMARY} />
        </div>
        <div className={cx("dual_listbox_btns")}>
          <p
            className={cx("arrow_left")}
            onClick={() => handleMoveData(TYPE_TO_PRIMARY)}
          ></p>
          <p
            className={cx("arrow_right")}
            onClick={() => handleMoveData(TYPE_TO_SECONDARY)}
          ></p>
        </div>
        <div className={cx("scroll_box", "pane")} id="secondary_scroll_box">
          <List data={secondaryMock} depth={0} type={TYPE_TO_SECONDARY} />
        </div>
      </div>
      {Description}
    </div>
  );
};

export default DualListbox;
