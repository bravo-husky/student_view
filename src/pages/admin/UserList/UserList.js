import React, { Fragment, useState, useEffect } from "react";
import { userListApi, saveUser, delUser } from "../api";
import BaseTable from "@components/BaseTable/BaseTable";
import { classifyRole } from "@utils/role";
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
import delParams from "../../../utils/delParams";
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

const list = [
  {
    val: "0",
    title: "学生",
  },
  {
    val: "1",
    title: "班主任",
  },
  {
    val: "2",
    title: "管理员",
  },
  {
    val: "3",
    title: "超级管理员",
  },
];
const UserList = ({ form }) => {
  const columns = [
    {
      key: "name",
      dataIndex: "name",
      title: "姓名",
    },
    {
      key: "account",
      dataIndex: "account",
      title: "账号",
    },
    {
      key: "password",
      dataIndex: "password",
      title: "账号",
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
      key: "action",
      title: "操作",
      render: (text, record) => {
        return (
          <Fragment>
            <span
              style={{
                color: "#f81d22",
                cursor: "pointer",
                marginRight: "5px",
              }}
              onClick={() => {
                delUserAction(record.id);
              }}
            >
              删除
            </span>
            <span
              style={{ color: "#1890ff", cursor: "pointer" }}
              onClick={() => {
                setIsEdit(true);
                setUserInfo({
                  name: record.name, //楼号
                  account: record.account, //宿舍编号
                  password: record.password,
                  role: String(record.role),
                  id: record.id,
                });
                setEditShow(true);
              }}
            >
              修改
            </span>
          </Fragment>
        );
      },
    },
  ];

  const { getFieldDecorator } = form;
  const [listData, setListData] = useState([]);
  const [reslistNum, setReslistNum] = useState(0);
  const [editShow, setEditShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    account: "",
    password: "",
    role: "",
  });
  const [fields, setFields] = useState({
    pageNumber: 1,
    pageSize: 10,
    name: "",
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

  async function onSubmit() {
    let { name, account, password, role } = userInfo;
    let params = {};
    if (!name) {
      message.info("请输入用户姓名");
    }
    if (!account) {
      message.info("请输入用户账号");
    }
    if (!password) {
      message.info("请输入用户密码");
    }
    if (!role) {
      message.info("请输入用户角色");
    }
    params = {
      name,
      account,
      password,
      role: Number(role),
    };
    if (isEdit) {
      params.id = userInfo.id;
    }

    let res = await saveUser(params);
    if (res && res.code === 1000) {
      message.success("保存成功");
      setEditShow(false);
      getList(fields);
    } else if (res && res.msg) {
      message.info(res.msg);
    } else {
      message.error("网络错误");
    }
  }
  async function getList(params) {
    //获取查夜列表
    let res = await userListApi(delParams(params));
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

  async function delUserAction(id) {
    let res = await delUser({ id });
    if (res && res.code === 1000) {
      message.success("删除成功");
      setEditShow(false);
      getList(fields);
    } else if (res && res.msg) {
      message.info(res.msg);
    } else {
      message.error("网络错误");
    }
  }
  return (
    <div>
      <Button
        type="primary"
        size="large"
        style={{ margin: "20px" }}
        onClick={() => {
          setUserInfo({
            name: "", //楼号
            account: "", //宿舍编号
            password: "",
            role: "0",
          });
          setEditShow(true);
          setIsEdit(false);
        }}
      >
        新增用户
      </Button>
      <Card>
        <Form {...formItemLayout} onSubmit={handleSubmit}>
          <Row gutter={[24, 24]} type="flex" justify="start" align="middle">
            <Col span={6}>
              <Item label="姓名">
                {getFieldDecorator("name", {
                  initialValue: fields.name,
                })(<Input placeholder="" />)}
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
        pageSize={fields.pageSize}
        page={fields.pageNumber}
        dataSource={listData}
        total={reslistNum}
        pageBtnChange={pageChange}
      />
      <Modal
        visible={editShow}
        footer={null}
        onCancel={() => {
          setEditShow(false);
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
            <Item label="账号">
              <Input
                placeholder=""
                value={userInfo.account}
                onChange={(e) => {
                  setUserInfo({
                    ...userInfo,
                    account: e.target.value,
                  });
                }}
              />
            </Item>
          </Col>
          <Col span={12}>
            <Item label="密码">
              <Input
                placeholder=""
                value={userInfo.password}
                onChange={(e) => {
                  setUserInfo({
                    ...userInfo,
                    password: e.target.value,
                  });
                }}
              />
            </Item>
          </Col>
          <Col span={12}>
            <Item label="角色">
              <Select
                style={{ width: "120px" }}
                defaultValue={"0"}
                value={userInfo.role}
                onChange={(e) => {
                  setUserInfo({
                    ...userInfo,
                    role: e,
                  });
                }}
              >
                {list.map((item, index) => {
                  return (
                    <Option key={index} value={item.val}>
                      {item.title}
                    </Option>
                  );
                })}
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
};
export default Form.create({ name: "horizontal_login" })(UserList);
