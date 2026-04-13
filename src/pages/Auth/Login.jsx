import { Card, Input, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem("token", "loggedin");
    navigate("/dashboard");
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg,#6366f1,#8b5cf6)"
    }}>
      <Card style={{ width: 350, borderRadius: 12 }}>
        <Title level={3} style={{ textAlign: "center" }}>
          Login
        </Title>

        <Input placeholder="Email" style={{ marginBottom: 12 }} />
        <Input.Password placeholder="Password" style={{ marginBottom: 16 }} />

        <Button type="primary" block onClick={handleLogin}>
          Login
        </Button>
      </Card>
    </div>
  );
};

export default Login;