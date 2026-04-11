import { Input, Select, Form, Button, message } from "antd";
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

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "New", label: "New" },
  { value: "Interviewing", label: "Interviewing" },
  { value: "Hired", label: "Hired" },
  { value: "Screening", label: "Screening" },
  { value: "Rejected", label: "Rejected" },
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
      initialValues={{ status: "New" }}
      className="p-1"
    >
      <div className="container-fluid p-0">
        <div className="row g-3">
          {/* Name & Email Field */}
          <div className="col-md-6">
            <Form.Item
              name="name"
              label={<span className="fw-bold text-secondary text-uppercase" style={{ fontSize: '11px' }}>Name</span>}
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input 
                prefix={<UserOutlined className="text-muted" />} 
                placeholder="Ex: John Doe" 
                size="large"
                className="rounded-3 border-light-subtle shadow-sm"
              />
            </Form.Item>
          </div>
          <div className="col-md-6">
            <Form.Item
              name="email"
              label={<span className="fw-bold text-secondary text-uppercase" style={{ fontSize: '11px' }}>Email</span>}
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
                prefix={<MailOutlined className="text-muted" />} 
                placeholder="john@example.com" 
                size="large"
                className="rounded-3 border-light-subtle shadow-sm"
              />
            </Form.Item>
          </div>

          {/* Role & Experience */}
          <div className="col-md-6">
            <Form.Item
              name="role"
              label={<span className="fw-bold text-secondary text-uppercase" style={{ fontSize: '11px' }}>Role</span>}
              rules={[{ required: true, message: "Role selection is required" }]}
            >
              <Select
                placeholder="Select role"
                size="large"
                className="shadow-sm custom-select-clean"
                options={roleOptions}
                suffixIcon={<BankOutlined className="text-muted" />}
              />
            </Form.Item>
          </div>
          <div className="col-md-6">
            <Form.Item
              name="experience"
              label={<span className="fw-bold text-secondary text-uppercase" style={{ fontSize: '11px' }}>Experience</span>}
              rules={[{ required: true, message: "Experience is required" }]}
            >
              <Select
                placeholder="Select years"
                size="large"
                className="shadow-sm custom-select-clean"
                options={experienceOptions}
                suffixIcon={<TrophyOutlined className="text-muted" />}
              />
            </Form.Item>
          </div>

          {/* Status */}
          <div className="col-12">
            <Form.Item
              name="status"
              label={<span className="fw-bold text-secondary text-uppercase" style={{ fontSize: '11px' }}>Current Status</span>}
              rules={[{ required: true, message: "Status is required" }]}
            >
              <Select 
                placeholder="Current processing status" 
                size="large"
                className="shadow-sm"
                options={statusOptions} 
              />
            </Form.Item>
          </div>

          {/* Location Details */}
          <div className="col-md-6">
            <Form.Item
              name="state"
              label={<span className="fw-bold text-secondary text-uppercase" style={{ fontSize: '11px' }}>State</span>}
              rules={[{ required: true, message: "State is required" }]}
            >
              <Input 
                prefix={<EnvironmentOutlined className="text-muted" />} 
                placeholder="Ex: Karnataka" 
                size="large"
                className="rounded-3 border-light-subtle shadow-sm"
              />
            </Form.Item>
          </div>
          <div className="col-md-6">
            <Form.Item
              name="country"
              label={<span className="fw-bold text-secondary text-uppercase" style={{ fontSize: '11px' }}>Country</span>}
              rules={[{ required: true, message: "Country is required" }]}
            >
              <Input 
                prefix={<GlobalOutlined className="text-muted" />} 
                placeholder="Ex: India" 
                size="large"
                className="rounded-3 border-light-subtle shadow-sm"
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
              className="fw-semibold text-secondary"
              onClick={() => form.resetFields()}
              style={{ borderRadius: '8px' }}
            >
              Reset Form
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="px-4 shadow"
              style={{ 
                borderRadius: '8px',
                background: '#1e293b',
                border: 'none',
                fontWeight: 'bold'
              }}
            >
              {isEdit ? "Update Details" : "Save Candidate"}
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default CandidateForm;
