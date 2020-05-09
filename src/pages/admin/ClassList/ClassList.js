import React, { Fragment, useState, useEffect } from "react";
import { getClassList, saveClass, delClass } from "../api";
import BaseTable from "@components/BaseTable/BaseTable";
import {
  Form,
  Card,
  Row,
  Col,
  Input,
  Button,
  Modal,
  message,
  Popconfirm,
} from "antd";

const { Item } = Form;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const ClassList = ({ form }) => {
  const columns = [
    {
      key: "grade",
      dataIndex: "grade",
      title: "年级",
    },
    {
      key: "code",
      dataIndex: "code",
      title: "班级号",
    },
    {
      key: "operateTime",
      dataIndex: "operateTime",
      title: "操作时间",
    },
    {
      key: "action",
      title: "操作",
      render: (text, record) => {
        return (
          <Fragment>
            <span
              onClick={() => {
                setIsEdit(true);
                setStoreId(record.id);
                setEditShow(true);
                form.setFieldsValue({
                  grade: record.grade,
                  code: record.code,
                });
              }}
              style={{
                color: "#1890ff",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              修改
            </span>
            <Popconfirm
              placement="topLeft"
              title={"确认删除吗"}
              onConfirm={async () => {
                let res = await delClass({ id: record.id });
                if (res && res.code === 1000) {
                  message.success("删除成功");
                  getList(fields);
                } else if (res && res.msg) {
                  message.info(res.msg);
                } else {
                  message.error("网络错误");
                }
              }}
              okText="确认"
              cancelText="取消"
            >
              <span style={{ color: "#f81d22", cursor: "pointer" }}>删除</span>
            </Popconfirm>
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
  const [storeId, setStoreId] = useState("");
  const [fields, setFields] = useState({
    pageNumber: 1,
    pageSize: 10,
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
        let reqParams = {};
        let { code, grade } = values;
        if (!grade) {
          message.info("请输入年级");
          return;
        }

        if (!code) {
          message.info("请输入班级号");
          return;
        }

        reqParams = { grade, code };

        if (isEdit) {
          reqParams.id = storeId;
        }

        let res = await saveClass(reqParams);
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
    });
  }
  async function getList(params) {
    //获取查夜列表
    let res = await getClassList(params);
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
  return (
    <div>
      <Card>
        <Button
          type="primary"
          size="large"
          onClick={() => {
            setEditShow(true);
            setIsEdit(false);
            form.setFieldsValue({
              grade: "",
              code: "",
            });
          }}
        >
          录入班级信息
        </Button>
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
        visible={editShow}
        footer={null}
        onCancel={() => {
          setEditShow(false);
        }}
        className="edit_wrapper"
      >
        <Form {...formItemLayout} onSubmit={handleSubmit}>
          <Row gutter={[24, 24]} type="flex" justify="start" align="middle">
            <Col span={12}>
              <Item label="年级">
                {getFieldDecorator("grade", {
                  initialValue: "",
                })(<Input placeholder="" />)}
              </Item>
            </Col>
            <Col span={12}>
              <Item label="班级号">
                {getFieldDecorator("code", {
                  initialValue: "",
                })(<Input placeholder="" />)}
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <Item>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
export default Form.create({ name: "horizontal_login" })(ClassList);
