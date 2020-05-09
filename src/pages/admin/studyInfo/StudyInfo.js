import React, { useEffect, useState } from "react";
import { getPro, modifyPro, produceCour } from "../api";
import { classifyRole } from "@utils/role";
import {
  message,
  Table,
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
} from "antd";
const { Item } = Form;
const formItemLayout = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
  },
};
const StudyInfo = ({ form }) => {
  const { getFieldDecorator, setFieldsValue } = form;
  const columns = [
    {
      title: "课程ID",
      key: "id",
      dataIndex: "id",
    },
    {
      title: "课程名称",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "总分",
      key: "grossScore",
      dataIndex: "grossScore",
    },
    {
      title: "总学分",
      key: "grossPoint",
      dataIndex: "grossPoint",
    },
    {
      title: "优秀学分",
      key: "excellentPoint",
      dataIndex: "excellentPoint",
    },
    {
      title: "及格学分",
      key: "passPoint",
      dataIndex: "passPoint",
    },
    {
      title: "不及格学分",
      key: "failPoint",
      dataIndex: "failPoint",
    },
    {
      title: "不及格学分",
      key: "deleted",
      dataIndex: "deleted",
      render: (text) => {
        return <span>{text ? "已删除" : "未删除"}</span>;
      },
    },
    {
      title: "成绩列表",
      key: "ddd",
      dataIndex: "id",
      render: (text) => {
        return (
          <span
            onClick={async () => {
              let res = await produceCour({
                id: text,
              });
              if (res && res.code === 0) {
                message.success("生成成功");
              } else if (res && res.msg) {
                message.info(res.msg);
              }
            }}
            style={{
              color: "#1890ff",
              cursor: "pointer",
            }}
          >
            生成成绩列表
          </span>
        );
      },
    },
    {
      title: "操作",
      key: "action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <>
            <span
              style={{
                color: "#1890ff",
                cursor: "pointer",
                marginRight: "10px",
              }}
              onClick={() => {
                setShowModal(true);
                setFields({
                  id: record.id,
                  name: record.name, //课程名称
                  grossScore: record.grossScore, //课程总分
                  grossPoint: record.grossPoint, //总学分
                  failPoint: record.failPoint, //不及格学分
                  passPoint: record.passPoint, //及格学分
                  excellentPoint: record.excellentPoint, //优秀学分
                  deleted: record.deleted,
                });
              }}
            >
              修改
            </span>
            <span
              style={{ color: "red", cursor: "pointer" }}
              onClick={async () => {
                let res = await modifyPro({
                  id: record.id,
                  name: record.name, //课程名称
                  grossScore: record.grossScore, //课程总分
                  grossPoint: record.grossPoint, //总学分
                  failPoint: record.failPoint, //不及格学分
                  passPoint: record.passPoint, //及格学分
                  excellentPoint: record.excellentPoint, //优秀学分
                  deleted: true,
                });
                if (res && res.code === 1000) {
                  message.success("删除成功");
                  getList(pageList);
                }
              }}
            >
              删除
            </span>
          </>
        );
      },
    },
  ];
  //宿舍信息
  const [dorList, setDorList] = useState([]);
  const [reslistNum, setReslistNum] = useState(0);
  const [pageList, setPageList] = useState({
    pageSize: 1,
    pageNumber: 10,
  });

  const [fields, setFields] = useState({
    id: null,
    name: "", //课程名称
    grossScore: "", //课程总分
    grossPoint: "", //总学分
    failPoint: "", //不及格学分
    passPoint: "", //及格学分
    excellentPoint: "", //优秀学分
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getList(pageList);
  }, []);

  function pageChange(page) {
    //页码变换
    setPageList({
      ...pageList,
      pageNumber: page,
    });
    getList({
      ...pageList,
      pageNumber: page,
    });
  }

  function handleSubmit(e) {
    //表单提交事件
    e.preventDefault();
    form.validateFields(async (err, values) => {
      if (!err) {
        let paramsFields = { ...fields };
        let {
          name,
          grossScore,
          grossPoint,
          failPoint,
          passPoint,
          excellentPoint,
        } = values;

        if (!name) {
          message.info("请输入课程名称");
          return;
        }
        if (!grossScore) {
          message.info("请输入课程总分");
          return;
        }
        if (!grossPoint) {
          message.info("请输入总学分");
          return;
        }
        if (!failPoint) {
          message.info("请输入不及格学分");
          return;
        }
        if (!passPoint) {
          message.info("请输入及格学分");
          return;
        }
        if (!excellentPoint) {
          message.info("请输入优秀学分");
          return;
        }
        let res = await modifyPro({ ...paramsFields, ...values });
        if (res && res.code === 1000) {
          message.success("添加成功");
          setShowModal(false);
          getList(pageList);
        } else if (res && res.msg) {
          message.error(res.msg);
        }
      }
    });
  }

  async function getList(params) {
    let res = await getPro(params);
    if (res.code === 1000) {
      setDorList(res.data.list);
      setReslistNum(res.data.total);
    } else if (res && res.msg) {
      message.info(res.msg);
    } else {
      message.error("网络错误");
    }
  }

  return (
    <div>
      <Card>
        <Row gutter={[24, 24]} type="flex" justify="start" align="middle">
          <Col span={24}>
            <Button
              type={"primary"}
              onClick={() => {
                setFields({
                  ...fields,
                  id: null,
                });
                setFieldsValue({
                  name: "", //课程名称
                  grossScore: "", //课程总分
                  grossPoint: "", //总学分
                  failPoint: "", //不及格学分
                  passPoint: "", //及格学分
                  excellentPoint: "", //优秀学分
                });
                setShowModal(true);
              }}
            >
              录入课程信息
            </Button>
          </Col>
        </Row>
      </Card>
      <Table
        columns={columns}
        rowKey={(record) => {
          return record.id;
        }}
        page={pageList.pageNumber}
        paginationProps={pageChange}
        dataSource={dorList}
        total={reslistNum}
      />
      <Modal
        className="edit_wrapper"
        visible={showModal}
        footer={null}
        onCancel={() => {
          setShowModal(false);
        }}
      >
        <Card>
          <Form {...formItemLayout} onSubmit={handleSubmit}>
            <Row gutter={[24, 24]} type="flex" justify="start" align="middle">
              <Col span={12}>
                <Item label={"课程名称"}>
                  {getFieldDecorator("name", {
                    initialValue: fields.name,
                  })(<Input placeholder="" />)}
                </Item>
              </Col>
              <Col span={12}>
                <Item label={"课程总分"}>
                  {getFieldDecorator("grossScore", {
                    initialValue: fields.grossScore,
                  })(<Input placeholder="" />)}
                </Item>
              </Col>
              <Col span={12}>
                <Item label={"总学分"}>
                  {getFieldDecorator("grossPoint", {
                    initialValue: fields.grossPoint,
                  })(<Input placeholder="" />)}
                </Item>
              </Col>
              <Col span={12}>
                <Item label={"不及格学分"}>
                  {getFieldDecorator("failPoint", {
                    initialValue: fields.failPoint,
                  })(<Input placeholder="" />)}
                </Item>
              </Col>
              <Col span={12}>
                <Item label={"及格学分"}>
                  {getFieldDecorator("passPoint", {
                    initialValue: fields.passPoint,
                  })(<Input placeholder="" />)}
                </Item>
              </Col>
              <Col span={12}>
                <Item label={"优秀学分"}>
                  {getFieldDecorator("excellentPoint", {
                    initialValue: fields.excellentPoint,
                  })(<Input placeholder="" />)}
                </Item>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button type={"primary"} htmlType="submit">
                  确认
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
    </div>
  );
};

export default Form.create({ name: "horizontal_login" })(StudyInfo);
