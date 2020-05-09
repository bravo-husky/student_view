import React, { Fragment, useState, useEffect } from "react";
import { time_stamp } from "@utils/timeFormatter";
import "./AskLeave.css";
import {
  Input,
  Form,
  Row,
  Col,
  DatePicker,
  Button,
  Popconfirm,
  message
} from "antd";
import moment from "moment";
import { askLeaveApi } from "../api";
const { TextArea } = Input;
const { Item } = Form;
const { RangePicker } = DatePicker;
const AskLeave = ({ history }) => {
  const [val, setVal] = useState("");
  const [duration, setDuration] = useState([]);
  function textChange({ target: { value } }) {
    setVal(value);
  }

  function saleDateChange(e) {
    //请假时间截至
    setDuration([e[0].valueOf(), e[1].valueOf()]);
  }

  async function confirm() {
    //确认提交
    if (!val) {
      message.error("请输入请假理由");
      return;
    }
    if (duration.length !== 2) {
      message.error("请输入请假起止时间");
      return;
    }
    let res = await askLeaveApi({
      context: val,
      startTime: time_stamp(duration[0]),
      endTime: time_stamp(duration[1]),
      createTime: time_stamp(new Date().getTime())
    });
    if (res && res.code === 1000) {
      message.success("申请成功");
      history.goBack();
    } else if (res && res.msg) {
      message.info(res.msg);
    } else {
      message.error("网络错误");
    }
  }
  return (
    <div className="ask_leave_wrapper">
      <h3>请假条</h3>
      <TextArea
        placeholder="请输入请假理由..."
        className="text_area"
        value={val}
        onChange={textChange}
        autoSize={{ minRows: 10 }}
      />
      <Row
        gutter={[24, 24]}
        type="flex"
        justify="center"
        style={{ marginBottom: "30px" }}
      >
        <Col span={12}>
          <Item label="请假起止时间" labelCol={{ span: 6 }}>
            <RangePicker
              className="date_picker"
              locale="ch"
              showTime={{
                defaultValue: [
                  moment("00:00:00", "HH:mm:ss"),
                  moment("11:59:59", "HH:mm:ss")
                ]
              }}
              onChange={saleDateChange}
            />
          </Item>
        </Col>
      </Row>
      <Row gutter={[24, 24]} type="flex" justify="center">
        <Col span={12} push={5}>
          <Popconfirm
            placement="topLeft"
            title="确定提交吗"
            onConfirm={confirm}
            okText="确定"
            cancelText="取消"
          >
            <Button size="large" type="primary">
              提交
            </Button>
          </Popconfirm>
        </Col>
      </Row>
    </div>
  );
};

export default AskLeave;
