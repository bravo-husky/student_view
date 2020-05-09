import React, { Fragment, useState, useEffect } from "react";
import { roundsPageApi, saveRounds } from "../api";
import BaseTable from "@components/BaseTable/BaseTable";
import delParams from "@utils/delParams";
import {
  Form,
  Card,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Button,
  Modal,
  Tag,
  Icon,
  Tooltip,
  message,
} from "antd";
import { time_stamp } from "@utils/timeFormatter.js";
const { Item } = Form;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
  },
};

const RoundsPage = ({ form }) => {
  const columns = [
    // {
    //   key: "currentDate",
    //   dataIndex: "currentDate",
    //   title: "当前日期",
    // },
    {
      key: "createTime",
      dataIndex: "createTime",
      title: "创建时间",
    },

    {
      key: "operator",
      dataIndex: "operator",
      title: "操作人ID",
    },
    {
      key: "dormitoryId",
      dataIndex: "dormitoryId",
      title: "宿舍ID",
    },
    {
      key: "absentNumber",
      dataIndex: "absentNumber",
      title: "缺席人数",
    },
    {
      key: "studentList",
      dataIndex: "studentList",
      title: "不归宿学生信息集合",
      render: (text) => {
        return (
          <span
            style={{ color: "#1890ff", cursor: "pointer" }}
            onClick={() => {
              setStudentList(text);
              setNotShow(true);
            }}
          >
            详情
          </span>
        );
      },
    },
  ];
  const { getFieldDecorator } = form;
  const [listData, setListData] = useState([]);
  const [reslistNum, setReslistNum] = useState(0);
  const [notShow, setNotShow] = useState(false);
  const [studentList, setStudentList] = useState([]); //查看不归属学生modal
  const [editShow, setEditShow] = useState(false); //发布查夜信息modal
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [inputVisible, setInputVisible] = useState(false);
  const [fields, setFields] = useState({
    pageNumber: 1,
    pageSize: 10,
    dormitoryId: "", //宿舍ID
    currentDate: "", //当前日期
    absent: "", //是否缺席
  });
  const [submitparams, setSubmitparams] = useState({
    dormitoryId: "",
    absent: 1,
    currentDate: "",
  });
  useEffect(() => {
    getList(fields);
    form.validateFields();
  }, []);

  function handleSubmit(e) {
    //表单提交事件
    e.preventDefault();
    form.validateFields(async (err, values) => {
      if (!err) {
        let paramsFields = { ...fields };
        setFields({
          ...paramsFields,
          ...values,
        });

        if (typeof paramsFields.absent === "number") {
          if (paramsFields.absent) {
            paramsFields.absent = true;
          } else {
            paramsFields.absent = false;
          }
        }

        getList(
          delParams({
            ...paramsFields,
            ...values,
          })
        );
      }
    });
  }
  async function getList(params) {
    //获取查夜列表
    let res = await roundsPageApi(params);
    if (res && res.code === 1000 && res.data) {
      setListData(res.data.list);
      setReslistNum(res.data.total);
    }
  }

  function pageChange(page) {
    //页码变换
    setFields({
      ...fields,
      pageNumber: page,
    });
    getList({
      ...fields,
      pageNumber: page,
    });
  }

  function absentChange(e) {
    //是否缺席
    setFields({
      ...fields,
      absent: e,
    });
  }

  function timeChange(e) {
    //当前时间变化
    setFields({
      ...fields,
      currentDate: time_stamp(e.valueOf(), true),
    });
  }

  const handleClose = (removedTag) => {
    //删除一个tag
    const filetTag = tags.filter((tag) => tag !== removedTag);
    setTags(filetTag);
  };

  const showInput = () => {
    //添加tag
    setInputVisible(true);
  };

  const handleInputChange = (e) => {
    //input的值
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    //失去焦点确定

    let Tag_arr = [...tags];
    if (inputValue) {
      Tag_arr = [...tags, inputValue];
      setTags(Tag_arr);
    }
    setInputValue("");
    setInputVisible(false);
  };

  const submitAction = async () => {
    //提交按钮
    let { dormitoryId, currentDate, absent } = submitparams;
    if (!dormitoryId) {
      message.info("请输入宿舍ID");
      return;
    }
    if (!currentDate) {
      message.info("请选择当前日期");
      return;
    }

    if (absent) {
      absent = true;
    } else {
      absent = false;
    }

    let res = await saveRounds(
      delParams({
        ...submitparams,
        studentList: tags,
        absent,
        dormitoryId: Number(dormitoryId),
      })
    );
    if (res && res.code === 1000) {
      getList(fields);
      setEditShow(false);
    } else if (res && res.msg) {
      message.info(res.msg);
    } else {
      message.error("网络错误");
    }
  };

  return (
    <div>
      <Button
        type={"primary"}
        style={{ margin: "20px" }}
        onClick={() => {
          setEditShow(true);
        }}
      >
        发布查夜信息
      </Button>
      <Card>
        <Form {...formItemLayout} onSubmit={handleSubmit}>
          <Row gutter={[24, 24]} type="flex" justify="start" align="middle">
            <Col span={6}>
              <Item label="宿舍ID">
                {getFieldDecorator("dormitoryId", {
                  initialValue: fields.dormitoryId,
                })(<Input placeholder="" />)}
              </Item>
            </Col>
            <Col span={6}>
              <Item label="是否缺席">
                <Select
                  style={{ width: "100px" }}
                  value={
                    !fields.absent &&
                    fields.absent !== false &&
                    typeof fields.absent !== "number"
                      ? "请选择"
                      : fields.absent
                  }
                  onChange={absentChange}
                >
                  <Option value={0}>否</Option>
                  <Option value={1}>是</Option>
                </Select>
              </Item>
            </Col>
            <Col span={6}>
              <Item label="选择日期">
                <DatePicker onChange={timeChange} />
              </Item>
            </Col>
            <Col span={6}>
              <Item>
                <Button type="primary" htmlType="submit">
                  搜索
                </Button>
              </Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <BaseTable
        columns={columns}
        paginationProps={pageChange}
        pageSize={fields.pageSize}
        page={fields.pageNumber}
        dataSource={listData}
        total={reslistNum}
      />
      <Modal
        visible={notShow}
        footer={null}
        onCancel={() => {
          setNotShow(false);
        }}
        className="edit_wrapper"
      >
        <ul>
          {Array.isArray(studentList)
            ? studentList.map((item, index) => {
                return (
                  <li style={{ marginBottom: "10px" }}>
                    姓名:&nbsp;{item.name}&nbsp;&nbsp; 学号:&nbsp;{item.code}
                    &nbsp;&nbsp; 班级ID:&nbsp;{item.classId}&nbsp;&nbsp;
                    手机号:&nbsp;{item.phone}&nbsp;&nbsp;
                  </li>
                );
              })
            : ""}
        </ul>
      </Modal>
      <Modal
        visible={editShow}
        footer={null}
        title="发布查夜信息"
        onCancel={() => {
          setEditShow(false);
        }}
        className="edit_wrapper"
      >
        {/* dormitoryId 宿舍id   studentIdList 不归宿学生id currentDate 查夜信息当天日期 absent 是否缺席 */}
        <Card>
          <Row gutter={[24, 24]} type="flex" justify="start" align="middle">
            <Col span={12}>
              <Item label={"宿舍id"}>
                <Input
                  value={submitparams.dormitoryId}
                  onChange={(e) => {
                    setSubmitparams({
                      ...submitparams,
                      dormitoryId: e.target.value,
                    });
                  }}
                />
              </Item>
            </Col>
            <Col span={12}>
              <Item label={"当天日期"}>
                <DatePicker
                  onChange={(e) => {
                    setSubmitparams({
                      ...submitparams,
                      currentDate: time_stamp(e.valueOf(), true),
                    });
                  }}
                />
              </Item>
            </Col>
          </Row>
          <Row gutter={[24, 24]} type="flex" justify="start" align="middle">
            <Col span={12}>
              <Item label={"是否缺席"}>
                <Select
                  value={submitparams.absent}
                  defaultValue={1}
                  onChange={(e) => {
                    setSubmitparams({
                      ...submitparams,
                      absent: e,
                    });
                  }}
                  style={{ width: "120px" }}
                >
                  <Option value={0}>否</Option>
                  <Option value={1}>是</Option>
                </Select>
              </Item>
            </Col>
            <Col span={12}>
              <Item label={"不归宿学生ID"}>
                {tags.map((tag, index) => {
                  const isLongTag = tag.length > 20;
                  const tagElem = (
                    <Tag
                      key={tag}
                      closable={true}
                      onClose={() => handleClose(tag)}
                    >
                      {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                    </Tag>
                  );
                  return isLongTag ? (
                    <Tooltip title={tag} key={tag}>
                      {tagElem}
                    </Tooltip>
                  ) : (
                    tagElem
                  );
                })}
                {inputVisible && (
                  <Input
                    type="text"
                    size="small"
                    style={{ width: 78 }}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                  />
                )}
                {!inputVisible && (
                  <Tag
                    onClick={showInput}
                    style={{ background: "#fff", borderStyle: "dashed" }}
                  >
                    <Icon type="plus" /> 添加学生ID
                  </Tag>
                )}
              </Item>
            </Col>
          </Row>
          <Row>
            <Button type="primary" onClick={submitAction}>
              发布
            </Button>
          </Row>
        </Card>
      </Modal>
    </div>
  );
};

export default Form.create({ name: "horizontal_login" })(RoundsPage);
