import React from "react";
import { Form, Icon, Input, Button, Checkbox, Card, message } from "antd";
import { setToken, setHeaders } from "../utils/auth";
import { loginApi } from "./admin/api/index";
import "./login.css";

function Login(props) {
  const { getFieldDecorator } = props.form;
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields(async (err, values) => {
      if (!err) {
        let res = await loginApi({
          account: values.username,
          password: values.password
        });
        if (res && res.code === 1000) {
          setToken(
            {
              account: values.username,
              password: values.password
            },
            res.data.role
          );
          console.log(res.data.id);
          setHeaders(res.data.id);
          message.success("登录成功");
          props.history.push("/admin/dashboard");
        } else if (res && res.msg) {
          message.info(res.msg);
        } else {
          message.error("网络错误");
        }
      }
    });
  };
  return (
    <Card title="学生管理" className="login-form">
      <Form onSubmit={e => handleSubmit(e)}>
        <Form.Item>
          {getFieldDecorator("username", {
            rules: [{ required: true, message: "请输入用户名!" }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="用户名"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "请输入密码!" }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="密码"
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            登录
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default Form.create({ name: "loginForm" })(Login);
