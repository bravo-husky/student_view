import React, { Fragment, useState, useEffect } from "react";
import { signList, setScore } from "../api";
import BaseTable from "@components/BaseTable/BaseTable";
import { Form, Card, Row, Col, Input, Button, Select, message } from "antd";
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
const SignList = ({ form }) => {
  const { getFieldDecorator } = form;
  const columns = [
    {
      key: "createTime",
      dataIndex: "createTime",
      title: "签到时间",
    },
    {
      key: "currentDate",
      dataIndex: "currentDate",
      title: "当天日期",
    },
    {
      key: "studentName",
      dataIndex: "studentName",
      title: "学生姓名",
    },
    {
      key: "studentId",
      dataIndex: "studentId",
      title: "学生ID",
    },
    {
      key: "longitude",
      dataIndex: "longitude",
      title: "经度",
    },
    {
      key: "latitude",
      dataIndex: "latitude",
      title: "纬度",
    },
  ];
  useEffect(() => {
    getList(delParams(fields));
  }, []);

  const [listData, setListData] = useState([]);
  const [reslistNum, setReslistNum] = useState(0);

  const [fields, setFields] = useState({
    pageSize: 1,
    pageNumber: 10,
    longitude: "", //经度
    latitude: "", //纬度
    studentName: "", //学生名字
  });
  async function getList(params) {
    let res = await signList(params);
    if (res && res.code === 1000) {
      setListData(res.data.list);
      setReslistNum(res.data.total);
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
              <Item label="经度">
                {getFieldDecorator("longitude", {
                  initialValue: fields.longitude,
                })(<Input placeholder="" />)}
              </Item>
            </Col>
            <Col span={6}>
              <Item label="纬度">
                {getFieldDecorator("latitude", {
                  initialValue: fields.latitude,
                })(<Input placeholder="" />)}
              </Item>
            </Col>
            <Col span={6}>
              <Item label="学生姓名">
                {getFieldDecorator("studentName", {
                  initialValue: fields.studentName,
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
        dataSource={listData}
        pageSize={fields.pageNumber}
        page={fields.pageSize}
        total={reslistNum}
        pageBtnChange={pageChange}
      />
    </div>
  );
};

export default Form.create({ name: "horizontal_login" })(SignList);
