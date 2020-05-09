import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form, Input, DatePicker, Button, message } from "antd";
import moment from "moment";
import TextArea from "antd/lib/input/TextArea";
import { saveGrade } from "../api";
const { Item } = Form;
const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
  },
};
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
const EditModal = ({ form, fields, setFields, getList, setEditShow }) => {
  const { getFieldDecorator } = form;
  useEffect(() => {
    form.validateFields();
  }, []);

  function saleDateChange(e) {
    //请假时间截至
    setFields({
      ...fields,
      startDate: e[0].valueOf(),
      endDate: e[1].valueOf(),
    });
  }
  function sonSubmit(e) {
    e.preventDefault();
    form.validateFields(async (err, values) => {
      if (!err) {
        console.log(values);
        console.log(fields);
        let res = await saveGrade({
          ...fields,
          ...values,
        });
        if (res && res.code === 1000) {
          message.success("录入成功");
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
    <Card>
      <Form {...formItemLayout} onSubmit={sonSubmit}>
        <Row gutter={[24, 24]} type="flex" justify="start">
          <Col span={12}>
            <Item label="学生ID">
              {getFieldDecorator("studentId", {
                initialValue: fields.studentId,
              })(<Input placeholder="" />)}
            </Item>
          </Col>
          <Col span={12}>
            <Item label="学生姓名">
              {getFieldDecorator("name", {
                initialValue: fields.name,
              })(<Input placeholder="" />)}
            </Item>
          </Col>
          <Col span={12}>
            <Item label="学号">
              {getFieldDecorator("code", {
                initialValue: fields.code,
              })(<Input placeholder="" />)}
            </Item>
          </Col>
          <Col span={12}>
            <Item label="负责老师ID">
              {getFieldDecorator("teacherId", {
                initialValue: fields.teacherId,
              })(<Input placeholder="" />)}
            </Item>
          </Col>
          <Col span={12}>
            <Item label="负责老师名字">
              {getFieldDecorator("teacherName", {
                initialValue: fields.teacherName,
              })(<Input placeholder="" />)}
            </Item>
          </Col>
          <Col span={12}>
            <Item label="公司名称">
              {getFieldDecorator("company", {
                initialValue: fields.company,
              })(<Input placeholder="" />)}
            </Item>
          </Col>
          <Col span={12}>
            <Item label="岗位">
              {getFieldDecorator("post", {
                initialValue: fields.post,
              })(<Input placeholder="" />)}
            </Item>
          </Col>
          <Col span={12}>
            <Item label="薪资">
              {getFieldDecorator("salary", {
                initialValue: fields.salary,
              })(<Input placeholder="" />)}
            </Item>
          </Col>
          <Col span={24}>
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
          <Col span={24}>
            <Item label="备注" labelCol={{ span: 6 }}>
              {getFieldDecorator("comment", {
                initialValue: fields.comment,
              })(<TextArea />)}
            </Item>
          </Col>
          <Col span={5} offset={19}>
            <Button size="large" type="primary" htmlType="submit">
              录入
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default Form.create({ name: "horizontal_login" })(EditModal);
