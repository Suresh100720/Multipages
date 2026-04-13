import { Input, Select, Form, Button, Radio } from "antd";
import {
  UserOutlined, MailOutlined, BankOutlined,
  EnvironmentOutlined, GlobalOutlined, TrophyOutlined,
} from "@ant-design/icons";

const roleOptions = [
  { value: "Frontend Developer", label: "Frontend Developer" },
  { value: "Backend Developer", label: "Backend Developer" },
  { value: "UI/UX Designer", label: "UI/UX Designer" },
  { value: "AI/ML Developer", label: "AI/ML Developer" },
  { value: "Data Scientist", label: "Data Scientist" },
  { value: "DevOps Engineer", label: "DevOps Engineer" },
  { value: "QA Engineer", label: "QA Engineer" },
];

const experienceOptions = [
  { value: "Fresher", label: "Fresher" },
  { value: "1 Year", label: "1 Year" },
  { value: "2 Years", label: "2 Years" },
  { value: "3 Years", label: "3 Years" },
  { value: "4 Years", label: "4 Years" },
  { value: "5+ Years", label: "5+ Years" },
];

const CandidateForm = ({ form, onFinish, isEdit, darkMode = false }) => {
  /* ── Dynamic tokens based on dark mode ── */
  const inputBg    = darkMode ? "#0f172a" : "#fff";
  const inputColor = darkMode ? "#f1f5f9" : "#1e293b";
  const borderCol  = darkMode ? "#475569" : "#e2e8f0";
  const labelColor = darkMode ? "#94a3b8" : "#64748b";
  const iconColor  = darkMode ? "#64748b" : "#cbd5e1";
  const radioText  = darkMode ? "#cbd5e1" : "#1e293b";
  const btnResetCol = darkMode ? "#94a3b8" : "#64748b";

  const inputStyle = {
    borderRadius: 8,
    borderColor: borderCol,
    background: inputBg,
    color: inputColor,
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ status: "Active" }}
      className="p-0"
    >
      <div className="container-fluid p-0">
        <div className="row g-3">

          {/* Name & Email */}
          <div className="col-md-6">
            <Form.Item
              name="name"
              label={<span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: labelColor }}>Name</span>}
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: iconColor }} />}
                placeholder="Ex: John Doe"
                size="large"
                style={inputStyle}
              />
            </Form.Item>
          </div>

          <div className="col-md-6">
            <Form.Item
              name="email"
              label={<span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: labelColor }}>Email</span>}
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter a valid email address (e.g., name@example.com)" },
                { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Please include a valid domain (.com, .org etc.)" },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: iconColor }} />}
                placeholder="john@example.com"
                size="large"
                style={inputStyle}
              />
            </Form.Item>
          </div>

          {/* Role & Experience */}
          <div className="col-md-6">
            <Form.Item
              name="role"
              label={<span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: labelColor }}>Role</span>}
              rules={[{ required: true, message: "Role is required" }]}
            >
              <Select
                placeholder="Select role"
                size="large"
                options={roleOptions}
                suffixIcon={<BankOutlined style={{ color: iconColor }} />}
                style={{ borderRadius: 8 }}
                popupClassName={darkMode ? "dark-select-dropdown" : ""}
              />
            </Form.Item>
          </div>

          <div className="col-md-6">
            <Form.Item
              name="experience"
              label={<span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: labelColor }}>Experience</span>}
              rules={[{ required: true, message: "Experience is required" }]}
            >
              <Select
                placeholder="Select years"
                size="large"
                options={experienceOptions}
                suffixIcon={<TrophyOutlined style={{ color: iconColor }} />}
                style={{ borderRadius: 8 }}
                popupClassName={darkMode ? "dark-select-dropdown" : ""}
              />
            </Form.Item>
          </div>

          {/* Status */}
          <div className="col-12">
            <Form.Item
              name="status"
              label={<span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: labelColor }}>Current Status</span>}
              rules={[{ required: true, message: "Status is required" }]}
            >
              <Radio.Group style={{ display: "flex", gap: 20 }}>
                <Radio value="Active">
                  <span style={{ fontWeight: 500, color: radioText }}>Active</span>
                </Radio>
                <Radio value="Inactive">
                  <span style={{ fontWeight: 500, color: radioText }}>Inactive</span>
                </Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          {/* State & Country */}
          <div className="col-md-6">
            <Form.Item
              name="state"
              label={<span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: labelColor }}>State</span>}
              rules={[{ required: true, message: "State is required" }]}
            >
              <Input
                prefix={<EnvironmentOutlined style={{ color: iconColor }} />}
                placeholder="Ex: Karnataka"
                size="large"
                style={inputStyle}
              />
            </Form.Item>
          </div>

          <div className="col-md-6">
            <Form.Item
              name="country"
              label={<span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: labelColor }}>Country</span>}
              rules={[{ required: true, message: "Country is required" }]}
            >
              <Input
                prefix={<GlobalOutlined style={{ color: iconColor }} />}
                placeholder="Ex: India"
                size="large"
                style={inputStyle}
              />
            </Form.Item>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="row mt-4">
          <div className="col-12 d-flex justify-content-end gap-2">
            <Button
              size="large"
              type="text"
              onClick={() => form.resetFields()}
              style={{ borderRadius: 8, color: btnResetCol, fontWeight: 600 }}
            >
              Reset
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{
                borderRadius: 8,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                border: "none",
                fontWeight: 700,
                boxShadow: "0 4px 10px rgba(99,102,241,0.35)",
              }}
            >
              {isEdit ? "Update Candidate" : "Save Candidate"}
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default CandidateForm;
