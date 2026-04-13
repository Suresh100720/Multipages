import { Modal, message, Form } from "antd";
import { useEffect } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { addCandidate, updateCandidate } from "../../services/api";
import CandidateForm from "../../components/ui/CandidateForm";

const CandidateFormModal = ({ open, setOpen, editData, refresh, clearEdit, darkMode }) => {
  const [form] = Form.useForm();
  const isEdit = !!editData;

  useEffect(() => {
    if (open) {
      if (editData) {
        form.setFieldsValue(editData);
      } else {
        form.resetFields();
      }
    }
  }, [editData, open, form]);

  /* ── Submit with confirmation popup ── */
  const onFinish = async (values) => {
    Modal.confirm({
      title: isEdit ? "Confirm Update" : "Confirm Save",
      content: isEdit
        ? `Are you sure you want to update the details for "${editData?.name}"?`
        : "Are you sure you want to save this new candidate?",
      okText: isEdit ? "Yes, Update" : "Yes, Save",
      cancelText: "Go Back",
      centered: true,
      onOk: async () => {
        try {
          if (isEdit) {
            await updateCandidate(editData._id, values);
            message.success("Candidate updated successfully!");
          } else {
            await addCandidate(values);
            message.success("Candidate added successfully!");
          }
          setOpen(false);
          clearEdit();
          form.resetFields();
          refresh();
        } catch {
          message.error("Failed to save changes. Please try again.");
        }
      },
    });
  };

  /* ── Cancel with confirmation popup ── */
  const handleCancel = () => {
    Modal.confirm({
      title: "Discard Changes?",
      content: "Are you sure you want to cancel? Any unsaved changes will be lost.",
      okText: "Yes, Discard",
      okType: "danger",
      cancelText: "Keep Editing",
      centered: true,
      onOk: () => {
        setOpen(false);
        clearEdit();
        form.resetFields();
      },
    });
  };

  /* ── Dynamic colors ── */
  const bg = darkMode ? "#1e293b" : "#fff";
  const headerBg = darkMode ? "#0f172a" : "#fff";
  const borderCol = darkMode ? "#334155" : "#e2e8f0";
  const titleCol = darkMode ? "#f1f5f9" : "#1e293b";

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={650}
      centered
      closable={false}
      styles={{ body: { padding: 0, background: bg }, mask: { backdropFilter: "blur(4px)" } }}
      style={{ borderRadius: 16, overflow: "hidden" }}
    >
      {/* ── Header ── */}
      <div
        style={{
          backgroundColor: headerBg,
          padding: "20px 32px",
          position: "relative",
          borderBottom: `1px solid ${borderCol}`,
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 700, color: titleCol }}>
          {isEdit ? "Edit Candidate Information" : "Register New Candidate"}
        </div>
        <button
          onClick={handleCancel}
          style={{
            position: "absolute",
            top: 20,
            right: 24,
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${borderCol}`,
            borderRadius: "50%",
            background: "transparent",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = darkMode ? "#334155" : "#f1f5f9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <CloseOutlined style={{ fontSize: 14, color: darkMode ? "#94a3b8" : "#64748b" }} />
        </button>
      </div>

      {/* ── Form Body ── */}
      <div style={{ padding: "28px 32px", background: bg }}>
        <CandidateForm form={form} onFinish={onFinish} isEdit={isEdit} darkMode={darkMode} />
      </div>
    </Modal>
  );
};

export default CandidateFormModal;
