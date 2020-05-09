import React, { Fragment, useEffect, useState, useRef } from "react";
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
import { internPage } from "../api";
import BaseTable from "@components/BaseTable/BaseTable";
import moment from "moment";
import { time_stamp } from "@utils/timeFormatter";
import { getUser } from "@utils/auth";
import delParams from "@utils/delParams";
import { classifyExami } from "@utils/role.js";
import { Link } from "react-router-dom";
import EditModal from "./EditModal";
import "./Internship.css";
const { Item } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;
let init_params = {
  code: "", //学号
  name: "", //姓名
  company: "", //公司名字
  teacherName: "", //负责老师姓名
  // studentId: "", //学生ID
  teacherId: "", //负责老师ID
  comment: "", //备注
  post: "", //岗位
  salary: "", //薪资
};
const Internship = ({ form }) => {
  const columns = [
    {
      key: "code",
      dataIndex: "code",
      title: "学号",
    },
    {
      key: "name",
      dataIndex: "name",
      title: "学生姓名",
    },
    {
      key: "company",
      dataIndex: "company",
      title: "公司名称",
    },
    {
      key: "teacherName",
      dataIndex: "teacherName",
      title: "负责老师",
    },
    {
      key: "time",
      title: "实习时间",
      render: function (text, record) {
        return (
          <span>
            {time_stamp(record.startDate)}
            <br />
            --
            <br />
            {time_stamp(record.endDate)}
          </span>
        );
      },
    },
    {
      key: "post",
      dataIndex: "post",
      title: "岗位",
    },
    {
      key: "salary",
      dataIndex: "salary",
      title: "薪资",
    },
    {
      key: "comment",
      dataIndex: "comment",
      title: "备注",
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
      key: "action",
      title: "操作",
      render: (text, record) => {
        return (
          <span
            style={{ color: " #008dff", cursor: "pointer" }}
            onClick={() => {
              setStudentId(record.studentId);
              setEditShow(true);
              let re = setTimeout(() => {
                sonRef.current.setFieldsValue({
                  code: record.code, //学号
                  name: record.name, //姓名
                  company: record.company, //公司名字
                  teacherName: record.teacherName, //负责老师姓名
                  teacherId: record.teacherId, //负责老师ID
                  comment: record.comment, //备注
                  post: record.post, //岗位
                  salary: record.salary, //薪资
                });
                clearTimeout(re);
              }, 100);

              setSonFields({
                startDate: moment(record.startDate),
                endDate: moment(record.endDate),
                id: record.id,
                studentId: record.studentId,
              });
            }}
          >
            修改
          </span>
        );
      },
    },
  ];
  const { getFieldDecorator } = form;
  const sonRef = useRef(null);
  const [showText, setShowText] = useState("");
  const [listData, setListData] = useState([]);
  const [reslistNum, setReslistNum] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [sonFields, setSonFields] = useState({
    startDate: "",
    endDate: "",
  });
  const [fields, setFields] = useState({
    //搜索条件
    code: "", //学号
    name: "", //姓名
    company: "", //公司名字
    teacherName: "", //负责老师姓名
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

  async function getList(params) {
    let res = await internPage(delParams(params));
    if (res && res.code === 1000 && res.data.list) {
      setListData(res.data.list);
      setReslistNum(res.data.total);
    } else if (res && res.msg) {
      message.info(res.msg);
    } else {
      message.info("网络错误");
    }
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

  function saleDateChange(e) {
    //请假时间截至
    setFields({
      ...fields,
      startDate: time_stamp(e[0].valueOf()),
      endDate: time_stamp(e[1].valueOf()),
    });
  }

  return (
    <div>
      <Card>
        <Form {...formItemLayout} onSubmit={handleSubmit}>
          <Row gutter={[24, 24]} type="flex" justify="start">
            <Col span={6}>
              <Item label="学号">
                {getFieldDecorator("code", {
                  initialValue: fields.code,
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
            <Col span={6}>
              <Item label="负责老师名字">
                {getFieldDecorator("teacherName", {
                  initialValue: fields.teacherName,
                })(<Input placeholder="" />)}
              </Item>
            </Col>
          </Row>
          <Row gutter={[24, 24]} type="flex" justify="start">
            <Col span={6}>
              <Item label="公司名称">
                {getFieldDecorator("company", {
                  initialValue: fields.company,
                })(<Input placeholder="" />)}
              </Item>
            </Col>
            <Col span={12}>
              <Item label="实习时间" labelCol={{ span: 6 }}>
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
          <Row>
            <Col>
              <Button
                type="primary"
                onClick={() => {
                  setEditShow(true);
                  setStudentId(null);
                }}
              >
                录入学生实习毕业信息
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
      
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
      <Modal
        visible={editShow}
        footer={null}
        onCancel={() => {
          setEditShow(false);
          sonRef.current.setFieldsValue(init_params);
        }}
        className="edit_wrapper"
      >
        <EditModal
          fields={sonFields}
          setFields={setSonFields}
          setEditShow={setEditShow}
          ref={sonRef}
          studentId={studentId}
          getList={() => {
            getList(fields);
          }}
        />
      </Modal>
    </div>
  );
};

export default Form.create({ name: "horizontal_login" })(Internship);
