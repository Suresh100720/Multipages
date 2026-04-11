import { Spin } from "antd";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center p-10">
      <Spin size="large" />
    </div>
  );
};

export default LoadingSpinner;