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

/**
 * Clean, professional Candidate Form Component.
 * Uses Bootstrap for layout and Ant Design for inputs and validation.
 */
const CandidateForm = ({ form, onFinish, isEdit }) => {
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
          {/* Name & Email Field */}
          <div className="col-md-6">
            <Form.Item
              name="name"
              label={<span className="fw-bold text-uppercase" style={{ fontSize: '11px', color: "#64748b" }}>Name</span>}
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input 
                prefix={<UserOutlined style={{ color: "#cbd5e1" }} />} 
                placeholder="Ex: John Doe" 
                size="large"
                style={{ borderRadius: '8px', borderColor: "#e2e8f0", background: '#fff', color: '#1e293b' }}
              />
            </Form.Item>
          </div>
          <div className="col-md-6">
            <Form.Item
              name="email"
              label={<span className="fw-bold text-uppercase" style={{ fontSize: '11px', color: "#64748b" }}>Email</span>}
              rules={[
                { required: true, message: "Email is required" },
                { 
                  type: "email", 
                  message: "Enter a valid email address (e.g., name@example.com)" 
                },
                {
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please include a valid domain (e.g. .com, .org)"
                }
              ]}
            >
              <Input 
                prefix={<MailOutlined style={{ color: "#cbd5e1" }} />} 
                placeholder="john@example.com" 
                size="large"
                style={{ borderRadius: '8px', borderColor: "#e2e8f0", background: '#fff', color: '#1e293b' }}
              />
            </Form.Item>
          </div>

          {/* Role & Experience */}
          <div className="col-md-6">
            <Form.Item
              name="role"
              label={<span className="fw-bold text-uppercase" style={{ fontSize: '11px', color: "#64748b" }}>Role</span>}
              rules={[{ required: true, message: "Role selection is required" }]}
            >
              <Select
                placeholder="Select role"
                size="large"
                style={{ borderRadius: '8px', background: '#fff' }}
                options={roleOptions}
                suffixIcon={<BankOutlined style={{ color: "#cbd5e1" }} />}
              />
            </Form.Item>
          </div>
          <div className="col-md-6">
            <Form.Item
              name="experience"
              label={<span className="fw-bold text-uppercase" style={{ fontSize: '11px', color: "#64748b" }}>Experience</span>}
              rules={[{ required: true, message: "Experience is required" }]}
            >
              <Select
                placeholder="Select years"
                size="large"
                style={{ borderRadius: '8px', background: '#fff' }}
                options={experienceOptions}
                suffixIcon={<TrophyOutlined style={{ color: "#cbd5e1" }} />}
              />
            </Form.Item>
          </div>

          {/* Status - Radio Buttons */}
          <div className="col-12">
            <Form.Item
              name="status"
              label={<span className="fw-bold text-uppercase" style={{ fontSize: '11px', color: "#64748b" }}>Current Status</span>}
              rules={[{ required: true, message: "Status is required" }]}
            >
              <Radio.Group
                options={[
                  { label: <span style={{ fontWeight: 500, color: "#1e293b" }}>Active</span>, value: "Active" },
                  { label: <span style={{ fontWeight: 500, color: "#1e293b" }}>Inactive</span>, value: "Inactive" },
                ]}
                style={{ display: "flex", gap: "20px" }}
              />
            </Form.Item>
          </div>

          {/* Location Details */}
          <div className="col-md-6">
            <Form.Item
              name="state"
              label={<span className="fw-bold text-uppercase" style={{ fontSize: '11px', color: "#64748b" }}>State</span>}
              rules={[{ required: true, message: "State is required" }]}
            >
              <Input 
                prefix={<EnvironmentOutlined style={{ color: "#cbd5e1" }} />} 
                placeholder="Ex: Karnataka" 
                size="large"
                style={{ borderRadius: '8px', borderColor: "#e2e8f0", background: '#fff', color: '#1e293b' }}
              />
            </Form.Item>
          </div>
          <div className="col-md-6">
            <Form.Item
              name="country"
              label={<span className="fw-bold text-uppercase" style={{ fontSize: '11px', color: "#64748b" }}>Country</span>}
              rules={[{ required: true, message: "Country is required" }]}
            >
              <Input 
                prefix={<GlobalOutlined style={{ color: "#cbd5e1" }} />} 
                placeholder="Ex: India" 
                size="large"
                style={{ borderRadius: '8px', borderColor: "#e2e8f0", background: '#fff', color: '#1e293b' }}
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
              className="fw-semibold"
              onClick={() => form.resetFields()}
              style={{ borderRadius: '8px', color: '#64748b' }}
            >
              Reset
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="px-4 shadow"
              style={{ 
                borderRadius: '8px',
                background: '#1890ff',
                border: 'none',
                fontWeight: 'bold',
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
