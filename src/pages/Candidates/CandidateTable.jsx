import { Table, Tag, Avatar, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const CandidateTable = ({
  data,
  selectedKeys,
  setSelectedKeys,
  onDelete,
  onEdit,
}) => {
  const columns = [
    {
      title: "Candidate",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar className="bg-blue-500">
            {row.name?.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <p className="font-semibold">{row.name}</p>
            <p className="text-gray-500 text-sm">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Status",
      render: (_, row) => (
        <Tag color={row.status === "Active" ? "green" : "red"}>
          {row.status}
        </Tag>
      ),
    },
    {
      title: "Location",
      render: (_, row) => `${row.state}, ${row.country}`,
    },
    {
      title: "Experience",
      dataIndex: "experience",
    },
    {
      title: "Actions",
      render: (_, row) => (
        <div className="flex gap-4">
          <Tooltip title="Edit">
            <EditOutlined
              onClick={() => onEdit(row)}
              className="text-blue-500 cursor-pointer"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlined
              onClick={() => onDelete(row._id)}
              className="text-red-500 cursor-pointer"
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Table
      rowKey="_id"
      dataSource={data}
      columns={columns}
      pagination={{ pageSize: 5 }}
      rowSelection={{
        selectedRowKeys: selectedKeys,
        onChange: setSelectedKeys,
      }}
      className="bg-white rounded-lg shadow"
    />
  );
};

export default CandidateTable;