import { Modal, Form, Input, Select, Radio, Button, message } from "antd";
import { addJob } from "../../services/api";

const JobFormModal = ({ open, setOpen, refresh, darkMode }) => {
  const [form] = Form.useForm();

  /* ── Submit Logic ── */
  const handleFinish = async (values) => {
    try {
      await addJob(values);
      message.success("Job posted successfully!");
      form.resetFields();
      setOpen(false);
      refresh();
    } catch (e) {
      console.error(e);
      message.error("Failed to post job.");
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
      title: "Discard Changes?",
      content: "Are you sure you want to cancel? Any unsaved details will be lost.",
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
  const radioCol  = darkMode ? "#cbd5e1" : "#1e293b";

  const inputStyle = {
    background: inputBg,
    color: inputCol,
    borderColor: borderCol,
    borderRadius: 8,
  };

  const labelStyle = {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    color: labelCol,
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={540}
      centered
      closable={false}
      styles={{
        body: { padding: 0, background: modalBg },
        header: { background: headerBg, borderBottom: `1px solid ${borderCol}` },
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
          <div style={{ fontSize: 18, fontWeight: 700, color: darkMode ? "#f1f5f9" : "#1e293b" }}>Post a New Job</div>
          <div style={{ fontSize: 12, color: labelCol, marginTop: 2 }}>Fill in the details to publish a job opening</div>
        </div>
        <button
          onClick={handleCancel}
          style={{
            width: 32, height: 32, borderRadius: 4,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: labelCol, fontSize: 16, fontWeight: 700, lineHeight: 1,
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
            name="roleName"
            label={<span style={labelStyle}>Role Name</span>}
            rules={[{ required: true, message: "Role name is required" }]}
          >
            <Input
              placeholder="e.g. Frontend Developer"
              size="large"
              style={inputStyle}
            />
          </Form.Item>

          <Form.Item
            name="experience"
            label={<span style={labelStyle}>Experience Required</span>}
            rules={[{ required: true, message: "Experience is required" }]}
          >
            <Select
              placeholder="Select experience level"
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
            name="salaryRange"
            label={<span style={labelStyle}>Salary Range</span>}
            rules={[{ required: true, message: "Salary range is required" }]}
          >
            <Input
              placeholder="e.g. $80k - $100k"
              size="large"
              style={inputStyle}
            />
          </Form.Item>

          <Form.Item
            name="country"
            label={<span style={labelStyle}>Country</span>}
            rules={[{ required: true, message: "Country is required" }]}
          >
            <Input
              placeholder="e.g. USA, UK, India"
              size="large"
              style={inputStyle}
            />
          </Form.Item>

          <Form.Item
            name="hiringStatus"
            label={<span style={labelStyle}>Hiring Status</span>}
            rules={[{ required: true, message: "Please select a hiring status" }]}
          >
            <Radio.Group style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <Radio value="Actively Hiring">
                <span style={{ color: radioCol, fontWeight: 500 }}>Actively Hiring</span>
              </Radio>
              <Radio value="Urgently Hiring">
                <span style={{ color: radioCol, fontWeight: 500 }}>Urgently Hiring</span>
              </Radio>
              <Radio value="Inactive">
                <span style={{ color: radioCol, fontWeight: 500 }}>Inactive</span>
              </Radio>
            </Radio.Group>
          </Form.Item>

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
            <Button
              size="large"
              onClick={handleCancel}
              style={{
                borderRadius: 8,
                borderColor: borderCol,
                color: labelCol,
                background: "transparent",
                fontWeight: 600,
              }}
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
              Post Job
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default JobFormModal;
