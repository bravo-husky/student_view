import React, { useEffect, useState } from "react";
import { getTeacher } from "../api";
import { classifyRole } from "@utils/role";
import { message, Table } from "antd";

const TeacherList = () => {
  const columns = [
    {
      title: "姓名",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "账号",
      key: "account",
      dataIndex: "account",
    },
    {
      title: "密码",
      key: "password",
      dataIndex: "password",
    },
    {
      title: "角色",
      key: "role",
      dataIndex: "role",
      render: (text) => {
        return classifyRole(String(text));
      },
    },
  ];
  //宿舍信息
  const [dorList, setDorList] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  async function getList() {
    let res = await getTeacher();
    if (res.code === 1000) {
      setDorList(res.data);
    } else if (res && res.msg) {
      message.info(res.msg);
    } else {
      message.error("网络错误");
    }
  }

  return (
    <div>
      <Table
        columns={columns}
        rowKey={(record) => {
          return record.id;
        }}
        dataSource={dorList}
        pagination={false}
      />
    </div>
  );
};

export default TeacherList;
