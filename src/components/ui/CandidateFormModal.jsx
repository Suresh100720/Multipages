import { Modal, message, Form } from "antd";
import { useEffect } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { addCandidate, updateCandidate } from "../../services/api";
import CandidateForm from "../../components/ui/CandidateForm";

/**
 * Professional White/Neutral Modal for Candidate Management.
 * Modularized to use CandidateForm.jsx.
 */
const CandidateFormModal = ({ open, setOpen, editData, refresh, clearEdit, darkMode }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (editData) {
        form.setFieldsValue(editData);
      } else {
        form.resetFields();
      }
    }
  }, [editData, open, form]);

  const onFinish = async (values) => {
    try {
      if (editData) {
        await updateCandidate(editData._id, values);
        message.success("Candidate updated successfully!");
      } else {
        await addCandidate(values);
        message.success("Candidate added successfully!");
      }
      // Close without confirmation when save is successful
      setOpen(false);
      clearEdit();
      form.resetFields();
      refresh();
    } catch (error) {
      message.error("Failed to save changes. Please try again.");
    }
  };

  const handleCancel = () => {
    Modal.confirm({
      title: "Confirm Cancellation",
      content: "Are you sure you want to cancel? Any unsaved changes will be lost.",
      okText: "Cancel",
      okType: "danger",
      cancelText: "Continue Editing",
      centered: true,
      onOk: () => {
        setOpen(false);
        clearEdit();
        form.resetFields();
      },
    });
  };

  const isEdit = !!editData;

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={650}
      centered
      closable={false}
      styles={{ body: { padding: 0 } }}
      style={{ borderRadius: 12, overflow: "hidden" }}
      className={darkMode ? "dark-mode-modal" : ""}
    >
      {/* ── Professional Header ── */}
      <div className="border-bottom" style={{
        backgroundColor: "#fff",
        padding: "20px 32px",
        position: "relative",
        borderBottom: `1px solid #e2e8f0`
      }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#1e293b" }}>
          {isEdit ? "Edit Candidate Information" : "Register New Candidate"}
        </div>
        
        {/* Clean Close Button with Hover Effect */}
        <button
          onClick={() => handleCancel()}
          className="btn btn-light rounded-circle shadow-sm"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f1f5f9";
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.transform = "scale(1)";
          }}
          style={{
            position: "absolute",
            top: 20,
            right: 24,
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid #e2e8f0`,
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            cursor: "pointer",
            background: "#fff"
          }}
        >
          <CloseOutlined style={{ fontSize: 14, color: "#64748b" }} />
        </button>
      </div>

      {/* ── Modular Form Content ── */}
      <div style={{ padding: "28px 32px", background: "#fff" }}>
        <CandidateForm form={form} onFinish={onFinish} isEdit={isEdit} darkMode={false} />
      </div>
    </Modal>
  );
};

export default CandidateFormModal;
