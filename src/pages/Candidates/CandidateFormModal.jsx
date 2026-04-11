import { Modal, message, Form } from "antd";
import { useEffect } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { addCandidate, updateCandidate } from "../../services/api";
import CandidateForm from "../../components/ui/CandidateForm";

/**
 * Professional White/Neutral Modal for Candidate Management.
 * Modularized to use CandidateForm.jsx.
 */
const CandidateFormModal = ({ open, setOpen, editData, refresh, clearEdit }) => {
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
        message.success("Candidate record updated.");
      } else {
        await addCandidate(values);
        message.success("New candidate added successfully.");
      }
      handleCancel();
      refresh();
    } catch (error) {
      message.error("Failed to save changes. Please try again.");
    }
  };

  const handleCancel = () => {
    setOpen(false);
    clearEdit();
    form.resetFields();
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
    >
      {/* ── Professional Header (No colors/gradients) ── */}
      <div className="border-bottom" style={{
        backgroundColor: "#fff",
        padding: "20px 32px",
        position: "relative",
      }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#1e293b" }}>
          {isEdit ? "Edit Candidate Information" : "Register New Candidate"}
        </div>
        <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
          {isEdit ? "Update the professional profile details below." : "Enter comprehensive professional details to create a new profile."}
        </div>
        
        {/* Clean Close Button with Hover Effect */}
        <button
          onClick={handleCancel}
          className="btn btn-light rounded-circle shadow-sm"
          style={{
            position: "absolute",
            top: 20,
            right: 24,
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #e2e8f0",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <CloseOutlined style={{ fontSize: 14, color: "#64748b" }} />
        </button>
      </div>

      {/* ── Modular Form Content ── */}
      <div style={{ padding: "28px 32px" }}>
        <CandidateForm form={form} onFinish={onFinish} isEdit={isEdit} />
      </div>
    </Modal>
  );
};

export default CandidateFormModal;