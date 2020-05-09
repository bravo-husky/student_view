import React, { Fragment, useState, useEffect } from "react";
import { reportlist, setScore } from "../api";
import BaseTable from "@components/BaseTable/BaseTable";
import {
  Form,
  Card,
  Row,
  Col,
  Input,
  Button,
  Modal,
  Select,
  message,
} from "antd";
import delParams from "@utils/delParams";
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
  },
};

const { Item } = Form;
const ReportPage = ({ form }) => {
  const { getFieldDecorator } = form;
  const columns = [
    {
      key: "courseId",
      dataIndex: "courseId",
      title: "课程ID",
    },
    {
      key: "courseName",
      dataIndex: "courseName",
      title: "课程名字",
    },
    {
      key: "year",
      dataIndex: "year",
      title: "年份",
    },
    {
      key: "half",
      dataIndex: "half",
      title: "学期",
      render: (text) => {
        return <span>{text ? "下半年" : "上半年"}</span>;
      },
    },
    {
      key: "studentId",
      dataIndex: "studentId",
      title: "学生ID",
    },
    {
      key: "name",
      dataIndex: "name",
      title: "学生名字",
    },
    {
      key: "score",
      dataIndex: "score",
      title: "分数",
    },
    {
      key: "set",
      dataIndex: "id",
      title: "打分",
      render: (text, record) => {
        return (
          <>
            {record.marked ? (
              <span>已打分</span>
            ) : (
              <span
                style={{ color: "#1890ff", cursor: "pointer" }}
                onClick={() => {
                  setShowModal(true);
                  setMark({
                    ...mark,
                    id: text,
                  });
                }}
              >
                添加分数
              </span>
            )}
          </>
        );
      },
    },
  ];
  useEffect(() => {
    getList(delParams(fields));
  }, []);

  const [listData, setListData] = useState([]);
  const [reslistNum, setReslistNum] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [mark, setMark] = useState({
    id: "",
    score: "",
  });
  const [fields, setFields] = useState({
    pageSize: 1,
    pageNumber: 10,
    courseName: "", //课程名子
    year: "", //年份
    half: "", //学期
    marked: "", //是否打了分
    name: "", //学生名字
  });
  async function getList(params) {
    let res = await reportlist(params);
    if (res && res.code === 1000) {
      setListData(res.data.list);
    }
  }

  function handleSubmit(e) {
    //表单提交事件
    e.preventDefault();
    form.validateFields(async (err, values) => {
      if (!err) {
        setFields({
          ...fields,
          ...values,
        });
        getList({
          ...fields,
          ...values,
        });
      }
    });
  }

  function pageChange(page) {
    //页码变换
    setFields({
      ...fields,
      pageSize: page,
    });
    getList({
      ...fields,
      pageSize: page,
    });
  }
  return (
    <div>
      <Card>
        {/*  courseName: "", //课程名子
    year: "", //年份
    half: "", //学期
    marked: "", //是否打了分
    name: "", //学生名字 */}

        <Form {...formItemLayout} onSubmit={handleSubmit}>
          <Row gutter={[24, 24]} type="flex" justify="start" align="middle">
            <Col span={6}>
              <Item label="学生姓名">
                {getFieldDecorator("name", {
                  initialValue: fields.name,
                })(<Input placeholder="" />)}
              </Item>
            </Col>
            <Col span={6}>
              <Item label="课程名字">
                {getFieldDecorator("courseName", {
                  initialValue: fields.courseName,
                })(<Input placeholder="" />)}
              </Item>
            </Col>
            <Col span={6}>
              <Item label="年份">
                {getFieldDecorator("year", {
                  initialValue: fields.year,
                })(<Input placeholder="" />)}
              </Item>
            </Col>
            <Col span={6}>
              <Item label="学期">
                {getFieldDecorator("half", {
                  initialValue: fields.half,
                })(
                  <Select>
                    <Option value={0}>上半年</Option>
                    <Option value={1}>下半年</Option>
                  </Select>
                )}
              </Item>
            </Col>
            <Col span={6}>
              <Item label="是否打分">
                {getFieldDecorator("marked", {
                  initialValue: fields.marked,
                })(
                  <Select>
                    <Option value={false}>未打分</Option>
                    <Option value={true}>已打分</Option>
                  </Select>
                )}
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
        dataSource={listData}
        pageSize={fields.pageNumber}
        page={fields.pageSize}
        total={reslistNum}
        pageBtnChange={pageChange}
      />
      <Modal
        visible={showModal}
        onCancel={() => {
          setShowModal(false);
        }}
        onOk={async () => {
          let res = await setScore(mark);
          if (res && res.code === 1000) {
            message.success("添加成功");
            setShowModal(false);
            getList(fields);
          }
        }}
      >
        <Input
          placeholder={"设置分数"}
          onChange={(e) => {
            setMark({
              ...mark,
              score: e.target.value,
            });
          }}
        />
      </Modal>
    </div>
  );
};

export default Form.create({ name: "horizontal_login" })(ReportPage);
