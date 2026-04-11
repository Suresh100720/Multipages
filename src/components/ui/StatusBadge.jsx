import { Tag } from "antd";

const StatusBadge = ({ status }) => {
  return (
    <Tag color={status === "Active" ? "green" : "red"}>
      {status}
    </Tag>
  );
};

export default StatusBadge;