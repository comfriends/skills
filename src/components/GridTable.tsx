import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AutoSizer, MultiGrid } from "react-virtualized";

import classNames from "classnames/bind";
import _, { set } from "lodash";

import Loader from "components/Loader";

import "react-virtualized/styles.css";
import styles from "assets/css/default.module.scss";
import ic_check_black from "assets/images/ic_check_black.svg";
import ic_line_table_splitter from "assets/images/ic_line_table_splitter.svg";
import ic_pencil_fill from "assets/images/ic_pencil_fill.svg";
import ic_table_in_drop_down from "assets/images/ic_table_in_drop_down.svg";
import ic_table_in_drop_up from "assets/images/ic_table_in_drop_up.svg";
import ic_vector_unfold from "assets/images/ic_vector_unfold.svg";
import { GridTableProps } from "stores/type";
const cx = classNames.bind(styles);

const GridTable = ({ data, dropDownData }: GridTableProps) => {
  interface THeadActiveProps {
    [key: string]: boolean;
  }
  interface THeadInfoProps {
    [key: string]: {
      maxWidth: number;
      existFold: boolean;
    };
  }
  interface TBodyProps {
    [key: string]: string;
  }
  interface OverflowCheckProps {
    [key: string]: boolean;
  }
  interface TRowProps {
    edit: number;
    rowFocused: boolean;
    row: number[];
    colFocused: boolean;
    col: string;
  }
  interface SelectBoxProps {
    idx: number;
    property: string;
    isOpened: boolean;
  }
  const gridWidth = 998;
  const gridHeight = 550;
  const numWidth = 62; //연번
  const fixedWidth = 46 + 36; //수정(연필) + 체크박스
  const spanSpaceWidth = 24; //border 포함
  const inputSpaceWidth = 8; //border 포함
  const rowHeight = 36;
  const multigridRef = useRef<MultiGrid | null>(null);

  const [tHeadClickUnfold, setTHeadClickUnfold] = useState<THeadActiveProps>(
    {}
  );
  const [tBodyData, setTBodyData] = useState<Array<TBodyProps>>([]);
  const [cellOverflowCheck, setCellOverflowCheck] = useState<
    Array<OverflowCheckProps>
  >([]);
  //thead info
  const [tHeadInfo, setTHeadInfo] = useState<THeadInfoProps>({});
  const [tableStatus, setTableStatus] = useState<TRowProps>({
    edit: -1,
    rowFocused: false,
    row: [],
    colFocused: false,
    col: "",
  });
  const [scrollBoxWidth, setScrollBoxWidth] = useState({
    cell: 0,
    total: 0,
  });
  const [isDelete, setIsDelete] = useState(false);
  const [isOpenSelectBox, setIsOpenSelectBox] = useState<SelectBoxProps>({
    idx: -1,
    property: "",
    isOpened: false,
  });
  const [isScrollY, setIsScrollY] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleControllGrid = (type: string, width: number, id?: string) => {
    // console.log("handleControllGrid", type);
    const multigrid = document.querySelector("#multigrid");
    if (multigrid) {
      const headElement = multigrid.parentElement as HTMLElement;
      const headChildElement = headElement.lastElementChild as HTMLElement;
      const headScrollBoxElement =
        headChildElement.lastElementChild as HTMLElement;

      const parentElement = headElement.parentElement as HTMLElement;
      const bodyElement = parentElement.lastElementChild as HTMLElement;
      const bodyChildElement = bodyElement.lastElementChild as HTMLElement;
      const bodyScrollBoxElement =
        bodyChildElement.lastElementChild as HTMLElement;

      headChildElement.style.borderBottom = `1px solid #dddddd`;

      if (type === "fold") {
        headScrollBoxElement.style.width = `${width}px`;
        headScrollBoxElement.style.maxWidth = `${width}px`;
        bodyScrollBoxElement.style.width = `${width}px`;
        bodyScrollBoxElement.style.maxWidth = `${width}px`;
      } else if (type === "unfold") {
        bodyChildElement.style.overflowX = "auto";
      } else if (type === "yScrollAuto") {
        bodyChildElement.scrollTop = bodyChildElement.scrollHeight;
      } else if (type === "selectBox") {
        const selectBox = document.querySelector(`#${id}`) as HTMLElement;
        const selectBoxParentElement = selectBox.parentElement?.parentElement
          ?.parentElement?.parentElement as HTMLElement;

        if (selectBoxParentElement) {
          if (
            bodyChildElement.offsetHeight <
            Math.abs(
              bodyChildElement.scrollTop - selectBoxParentElement.offsetTop
            ) +
              selectBox.offsetHeight +
              rowHeight
          ) {
            const calc = selectBox.offsetHeight + 4; //margin
            selectBox.style.top = `-${calc}px`;
          }

          const scrollWidth = isScrollY ? 20 : 0;
          if (
            bodyChildElement.offsetWidth <
            selectBoxParentElement.offsetLeft +
              selectBox.offsetWidth +
              scrollWidth
          ) {
            selectBox.style.left = "auto";
            selectBox.style.right = `0`;
          }
        }
        return;
      }

      if (width === gridWidth - fixedWidth) {
        bodyChildElement.scrollLeft = 0;
        bodyChildElement.style.overflowX = "hidden";
      }

      if (bodyScrollBoxElement.scrollHeight > gridHeight - rowHeight) {
        setIsScrollY(true);
      } else {
        setIsScrollY(false);
      }

      if (multigridRef.current) {
        multigridRef.current.recomputeGridSize();
      }
    }
  };
  const handleUnfold = (e: React.MouseEvent, property: string) => {
    e.stopPropagation();
    //수정중
    if (tableStatus.edit !== -1) {
      return;
    }
    const tmpHeadClickUnfold = _.cloneDeep(tHeadClickUnfold);
    tmpHeadClickUnfold[property] = !tmpHeadClickUnfold[property];
    setTHeadClickUnfold(tmpHeadClickUnfold);
  };
  const handleAllUnfold = () => {
    //모두 펼친다
    if (tBodyData.length === 0) return;
    const tmpTHeadClickUnfold = { ...tHeadClickUnfold };

    for (const property in tBodyData[0]) {
      tmpTHeadClickUnfold[property] = true;
    }
    setTHeadClickUnfold(tmpTHeadClickUnfold);
  };
  const handleClickPencil = (index: number) => {
    setTableStatus({
      ...tableStatus,
      edit: index === tableStatus.edit ? -1 : index,
    });
    if (index !== tableStatus.edit) {
      handleAllUnfold();
    }
  };
  const handleBlur = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    property: string
  ) => {
    const { value } = e.target;
    if (value === tBodyData[index][property]) {
      return;
    }
    // //new data
    const tmpTBodyData = [...tBodyData];
    tmpTBodyData[index][property] = value;
    setTBodyData(tmpTBodyData);

    const tmpHeadInfo = _.cloneDeep(tHeadInfo);
    const element = document.getElementById("input_" + index + "_" + property);
    if (element) {
      const tmpMax =
        element.offsetWidth > element.scrollWidth
          ? element.offsetWidth
          : element.scrollWidth;
      if (tmpHeadInfo[property]["maxWidth"] - inputSpaceWidth < tmpMax) {
        tmpHeadInfo[property]["maxWidth"] = tmpMax + inputSpaceWidth;
      }
      const tmpWidth = property === "num" ? numWidth : scrollBoxWidth.cell;
      if (tmpMax > tmpWidth) {
        const tmpFoldCheck = [...cellOverflowCheck];
        tmpFoldCheck[index][property] = true;

        setCellOverflowCheck(tmpFoldCheck);
        if (!tHeadInfo[property]["existFold"]) {
          tmpHeadInfo[property]["existFold"] = true;
        }
      }

      if (multigridRef.current) {
        multigridRef.current.recomputeGridSize();
      }
    }

    setTableStatus({
      ...tableStatus,
      edit: -1,
    });

    if (JSON.stringify(tmpHeadInfo) !== JSON.stringify(tHeadInfo)) {
      setTHeadInfo(tmpHeadInfo);
    }
  };
  const handleRowFocused = (index: number) => {
    const arr = [...tableStatus.row];
    const k = arr.indexOf(index);
    if (k > -1) {
      //exist
      arr.splice(k, 1);
      if (tBodyData.length === arr.length + 1 && arr.includes(0)) {
        const zero = arr.indexOf(0);
        arr.splice(zero, 1);
      }
      setTableStatus({
        ...tableStatus,
        rowFocused: arr.length === 0 ? false : true,
        colFocused: false,
        row: arr,
      });
    } else {
      arr.push(index);
      if (Math.abs(tBodyData.length - arr.length) === 1 && !arr.includes(0)) {
        arr.push(0);
      }
      setTableStatus({
        ...tableStatus,
        rowFocused: arr.length === 0 ? false : true,
        colFocused: false,
        row: arr,
      });
    }
  };
  const handleAllRowFocused = () => {
    if (tableStatus.row.length === tBodyData.length) {
      setTableStatus({
        ...tableStatus,
        rowFocused: false,
        row: [],
      });
    } else {
      const arr = [];
      for (let i = 0; i < tBodyData.length; i++) {
        arr.push(i);
      }
      setTableStatus({
        ...tableStatus,
        rowFocused: true,
        colFocused: false,
        row: arr,
      });
    }
  };
  const handlePopOver = () => {
    setIsDelete(true);
  };
  const handleDeleteRow = () => {
    const tmpTBodyData = [...tBodyData];
    const tmpFoldCheck = [...cellOverflowCheck];
    if (tableStatus.row.length === tBodyData.length) {
      setTBodyData([tBodyData[0]]);
      setCellOverflowCheck([]);
    } else {
      tableStatus.row.forEach((element) => {
        tmpTBodyData.splice(element, 1);
        tmpFoldCheck.splice(element, 1);
      });
      setTBodyData(tmpTBodyData);
      setCellOverflowCheck(tmpFoldCheck);
    }

    setTableStatus({
      ...tableStatus,
      edit: -1,
      rowFocused: false,
      colFocused: false,
      row: [],
    });
    setIsDelete(false);
  };
  const handleAddRow = () => {
    const tmpTBodyData = [...tBodyData];
    const tmpCellOverflowCheck = [...cellOverflowCheck];
    const tmpObj: TBodyProps = {};
    const tmpOverflowCheck: OverflowCheckProps = {};
    if (tBodyData.length === 0) return;
    for (const property in tBodyData[0]) {
      tmpObj[property] =
        property === "ipsiYear" || property === "ipsiGubun"
          ? tBodyData[0][property]
          : "";
      tmpOverflowCheck[property] = false;
    }

    tmpTBodyData.push(tmpObj);
    setTBodyData(tmpTBodyData);
    tmpCellOverflowCheck.push(tmpOverflowCheck);
    setCellOverflowCheck(tmpCellOverflowCheck);

    setTableStatus({
      ...tableStatus,
      edit: tmpTBodyData.length - 1,
    });

    handleAllUnfold();
    handleControllGrid("yScrollAuto", -1);
  };
  const handleOpenSelectBox = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    property: string
  ) => {
    e.stopPropagation();
    if (
      index === isOpenSelectBox.idx &&
      property === isOpenSelectBox.property
    ) {
      setIsOpenSelectBox({
        idx: index,
        isOpened: !isOpenSelectBox.isOpened,
        property: property,
      });
    } else {
      setIsOpenSelectBox({ idx: index, isOpened: true, property: property });
    }
  };
  const handleSetSelectBox = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    property: string,
    item: string
  ) => {
    e.stopPropagation();
    const tmpTBodyData = [...tBodyData];
    tmpTBodyData[index][property] = item;
    setTBodyData(tmpTBodyData);
    setIsOpenSelectBox({ idx: index, isOpened: false, property: property });
  };
  const handleCheckCellWidth = (property: string) => {
    return tHeadClickUnfold[property] && tHeadInfo[property]
      ? tHeadInfo[property]["maxWidth"]
      : property === "num"
      ? numWidth
      : scrollBoxWidth.cell;
  };
  const handleUpdateCellMaxWidth = () => {
    if (tBodyData.length > 0) {
      const tmpHeadInfo = _.cloneDeep(tHeadInfo);
      const tmpFoldCheck = _.cloneDeep(cellOverflowCheck);

      if (cellOverflowCheck.length === 0) {
        for (let index = 0; index < tBodyData.length; index++) {
          const tmpObj: OverflowCheckProps = {};
          for (const property in data[index]) {
            tmpObj[property] = false;
          }
          tmpFoldCheck.push(tmpObj);
        }
        setCellOverflowCheck(tmpFoldCheck);
      }

      for (let index = 0; index < tBodyData.length; index++) {
        for (const property in tBodyData[index]) {
          const element = document.getElementById(
            "span_" + index + "_" + property
          );
          if (element) {
            const tmpWidth =
              property === "num" ? numWidth : scrollBoxWidth.cell;
            if (tmpWidth < element.offsetWidth + spanSpaceWidth) {
              tmpFoldCheck[index][property] = true;
              if (!tmpHeadInfo[property]["existFold"]) {
                tmpHeadInfo[property]["existFold"] = true;
              }
            }
            if (
              tmpHeadInfo[property]["maxWidth"] <
              element.offsetWidth + spanSpaceWidth
            ) {
              tmpHeadInfo[property]["maxWidth"] =
                element.offsetWidth + spanSpaceWidth;
            }
          }
        }
      }

      if (JSON.stringify(tmpFoldCheck) !== JSON.stringify(cellOverflowCheck)) {
        setCellOverflowCheck(tmpFoldCheck);
      }
      if (JSON.stringify(tmpHeadInfo) !== JSON.stringify(tHeadInfo)) {
        setTHeadInfo(tmpHeadInfo);
      }
      if (tableStatus.edit === tBodyData.length - 1) {
        handleControllGrid("yScrollAuto", -1);
      } else {
        //y scroll 존재 확인
        handleControllGrid("", -1);
      }
    }
  };

  /////////
  useEffect(() => {
    if (isOpenSelectBox.isOpened) {
      handleControllGrid(
        "selectBox",
        -1,
        `selectbox_${isOpenSelectBox.idx}_${isOpenSelectBox.property}`
      );
    }
  }, [isOpenSelectBox]);
  useEffect(() => {
    // console.log("tHeadInfo", tHeadInfo);
    if (tBodyData.length === 0) return;
    let tmpTotal = 0;
    for (const property in tBodyData[0]) {
      tmpTotal += handleCheckCellWidth(property);
    }
    tmpTotal = Math.round(tmpTotal);
    setScrollBoxWidth({ ...scrollBoxWidth, total: tmpTotal });
  }, [tHeadInfo]);
  useEffect(() => {
    if (tBodyData.length === 0) return;
    // console.log("tHeadClickUnfold", tHeadClickUnfold);
    let tmpTotal = 0;
    let checkUnfold = false;
    for (const property in tBodyData[0]) {
      tmpTotal += handleCheckCellWidth(property);
      if (tHeadClickUnfold[property]) {
        checkUnfold = true;
      }
    }
    tmpTotal = Math.round(tmpTotal);
    if (checkUnfold) {
      handleControllGrid("unfold", tmpTotal);
    } else {
      handleControllGrid("fold", tmpTotal);
    }
    setScrollBoxWidth({ ...scrollBoxWidth, total: tmpTotal });
  }, [tHeadClickUnfold]);
  useEffect(() => {
    if (data.length === 0) return;

    //너비
    let cellWidth = 0; //열 개수만큼 비율
    cellWidth =
      (gridWidth - fixedWidth - numWidth) / (Object.keys(data[0]).length - 1);
    setScrollBoxWidth({ cell: cellWidth, total: gridWidth - fixedWidth });

    const tmpTHeadClickUnfold: THeadActiveProps = {};
    const tmpHeadInfo: THeadInfoProps = {};

    for (const property in data[0]) {
      tmpHeadInfo[property] = {
        maxWidth: property === "num" ? numWidth : cellWidth,
        existFold: false,
      };
      tmpTHeadClickUnfold[property] = false;
    }
    setTHeadClickUnfold(tmpTHeadClickUnfold);
    setTHeadInfo(tmpHeadInfo);
    setTBodyData(data);
    setLoading(false);
  }, []);
  window.onload = () => {
    handleUpdateCellMaxWidth();
    handleControllGrid("", gridWidth - fixedWidth);
  };

  ///////component
  const TFoot = useMemo(() => {
    return (
      <div className={cx("grid_table_tfoot")}>
        <div className={cx("info")}>
          {tBodyData.length === tableStatus.row.length
            ? `전체 선택됨.`
            : tableStatus.rowFocused && tableStatus.row.length > 0
            ? `${tBodyData.length - 1}건 중 ${tableStatus.row.length}건 선택됨.`
            : `${tBodyData.length - 1}건`}
        </div>
        <p className={cx("excel_download")}></p>
        <div className={cx("btns-area")}>
          <p className={cx("add")} onClick={handleAddRow}></p>
          <p className={cx("trashcan")} onClick={handlePopOver}></p>
        </div>
      </div>
    );
  }, [tBodyData, tableStatus, cellOverflowCheck]);
  const Description = useMemo(() => {
    return (
      <div className={cx("description")}>
        <div>
          <h2>Function</h2>
          <ul>
            <li>가로 스크롤시 왼쪽 열 고정</li>
            <li>
              테이블 행을 호버했을 때, [&nbsp;
              <img src={ic_pencil_fill} alt="ic_pencil_fill" />
              &nbsp;] 아이콘 나타남 - 아이콘 클릭시 행 편집 가능
            </li>
            <li>
              [ &nbsp;
              <img
                src={ic_vector_unfold}
                alt="ic_vector_unfold"
                className={cx("unfold")}
              />
              &nbsp;] 행의 내용이 패딩 값보다 긴 상태의 열임 (잘림 상태일 때
              테이블 헤드 우측 하단에 세모 표시가 나타남)
            </li>
            <li>
              헤드 영역 클릭시, 풀 텍스트를 조회할 수 있도록 펼쳐짐. 잘림 상태의
              행은 말 줄임표(...)를 표시함
            </li>
            <li>
              드롭다운 리스트가 테이블을 감싸는 박스보다 길어질 경우 드롭다운
              상단으로 나타남
            </li>
            <li>조회 건수와 행추가 및 행삭제</li>
          </ul>
        </div>
        <div>
          <h2>How</h2>
          <ul>
            <li>수만 건을 로드하기 위해 react-virtualized 라이브러리 사용</li>
            <li>열 고정을 위해 Table 대신 MultiGrid 사용</li>
            <li>줄임 기능을 위해 p 태그와 span 태그 사용</li>
          </ul>
        </div>
      </div>
    );
  }, []);
  const PopOver = () => {
    return (
      <div className={cx("popover")}>
        <p> [identifier] 모집단위를 삭제할까요?</p>
        <div className={cx("btns")}>
          <div className={cx("btn_small", "cancel")}>
            <span onClick={() => setIsDelete(false)}>취소</span>
          </div>
          <div className={cx("btn_small", "err")} onClick={handleDeleteRow}>
            확인
          </div>
        </div>
      </div>
    );
  };
  interface CellProps {
    type?: string;
    index: number;
    property: string;
    value: string;
  }
  const Cell = ({ index, property, value }: CellProps) => {
    return tableStatus["edit"] === index ? (
      <input
        type="text"
        id={`input_${index}_${property}`}
        className={cx(
          property === "num" ||
            property === "ipsiYear" ||
            property === "ipsiGubun"
            ? "disable"
            : ""
        )}
        defaultValue={property === "num" ? index : value}
        onBlur={(e) => handleBlur(e, index, property)}
        readOnly={
          property === "num" ||
          property === "ipsiYear" ||
          property === "ipsiGubun"
        }
      />
    ) : (
      <CellTxt type={"basic"} index={index} property={property} value={value} />
    );
  };
  const CellTxt = ({ type, index, property, value }: CellProps) => {
    return cellOverflowCheck[index] &&
      cellOverflowCheck[index][property] &&
      !tHeadClickUnfold[property] ? (
      // 말줄임
      <p
        className={cx({
          title: type === "drop",
        })}
      >
        {property === "num" ? (index === -1 ? "연번" : index) : value}
      </p>
    ) : (
      // 펼쳐짐
      <span
        id={`span_${index}_${property}`}
        className={cx({
          title: type === "drop",
          detail: type === "drop",
        })}
      >
        {property === "num" ? (index === -1 ? "연번" : index) : value}
      </span>
    );
  };
  const DropDown = ({ index, property, value }: CellProps) => {
    const chkOpen =
      isOpenSelectBox.isOpened &&
      index === isOpenSelectBox.idx &&
      property === isOpenSelectBox.property
        ? true
        : false;
    return (
      <div
        className={cx("dropdown")}
        onClick={(e) => handleOpenSelectBox(e, index, property)}
      >
        <div className={cx("select_box")}>
          <CellTxt
            type={"drop"}
            index={index}
            property={property}
            value={value}
          />
          {chkOpen ? (
            <img
              src={ic_table_in_drop_up}
              className={cx("arrow")}
              alt="ic_table_in_drop_up"
            />
          ) : (
            <img
              src={ic_table_in_drop_down}
              className={cx("arrow")}
              alt="ic_table_in_drop_down"
            />
          )}

          {chkOpen && (
            <div
              className={cx("options")}
              id={`selectbox_${index}_${property}`}
            >
              {dropDownData[property].map((item, i) => {
                return (
                  <div
                    className={cx("option-item")}
                    key={"gubun" + i}
                    onClick={(e) =>
                      handleSetSelectBox(e, index, property, item)
                    }
                  >
                    <span className={cx(value === item ? "select" : "")}>
                      {item}
                    </span>
                    {value === item && (
                      <img
                        src={ic_check_black}
                        alt="ic_check_black"
                        className={cx("img_select")}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={cx("grid_table_container", "inner")}>
      <h1>Grid Table: 수 만건을 로드하는 테이블</h1>
      {loading && <Loader />}
      <div className={cx("grid_table")}>
        {tBodyData.length > 0 && (
          <MultiGrid
            classNameBottomRightGrid={cx("scroll_box")}
            id={"multigrid"}
            ref={(ref) => (multigridRef.current = ref)}
            fixedColumnCount={1}
            fixedRowCount={1}
            height={gridHeight}
            width={gridWidth}
            columnCount={Object.keys(tBodyData[0]).length + 1} //pencil + checkbox 포함
            columnWidth={({ index }) => {
              // index에 따라 각 셀의 너비를 지정
              if (index === 0) {
                return fixedWidth;
              } else {
                const property = Object.keys(tBodyData[0])[index - 1];
                return handleCheckCellWidth(property);
              }
            }}
            rowHeight={rowHeight}
            rowCount={tBodyData.length}
            onSectionRendered={handleUpdateCellMaxWidth}
            cellRenderer={({ columnIndex, key, rowIndex, style }) => {
              if (tBodyData.length === 0 || rowIndex === tBodyData.length - 1) {
                // setLoading(false);
              }
              const property = Object.keys(tBodyData[0])[columnIndex - 1];

              return columnIndex === 0 ? (
                <div
                  className={cx("row", rowIndex === 0 ? "thead" : "tbody")}
                  style={style}
                  key={key}
                >
                  <div className={cx("pencil")}>
                    <img
                      src={ic_pencil_fill}
                      alt="ic_pencil_fill"
                      onClick={() => handleClickPencil(rowIndex)}
                    />
                  </div>
                  <div className={cx("chk")}>
                    <input
                      type="checkbox"
                      onChange={() => {
                        rowIndex === 0
                          ? handleAllRowFocused()
                          : handleRowFocused(rowIndex);
                      }}
                      checked={
                        rowIndex === 0
                          ? tableStatus.row.length === tBodyData.length
                          : tableStatus.rowFocused &&
                            tableStatus.row.includes(rowIndex)
                      }
                    />
                  </div>
                </div>
              ) : (
                <div
                  key={key}
                  style={{
                    ...style,
                    ...{
                      width: handleCheckCellWidth(property),
                    },
                  }}
                >
                  {rowIndex === 0 ? (
                    <div
                      key={`thead_${property}`}
                      className={cx(
                        "thead",
                        "cell",
                        tableStatus.colFocused && tableStatus.col == property
                          ? "col-focused"
                          : ""
                      )}
                      style={{
                        width: handleCheckCellWidth(property),
                      }}
                      onClick={(e) => handleUnfold(e, property)}
                    >
                      <CellTxt
                        type={"head"}
                        index={-1}
                        property={property}
                        value={data[0][property]}
                      />
                      {columnIndex ===
                      Object.keys(tBodyData[0]).length ? null : (
                        <img
                          src={ic_line_table_splitter}
                          alt="ic_line_table_splitter"
                          className={cx("splitter")}
                        />
                      )}

                      {tHeadInfo[property] &&
                      tHeadInfo[property]["existFold"] &&
                      !tHeadClickUnfold[property] ? (
                        <img
                          src={ic_vector_unfold}
                          alt="ic_vector_unfold"
                          className={cx("unfold")}
                          onClick={(e) => handleUnfold(e, property)}
                        />
                      ) : null}
                    </div>
                  ) : (
                    <div
                      key={`${rowIndex}_cell_${property}`}
                      className={cx(
                        "tbody",
                        "cell",
                        isScrollY &&
                          columnIndex === Object.keys(tBodyData[0]).length
                          ? "scroll"
                          : "",
                        tableStatus["edit"] === rowIndex ||
                          dropDownData[property]
                          ? "edit"
                          : "",
                        property === "num" ? "num" : "",
                        tableStatus.rowFocused &&
                          tableStatus.row.includes(rowIndex)
                          ? "row_focused"
                          : tableStatus.colFocused &&
                            tableStatus.col === property
                          ? "col_focused"
                          : ""
                      )}
                    >
                      {dropDownData[property] ? (
                        <DropDown
                          index={rowIndex}
                          property={property}
                          value={tBodyData[rowIndex][property]}
                        />
                      ) : (
                        <Cell
                          index={rowIndex}
                          property={property}
                          value={tBodyData[rowIndex][property]}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            }}
          />
        )}
      </div>
      {TFoot}
      {isDelete ? <PopOver /> : null}
      {Description}
    </div>
  );
};

export default GridTable;
