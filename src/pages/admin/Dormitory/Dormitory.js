import React, { Fragment, useEffect, useState } from "react";
import { studentDormitoryList, delDomitory, saveDomitory } from "../api";
import { time_stamp } from "@utils/timeFormatter";
import { message, Table, Button, Input, Form, Row, Col, Modal } from "antd";
const { Item } = Form;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const Dormitory = ({ form }) => {
  let { getFieldDecorator } = form;
  const columns = [
    {
      title: "楼号",
      key: "buildingNumber",
      dataIndex: "buildingNumber",
    },
    {
      title: "宿舍编号",
      key: "code",
      dataIndex: "code",
    },
    {
      title: "创建时间",
      key: "createTime",
      dataIndex: "createTime",
      render: (text) => {
        return time_stamp(text);
      },
    },
    {
      title: "操作",
      key: "action",
      render: (t, record) => {
        return (
          <Fragment>
            <span
              style={{
                color: "#f81d22",
                cursor: "pointer",
                marginRight: "5px",
              }}
              onClick={() => {
                del_domitory(record.id);
              }}
            >
              删除
            </span>
            <span
              style={{ color: "#1890ff", cursor: "pointer" }}
              onClick={() => {
                setIsEdit(true);
                setFields({
                  buildingNumber: record.buildingNumber, //楼号
                  code: record.code, //宿舍编号
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
  //宿舍信息
  const [dorList, setDorList] = useState([]);
  const [editShow, setEditShow] = useState(false);
  const [fields, setFields] = useState({
    buildingNumber: "", //楼号
    code: "", //宿舍编号
    id: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  useEffect(() => {
    getList();
  }, []);

  async function del_domitory(id) {
    let res = await delDomitory({ id });
    if (res && res.code === 1000) {
      getList();
    }else if(res && res.msg){
      message.error(res.msg)
    }else{
      message.error('网络错误')
    }
  }

  async function getList() {
    let res = await studentDormitoryList();
    if (res.code === 1000) {
      setDorList(res.data);
    } else if (res && res.msg) {
      message.info(res.msg);
    } else {
      message.error("网络错误");
    }
  }
  function handleSubmit(e) {
    //表单提交事件
    e.preventDefault();
    form.validateFields(async (err, values) => {
      if (!err) {
        let params = {};
        let { code, buildingNumber } = values;
        if (!buildingNumber) {
          message.info("楼号");
          return;
        }

        if (!code) {
          message.info("宿舍编号");
          return;
        }

        params = {
          buildingNumber,
          code,
        };

        if (isEdit) {
          console.log(fields.id)
          params.id = fields.id;
        }
        let res = await saveDomitory(params);
        if (res && res.code === 1000) {
          message.success("保存成功");
          setEditShow(false);
          getList();
        } else if (res && res.msg) {
          message.info(res.msg);
        } else {
          message.error("网络错误");
        }
      }
    });
  }
  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setIsEdit(false);
          setEditShow(true);
        }}
      >
        录入宿舍信息
      </Button>
      <Table
        columns={columns}
        rowKey={(record) => {
          return record.id;
        }}
        dataSource={dorList}
        pagination={false}
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
              <Item label="楼号">
                {getFieldDecorator("buildingNumber", {
                  initialValue: isEdit ? fields.buildingNumber : "",
                })(<Input placeholder="" />)}
              </Item>
            </Col>
            <Col span={12}>
              <Item label="宿舍编号">
                {getFieldDecorator("code", {
                  initialValue: isEdit ? fields.code : "",
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

export default Form.create({ name: "horizontal_login" })(Dormitory);
