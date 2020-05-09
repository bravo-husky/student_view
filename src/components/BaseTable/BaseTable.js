import React, { Fragment, Component, PureComponent } from "react";
import { Table } from "antd";
import "./BaseTable.less";
//分页器
const paginationProps = {
  pageSize: 10,
  showQuickJumper: true,
  defaultCurrent: 1
};
const rowSelection = {
  getCheckboxProps: record => ({
    disabled: record.name === "Disabled User", // Column configuration not to be checked
    name: record.name
  })
};
class BaseTable extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    paginationProps.pageSize = this.props.pageSize;
    paginationProps.defaultCurrent = this.props.page;
    paginationProps.onChange = current => {
      //页码变化
      this.props.pageBtnChange(current);
    };
    rowSelection.onChange = (selectedRowKeys, selectedRows) => {
      //被选择的数据
      this.props.selectRow(selectedRows);
    };
  }

  render() {
    let { dataSource, border, columns, loading, rowKey } = this.props;
    //是否显示选择，true可以选择，false或不传则不选择
    let isRowSelection = this.props.rowSelection;
    if (paginationProps.pageSize !== this.props.pageSize) {
      paginationProps.pageSize = this.props.pageSize;
    }
    if (paginationProps.current !== this.props.page) {
      paginationProps.current = this.props.page;
    }
    if (this.props.total >= 0) {
      paginationProps.total = this.props.total;
    }
    return (
      <Fragment>
        <Table
          loading={loading}
          bordered={border}
          dataSource={dataSource}
          rowSelection={isRowSelection ? rowSelection : isRowSelection}
          rowKey={rowKey || (record => record.id || record.userId)}
          columns={columns}
          pagination={paginationProps}
          scroll={{ y: 700 }}
          className="base-table"
        />
      </Fragment>
    );
  }
}
export default BaseTable;
