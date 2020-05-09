import React, { useEffect, useState, Fragment } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Icon,
  Form,
  Input,
  Select,
  Modal,
  message,
} from "antd";
import { studentInfoList, saveParentsInfo } from "../api";
import BaseTable from "@components/BaseTable/BaseTable";
import { classifyRole, classifyGender } from "@utils/role.js";
import delParams from "@utils/delParams";
const { Item } = Form;
const { Option } = Select;

function Dashboard({ form, history }) {
  const columns = [
    {
      key: "code",
      dataIndex: "code",
      title: "学号",
    },
    {
      key: "name",
      dataIndex: "name",
      title: "姓名",
    },
    {
      key: "studentId",
      dataIndex: "studentId",
      title: "学生ID",
    },
    {
      key: "phone",
      dataIndex: "phone",
      title: "手机号",
    },
    {
      key: "gender",
      dataIndex: "gender",
      title: "性别",
      render: (text) => {
        return <span>{classifyGender(text)}</span>;
      },
    },
    {
      key: "grade",
      dataIndex: "grade",
      title: "年级",
    },
    {
      key: "classCode",
      dataIndex: "classCode",
      title: "班级号",
    },
    {
      key: "dormitoryId",
      dataIndex: "dormitoryId",
      title: "宿舍ID",
    },
    {
      key: "role",
      dataIndex: "role",
      title: "角色",
      render: (text) => {
        return <span>{classifyRole(String(text))}</span>;
      },
    },
    {
      key: "parents",
      dataIndex: "parents",
      title: "父母信息",
      render: (parents, record) => {
        return (
          <Fragment>
            {parents.length === 0 ? (
              <span
                style={{ color: "#1890ff", cursor: "pointer" }}
                onClick={() => {
                  setModalShow(true);
                  setUserInfo({
                    ...userInfo,
                    studentId: record.studentId,
                  });
                }}
              >
                添加
              </span>
            ) : (
              <span
                style={{ color: "#1890ff", cursor: "pointer" }}
                onClick={() => {
                  setUserInfo({
                    ...parents[0],
                  });
                  setModalShow(true);
                }}
              >
                查看
              </span>
            )}
          </Fragment>
        );
      },
    },
    {
      key: "edit",
      dataIndex: "",
      title: "操作",
      render: (text, record) => {
        return (
          <span
            style={{ color: "#1890ff", cursor: "pointer" }}
            onClick={() => {
              history.push({ pathname: "/admin/submit", query: record });
            }}
          >
            编辑
          </span>
        );
      },
    },
  ];

  const {
    getFieldDecorator,
    getFieldsError,
    getFieldError,
    isFieldTouched,
  } = form;
  const formItemLayout = {
    labelCol: {
      span: 12,
    },
    wrapperCol: {
      span: 12,
    },
  };
  useEffect(() => {
    getList();
    form.validateFields();
  }, []);
  const [fields, setFields] = useState({
    //搜索条件
    code: "", //学号
    gender: "", //性别
    phone: "", //手机号
    grade: "", //年纪
    classCode: "", //班级号
    name: "", //姓名
    pageSize: 10,
    pageNumber: 1,
  });
  const [listData, setListData] = useState([]);
  const [reslistNum, setReslistNum] = useState(0);
  const [userInfo, setUserInfo] = useState({
    studentId: "",
    name: "",
    relation: "",
    phone: "",
  });
  const [modalShow, setModalShow] = useState(false);
  async function getList() {
    //获取学生信息列表
    let res = await studentInfoList(delParams(fields));
    if (res && res.code === 1000 && res.data.list) {
      setListData(res.data.list);
      setReslistNum(res.data.total);
    }
  }

  function handleSubmit(e) {
    //表单提交事件
    e.preventDefault();
    form.validateFields(async (err, values) => {
      if (!err) {
        console.log(values);
        setFields({
          ...fields,
          ...values,
        });
        let res = await studentInfoList({
          ...fields,
          ...values,
        });
        if (res && res.code === 1000 && res.data.list) {
          setListData(res.data.list);
          setReslistNum(res.data.total);
        }
      }
    });
  }

  function genderChange(e) {
    //性别select变化
    setFields({
      ...fields,
      gender: e,
    });
  }

  async function pageChange(page) {
    //页码变换
    setFields({
      ...fields,
      pageNumber: page,
    });
    let res = await studentInfoList({
      ...fields,
      pageSize: page,
    });
    if (res && res.code === 1000 && res.data.list) {
      setListData(res.data.list);
      setReslistNum(res.data.total);
    }
  }

  function submitStudent() {
    //录入学生信息
    history.push("/admin/submit");
  }

  async function onSubmit() {
    let { name, phone, relation } = userInfo;
    if (!name) {
      message.info("请输入父母名字");
      return;
    }
    if (!phone) {
      message.info("请输入父母手机号");
      return;
    }
    if (!relation && relation !== 0) {
      message.info("请选择关系");
      return;
    }
    let res = await saveParentsInfo([userInfo]);
    if (res && res.code === 1000) {
      message.success("添加成功");
      setModalShow(false);
      getList();
    } else if (res && res.msg) {
      message.success(res.msg);
    }
  }

  return (
    <div>
      <Card>
        <Form {...formItemLayout} onSubmit={handleSubmit}>
          <Row gutter={[24, 24]} type="flex" justify="start">
            <Col span={6}>
              <Item label="学号">
                {getFieldDecorator("code", { initialValue: fields.code })(
                  <Input placeholder="" />
                )}
              </Item>
            </Col>
            <Col span={6}>
              <Item label="班级号">
                {getFieldDecorator("classCode", {
                  initialValue: fields.classCode,
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
              <Item label="手机号">
                {getFieldDecorator("phone", { initialValue: fields.phone })(
                  <Input placeholder="" />
                )}
              </Item>
            </Col>
            <Col span={6}>
              <Item label="年级">
                {getFieldDecorator("grade", { initialValue: fields.grade })(
                  <Input placeholder="" />
                )}
              </Item>
            </Col>
            <Col span={6}>
              <Item label="性别">
                <Select
                  style={{ width: "100px" }}
                  value={
                    fields.gender !== 0 && !fields.gender
                      ? "请选择"
                      : fields.gender
                  }
                  onChange={genderChange}
                >
                  <Option value={0}>男</Option>
                  <Option value={1}>女</Option>
                </Select>
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
              <Button type="primary" onClick={submitStudent}>
                录入学生信息
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
        visible={modalShow}
        footer={null}
        onCancel={() => {
          setUserInfo({
            studentId: "",
            name: "",
            relation: "",
            phone: "",
          });
          setModalShow(false);
        }}
        className="edit_wrapper"
      >
        <Row gutter={[24, 24]} type="flex" justify="start" align="middle">
          <Col span={12}>
            <Item label="姓名">
              <Input
                placeholder=""
                value={userInfo.name}
                onChange={(e) => {
                  setUserInfo({
                    ...userInfo,
                    name: e.target.value,
                  });
                }}
              />
            </Item>
          </Col>
          <Col span={12}>
            <Item label="手机号">
              <Input
                placeholder=""
                value={userInfo.phone}
                onChange={(e) => {
                  setUserInfo({
                    ...userInfo,
                    phone: e.target.value,
                  });
                }}
              />
            </Item>
          </Col>
          <Col span={12}>
            <Item label="关系">
              <Select
                style={{ width: "200px" }}
                value={userInfo.relation}
                onChange={(e) => {
                  setUserInfo({
                    ...userInfo,
                    relation: e,
                  });
                }}
              >
                <Option value={0}>父亲</Option>
                <Option value={1}>母亲</Option>
              </Select>
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <Item>
              <Button type="primary" onClick={onSubmit}>
                提交
              </Button>
            </Item>
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

export default Form.create({ name: "horizontal_login" })(Dashboard);
