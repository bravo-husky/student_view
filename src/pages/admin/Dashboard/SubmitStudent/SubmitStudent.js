import React, { useState, Fragment, useEffect } from "react";
import {
  Col,
  Row,
  Card,
  Input,
  Form,
  Select,
  Button,
  Switch,
  message,
} from "antd";
import "./SubmitStudent.css";
import { saveStudent, studentDormitoryList, getClassList } from "../../api";
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

const SubmitStudent = ({ form, history, location }) => {
  let { query } = location;

  const { getFieldDecorator } = form;
  const [needParents, setNeedParents] = useState(false);
  const [dorList, setDorList] = useState([]);
  const [userData, setUserData] = useState([]);
  const [fields, setFields] = useState({
    name: "", //姓名
    // account: "", //账号
    password: "", //密码
    role: 0,
    code: "", //学号
    gender: 0, //性别
    phone: "",
    dormitoryId: "",
    classId: "",
    parents: {
      //父母信息
      phone: "",
      relation: 0,
      name: "",
    },
  });

  useEffect(() => {
    getIds();
    let params = {};
    if (query) {
      for (let i in fields) {
        if (i === "parents") {
          if (Array.isArray(query.parents) && query.parents.length > 0) {
            params.parents = query.parents[0];
          } else {
            params.parents = {
              //父母信息
              phone: "",
              relation: 0,
              name: "",
            };
          }
        } else {
          params[i] = query[i];
        }
      }
      setFields({
        ...fields,
        ...params,
      });
    }
  }, []);

  async function getIds() {
    let res = await studentDormitoryList();
    if (res.code === 1000) {
      setDorList(res.data);
    }
    let ces = await getClassList({ pageSize: 1000, pageNumber: 1 });
    if (ces && ces.code === 1000 && ces.data) {
      setUserData(ces.data.list);
    }
  }
  function handleSubmit(e) {
    //表单提交事件
    e.preventDefault();
    form.validateFields(async (err, values) => {
      let { query } = location;
      if (!err) {
        let {
            account,
            code,
            password,
            name,
            phone,
            dormitoryId,
            classId,
          } = values,
          { parents } = fields,
          reqParams;
        // if (!account) {
        //   message.info("请输入学生账号");
        //   return;
        // }
        if (!code) {
          message.info("请输入学生学号");
          return;
        }
        if (!password) {
          message.info("请输入学生密码");
          return;
        }
        if (!name) {
          message.info("请输入学生名字");
          return;
        }
        if (!phone) {
          message.info("请输入学生手机号");
          return;
        }
        if (!dormitoryId) {
          message.info("请输入学生宿舍ID");
          return;
        }
        if (!classId) {
          message.info("请输入学生班级ID");
          return;
        }
        setFields({
          ...fields,
          ...values,
        });
        reqParams = { ...fields, ...values };

        if (needParents) {
          //需要父母信息的情况
          if (!parents.phone) {
            message.info("请输入父母手机号");
            return;
          }
          if (!parents.name) {
            message.info("请输入父母姓名");
            return;
          }
          reqParams = {
            ...reqParams,
            parents: [reqParams.parents],
          };
        } else {
          delete reqParams.parents;
        }
        console.log(query);
        if (query) {
          reqParams.studentId = query.studentId;
          reqParams.userId = query.userId;
        }

        let res = await saveStudent(reqParams);
        if (res && res.code === 1000) {
          message.success("保存成功");
          history.goBack();
        } else if (res && res.msg) {
          message.success(res.msg);
        } else {
          message.success("网络错误");
        }
      }
    });
  }

  function cardTitle() {
    return (
      <Fragment>
        <span>父母信息：</span>
        <Switch
          checked={needParents}
          onChange={(e) => {
            setNeedParents(e);
          }}
        />
      </Fragment>
    );
  }

  return (
    <div className="submit_wrapper">
      <h3>学生信息编辑</h3>
      <Form {...formItemLayout} onSubmit={handleSubmit}>
        <Card style={{ marginBottom: "30px" }}>
          <Row gutter={[24, 24]} type="flex" justify="start">
            <Col span={8}>
              <Item label="姓名">
                {getFieldDecorator("name", { initialValue: fields.name })(
                  <Input placeholder="" />
                )}
              </Item>
            </Col>
            {/* <Col span={8}>
              <Item label="账号">
                {getFieldDecorator("account", { initialValue: fields.account })(
                  <Input placeholder="" />
                )}
              </Item>
            </Col> */}
            <Col span={8}>
              <Item label="密码">
                {getFieldDecorator("password", {
                  initialValue: fields.password,
                })(<Input placeholder="" />)}
              </Item>
            </Col>
          </Row>
          <Row gutter={[24, 24]} type="flex" justify="start">
            <Col span={8}>
              <Item label="性别">
                {getFieldDecorator("gender", {
                  initialValue: fields.gender,
                })(
                  <Select style={{ width: "100px" }}>
                    <Option value={0}>男</Option>
                    <Option value={1}>女</Option>
                  </Select>
                )}
              </Item>
            </Col>
            <Col span={8}>
              <Item label="角色">
                {getFieldDecorator("role", {
                  initialValue: fields.role,
                })(
                  <Select style={{ width: "200px" }}>
                    <Option value={0}>学生</Option>
                    <Option value={1}>班主任</Option>
                    <Option value={2}>管理员</Option>
                    <Option value={3}>超级管理员</Option>
                  </Select>
                )}
              </Item>
            </Col>
            <Col span={8}>
              <Item label="学号">
                {getFieldDecorator("code", {
                  initialValue: fields.code,
                })(<Input placeholder="" />)}
              </Item>
            </Col>
            <Col span={8}>
              <Item label="手机号">
                {getFieldDecorator("phone", {
                  initialValue: fields.phone,
                })(<Input placeholder="" />)}
              </Item>
            </Col>
            <Col span={8}>
              <Item label="班级">
                {getFieldDecorator("classId", {
                  initialValue: fields.classId,
                })(
                  <Select>
                    {userData.map((item, index) => {
                      return (
                        <Option value={item.id} key={index}>
                          {item.code}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Item>
            </Col>
            <Col span={8}>
              <Item label="宿舍编号">
                {getFieldDecorator("dormitoryId", {
                  initialValue: fields.dormitoryId,
                })(
                  <Select>
                    {dorList.map((item, index) => {
                      return (
                        <Option value={item.id} key={index}>
                          {item.code}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Item>
            </Col>
          </Row>
        </Card>
        {/* <Card title={cardTitle()}>
          <Row gutter={[24, 24]} type="flex" justify="start">
            <Col span={8}>
              <Item label="家长姓名">
                <Input
                  value={fields.parents.name}
                  onChange={(e) => {
                    let { parents } = fields;
                    parents.name = e.target.value;
                    setFields({
                      ...fields,
                      parents: JSON.parse(JSON.stringify(parents)),
                    });
                  }}
                />
              </Item>
            </Col>

            <Col span={8}>
              <Item label="手机号">
                <Input
                  value={fields.parents.phone}
                  onChange={(e) => {
                    let { parents } = fields;
                    parents.phone = e.target.value;
                    setFields({
                      ...fields,
                      parents: JSON.parse(JSON.stringify(parents)),
                    });
                  }}
                />
              </Item>
            </Col>
            <Col span={8}>
              <Item label="关系">
                <Select
                  style={{ width: "100px" }}
                  value={fields.parents.relation}
                  onChange={(e) => {
                    let { parents } = fields;
                    parents.relation = e;
                    setFields({
                      ...fields,
                      parents: JSON.parse(JSON.stringify(parents)),
                    });
                  }}
                >
                  <Option value={0}>父亲</Option>
                  <Option value={1}>母亲</Option>
                </Select>
              </Item>
            </Col>
          </Row>
        </Card> */}

        <div className="btn_wrapper">
          <Button size="large" type="primary" htmlType="submit">
            提交
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Form.create({ name: "horizontal_login" })(SubmitStudent);
