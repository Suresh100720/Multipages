import { Modal, Form, Input, Select, Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { addCandidate } from "../../services/api";

const skillOptions = [
  { value: "React", label: "React" },
  { value: "Node.js", label: "Node.js" },
  { value: "JavaScript", label: "JavaScript" },
  { value: "Python", label: "Python" },
  { value: "UI/UX Design", label: "UI/UX Design" },
  { value: "Project Management", label: "Project Management" },
  { value: "DevOps", label: "DevOps" },
];

const ApplyJobModal = ({ open, setOpen, job, darkMode }) => {
  const [form] = Form.useForm();

  /* ── Submit Logic ── */
  const handleFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("experience", values.experience);
      formData.append("country", values.country || "");
      formData.append("state", values.state || "");
      formData.append("role", job.roleName);
      formData.append("status", "Active");

      if (values.skills) {
        formData.append("skills", JSON.stringify(values.skills));
      }

      if (values.resume?.[0]?.originFileObj) {
        formData.append("resume", values.resume[0].originFileObj);
      }

      await addCandidate(formData);
      message.success("Application submitted successfully!");
      form.resetFields();
      setOpen(false);
    } catch (e) {
      console.error(e);
      message.error("Failed to submit application.");
    }
  };

  /* ── Cancel Logic ── */
  const handleCancel = () => {
    const isDirty = form.isFieldsTouched();

    if (!isDirty) {
      form.resetFields();
      setOpen(false);
      return;
    }

    Modal.confirm({
      title: "Discard Application?",
      content: "Are you sure you want to cancel? Your details will not be saved.",
      okText: "Yes, Discard",
      okType: "danger",
      cancelText: "Keep Editing",
      centered: true,
      onOk: () => {
        form.resetFields();
        setOpen(false);
      },
    });
  };

  /* ── Dark mode tokens ── */
  const modalBg   = darkMode ? "#1e293b" : "#fff";
  const headerBg  = darkMode ? "#0f172a" : "#fafafa";
  const inputBg   = darkMode ? "#0f172a" : "#fff";
  const inputCol  = darkMode ? "#f1f5f9" : "#1e293b";
  const borderCol = darkMode ? "#475569" : "#d9d9d9";
  const labelCol  = darkMode ? "#94a3b8" : "#64748b";

  const inputStyle = { background: inputBg, color: inputCol, borderColor: borderCol, borderRadius: 8 };
  const labelStyle = { fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: labelCol };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={520}
      centered
      closable={false}
      styles={{
        body: { padding: 0, background: modalBg },
        mask: { backdropFilter: "blur(4px)" },
      }}
      style={{ borderRadius: 16, overflow: "hidden" }}
    >
      {/* ── Custom Header ── */}
      <div style={{
        background: headerBg,
        padding: "20px 28px",
        borderBottom: `1px solid ${borderCol}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: darkMode ? "#f1f5f9" : "#1e293b" }}>
            Apply for <span style={{ color: "#6366f1" }}>{job?.roleName}</span>
          </div>
          <div style={{ fontSize: 12, color: labelCol, marginTop: 2 }}>Fill in your details to submit an application</div>
        </div>
        <button
          onClick={handleCancel}
          style={{
            width: 32, height: 32, borderRadius: 4,
            border: "none", background: "transparent",
            cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", color: labelCol, fontSize: 16, fontWeight: 700,
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? "#334155" : "#f1f5f9"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          ✕
        </button>
      </div>

      {/* ── Form Body ── */}
      <div style={{ padding: "24px 28px", background: modalBg }}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="name"
            label={<span style={labelStyle}>Full Name</span>}
            rules={[{ required: true, message: "Full name is required" }]}
          >
            <Input placeholder="John Doe" size="large" style={inputStyle} />
          </Form.Item>

          <Form.Item
            name="email"
            label={<span style={labelStyle}>Email Address</span>}
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="john@example.com" size="large" style={inputStyle} />
          </Form.Item>

          <Form.Item
            name="experience"
            label={<span style={labelStyle}>Experience</span>}
            rules={[{ required: true, message: "Experience is required" }]}
          >
            <Select
              placeholder="Select experience"
              size="large"
              style={{ borderRadius: 8 }}
              popupClassName={darkMode ? "dark-select-dropdown" : ""}
            >
              <Select.Option value="Fresher">Fresher</Select.Option>
              <Select.Option value="1-3 Years">1-3 Years</Select.Option>
              <Select.Option value="3-5 Years">3-5 Years</Select.Option>
              <Select.Option value="5+ Years">5+ Years</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="skills"
            label={<span style={labelStyle}>Key Skills <span style={{ color: "#dc2626" }}>*</span></span>}
            rules={[{ required: true, message: "Please select at least one skill" }]}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Select your skills"
              size="large"
              options={skillOptions}
              style={{ borderRadius: 8 }}
              popupClassName={darkMode ? "dark-select-dropdown" : ""}
            />
          </Form.Item>

          <div style={{ display: "flex", gap: 16 }}>
            <Form.Item
              name="country"
              label={<span style={labelStyle}>Country</span>}
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Country is required" }]}
            >
              <Input placeholder="USA" size="large" style={inputStyle} />
            </Form.Item>
            <Form.Item
              name="state"
              label={<span style={labelStyle}>State</span>}
              style={{ flex: 1 }}
            >
              <Input placeholder="California" size="large" style={inputStyle} />
            </Form.Item>
          </div>

          <Form.Item
            name="resume"
            label={<span style={labelStyle}>Upload Resume <span style={{ color: "#dc2626" }}>*</span></span>}
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            rules={[{ required: true, message: "Resume upload is required" }]}
          >
            <Upload 
              maxCount={1} 
              beforeUpload={() => false}
              listType="text"
            >
              <Button icon={<UploadOutlined />} style={inputStyle}>Click to Upload (PDF, DOCX)</Button>
            </Upload>
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
            <Button
              size="large"
              onClick={handleCancel}
              style={{ borderRadius: 8, borderColor: borderCol, color: labelCol, background: "transparent", fontWeight: 600 }}
            >
              Cancel
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
                boxShadow: "0 4px 10px rgba(99,102,241,0.4)",
              }}
            >
              Submit Application
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default ApplyJobModal;
