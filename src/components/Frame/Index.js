import React, { useEffect, useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { Layout, Menu, Icon, Dropdown, message, Badge } from "antd";
import { connect } from "react-redux";
import { adminRoutes } from "../../routes";
import "./frame.css";
import { clearToken, getUser } from "@utils/auth";
import { classifyRole } from "@utils/role";
import AMap from "AMap";
import { sign } from "../../pages/admin/api";

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;
const routes = adminRoutes.filter((route) => route.isShow);
var map;
function Index(props) {
  useEffect(() => {
    map = new AMap.Map("container", {
      resizeEnable: true,
    });
  }, []);
  async function start_day() {
    console.log(map.getCenter());
    //Q 为维度    为精度
    let res = await sign({
      longitude: map.getCenter().R,
      latitude: map.getCenter().Q,
    });
    if (res && res.code === 1000) {
      message.success("签到成功");
    } else if (res && res.msg) {
      message.info(res.msg);
    }
  }

  const popMenu = (
    <Menu
      onClick={(p) => {
        if (p.key == "logOut") {
          clearToken();
          props.history.push("/login");
        } else {
          if ((p.key = "register")) {
          }
        }
      }}
    >
      <Menu.Item key="logOut">退出</Menu.Item>
      {getUser() === "0" ? (
        <Menu.Item key="register" onClick={start_day}>
          签到
        </Menu.Item>
      ) : (
        ""
      )}
    </Menu>
  );

  return (
    <Layout>
      <Header
        className="header"
        style={{
          backgroundColor: "#428bca",
        }}
      >
        <Dropdown overlay={popMenu}>
          <div style={{ cursor: "pointer" }}>
            <Badge>
              <span style={{ color: "#fff" }}>{classifyRole(getUser())}</span>
            </Badge>
            <Icon type="down" />
          </div>
        </Dropdown>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: "#fff" }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={[props.location.pathname]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
          >
            {routes.map((route) => {
              return (
                <Menu.Item
                  key={route.path}
                  onClick={(p) => props.history.push(p.key)}
                >
                  <Icon type={route.icon} />
                  {route.title}
                </Menu.Item>
              );
            })}
            <SubMenu
              key="1"
              title={
                <span>
                  <Icon type="container" />
                  <span>住宿信息</span>
                </span>
              }
            >
              <Menu.Item key="10">
                <Link to="/admin/roundsPage">查夜情况列表</Link>
              </Menu.Item>
              {/* <Menu.Item key="11">
                <Link to="/admin/releaseNight">宿舍学生信息</Link>
              </Menu.Item> */}
            </SubMenu>
          </Menu>
        </Sider>
        <Layout style={{ padding: "16px" }}>
          <Content
            style={{
              background: "#fff",
              margin: 0,
              minHeight: 280,
            }}
          >
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

const mapStateToProps = (state) => state.notice;

export default connect(mapStateToProps)(withRouter(Index));
