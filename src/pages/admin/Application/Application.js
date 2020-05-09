import React, { Fragment, useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  message,
  Modal,
} from "antd";
import { leavePage, agreeAsk, rejectAsk } from "../api";
import BaseTable from "@components/BaseTable/BaseTable";
import moment from "moment";
import { time_stamp } from "@utils/timeFormatter";
import { getUser } from "@utils/auth";
import { classifyExami } from "@utils/role.js";
import { Link } from "react-router-dom";
// import { classifyRole, classifyGender } from "@utils/role.js";
const { Item } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Application = ({ form }) => {
  const columns = [
    {
      key: "studentCode",
      dataIndex: "studentCode",
      title: "学号",
    },
    {
      key: "studentName",
      dataIndex: "studentName",
      title: "学生姓名",
    },
    {
      key: "context",
      dataIndex: "context",
      title: "理由",
      render: (text) => (
        <span
          onClick={() => {
            setShowText(text);
            setShowModal(true);
          }}
          style={{ color: " #008dff", cursor: "pointer" }}
        >
          查看
        </span>
      ),
    },
    {
      key: "time",
      title: "请假时间",
      render: function (text, record) {
        return (
          <span>
            {time_stamp(record.startTime)}
            <br />
            --
            <br />
            {time_stamp(record.endTime)}
          </span>
        );
      },
    },
    {
      key: "status",
      dataIndex: "status",
      title: "审核状态",
      render: function (text, record) {
        return (
          <div>
            {classifyExami(text)}
            {getUser() === "0" ? (
              ""
            ) : text === 0 ? (
              <Fragment>
                <Button
                  style={{ marginLeft: "5px" }}
                  type="danger"
                  onClick={() => {
                    handleApplicate(false, record.id);
                  }}
                >
                  拒绝
                </Button>
                <Button
                  style={{ marginLeft: "5px" }}
                  type="primary"
                  onClick={() => {
                    handleApplicate(true, record.id);
                  }}
                >
                  同意
                </Button>
              </Fragment>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
  ];
  const { getFieldDecorator } = form;
  const [showText, setShowText] = useState("");
  const [listData, setListData] = useState([]);
  const [reslistNum, setReslistNum] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [fields, setFields] = useState({
    //搜索条件
    studentCode: "", //学号
    name: "", //姓名
    endTime: "", //请假结束时间
    startTime: "", //请假截至时间
    status: "", //审批状态
    pageSize: 6,
    pageNumber: 1,
  });
  const formItemLayout = {
    labelCol: {
      span: 12,
    },
    wrapperCol: {
      span: 12,
    },
  };
  useEffect(() => {
    form.validateFields();
    getList(fields);
  }, []);

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

  function statusChange(e) {
    //性别select变化
    setFields({
      ...fields,
      status: e,
    });
  }

  async function getList(params) {
    let res = await leavePage(params);
    if (res && res.code === 1000 && res.data.list) {
      setListData(res.data.list);
      setReslistNum(res.data.total);
    } else if (res && res.msg) {
      message.info(res.msg);
    } else {
      message.info("网络错误");
    }
  }

  function saleDateChange(e) {
    //请假时间截至
    setFields({
      ...fields,
      startTime: e[0].valueOf(),
      endTime: e[1].valueOf(),
    });
  }
  async function pageChange(page) {
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

  async function handleApplicate(isAgree, id) {
    //处理假条事件
    let res;
    if (isAgree) {
      res = await agreeAsk({
        id,
      });
    } else {
      res = await rejectAsk({
        id,
      });
    }
    if (res && res.code === 1000) {
      message.success("处理成功");
      getList(fields);
    }
  }
  return (
    <div>
      <Card>
        <Form {...formItemLayout} onSubmit={handleSubmit}>
          <Row gutter={[24, 24]} type="flex" justify="start">
            <Col span={6}>
              <Item label="学号">
                {getFieldDecorator("studentCode", {
                  initialValue: fields.studentCode,
                })(<Input placeholder="" />)}
              </Item>
            </Col>

            <Col span={6}>
              <Item label="姓名">
                {getFieldDecorator("name", {
                  initialValue: fields.name,
                })(<Input placeholder="" />)}
              </Item>
            </Col>
          </Row>
          <Row gutter={[24, 24]} type="flex" justify="start">
            <Col span={6}>
              <Item label="审批状态">
                <Select
                  style={{ width: "100px" }}
                  value={
                    fields.status !== 0 && !fields.status
                      ? "请选择"
                      : fields.status
                  }
                  onChange={statusChange}
                >
                  <Option value={0}>待审批</Option>
                  <Option value={1}>已审批</Option>
                  <Option value={2}>已驳回</Option>
                </Select>
              </Item>
            </Col>
            <Col span={12}>
              <Item label="请假起止时间" labelCol={{ span: 6 }}>
                <RangePicker
                  className="date_picker"
                  locale="ch"
                  showTime={{
                    defaultValue: [
                      moment("00:00:00", "HH:mm:ss"),
                      moment("11:59:59", "HH:mm:ss"),
                    ],
                  }}
                  onChange={saleDateChange}
                />
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
      <Row gutter={[24, 24]} type="flex" justify="start">
        <Col span={6} offset={2}>
          {getUser() === "0" ? (
            <Button
              type="primary"
              style={{
                marginBottom: "15px",
                marginTop: "15px",
              }}
            >
              <Link to="/admin/askLeave">请假</Link>
            </Button>
          ) : (
            ""
          )}
        </Col>
      </Row>
      <BaseTable
        dataSource={listData}
        columns={columns}
        pageBtnChange={pageChange}
        pageSize={fields.pageSize}
        page={fields.pageNumber}
        total={reslistNum}
      />
      <Modal
        visible={showModal}
        footer={null}
        onCancel={() => {
          setShowModal(false);
        }}
      >
        <p>{showText}</p>
      </Modal>
    </div>
  );
};

export default Form.create({ name: "horizontal_login" })(Application);
