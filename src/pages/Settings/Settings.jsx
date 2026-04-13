import { Card, Row, Col, Switch, Button, Input, Select, Space, Divider, Typography, message } from "antd";
import { SaveOutlined, UndoOutlined, BellOutlined, LockOutlined, BgColorsOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Title, Text } = Typography;

const Settings = ({ darkMode = false, onClose }) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkTheme: darkMode,
    language: "en",
    timezone: "UTC",
    autoSave: true,
    twoFactor: false,
  });

  const [isSaved, setIsSaved] = useState(true);

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setIsSaved(false);
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    message.success("Settings saved successfully!");
  };

  const handleReset = () => {
    setSettings({
      emailNotifications: true,
      pushNotifications: false,
      darkTheme: darkMode,
      language: "en",
      timezone: "UTC",
      autoSave: true,
      twoFactor: false,
    });
    setIsSaved(true);
    message.info("Settings reset to defaults");
  };

  const cardBg = darkMode ? "#1e293b" : "#fff";
  const textColor = darkMode ? "#f1f5f9" : "#1e293b";
  const labelColor = darkMode ? "#94a3b8" : "#64748b";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header with Back Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={2} style={{ margin: 0, color: textColor }}>
            Settings
          </Title>
          <Text style={{ color: labelColor, fontSize: 14 }}>
            Manage your preferences and application settings
          </Text>
        </div>
        {onClose && (
          <Button 
            onClick={onClose}
            icon={<ArrowLeftOutlined />}
            type="text"
            style={{ fontSize: 16 }}
          >
            Back
          </Button>
        )}
      </div>

      {/* Status Message */}
      {!isSaved && (
        <Card
          style={{
            background: "#fef3c7",
            border: "1px solid #fcd34d",
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#92400e", fontWeight: 600 }}>
            ⚠️ You have unsaved changes. Don't forget to save before leaving.
          </Text>
        </Card>
      )}

      <Row gutter={[24, 24]}>
        {/* Notifications Section */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              background: cardBg,
              borderRadius: 12,
              border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
            }}
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <BellOutlined style={{ color: "#6366f1", fontSize: 18 }} />
                <span style={{ color: textColor, fontWeight: 600 }}>Notifications</span>
              </div>
            }
          >
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <Text style={{ color: textColor, fontWeight: 600 }}>Email Notifications</Text>
                  <div style={{ color: labelColor, fontSize: 12, marginTop: 4 }}>
                    Receive email updates about your activities
                  </div>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle("emailNotifications")}
                />
              </div>

              <Divider style={{ margin: "12px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <Text style={{ color: textColor, fontWeight: 600 }}>Push Notifications</Text>
                  <div style={{ color: labelColor, fontSize: 12, marginTop: 4 }}>
                    Receive push notifications on your device
                  </div>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onChange={() => handleToggle("pushNotifications")}
                />
              </div>

              <Divider style={{ margin: "12px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <Text style={{ color: textColor, fontWeight: 600 }}>Auto-save</Text>
                  <div style={{ color: labelColor, fontSize: 12, marginTop: 4 }}>
                    Automatically save changes as you type
                  </div>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onChange={() => handleToggle("autoSave")}
                />
              </div>
            </Space>
          </Card>
        </Col>

        {/* Preferences Section */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              background: cardBg,
              borderRadius: 12,
              border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
            }}
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <BgColorsOutlined style={{ color: "#6366f1", fontSize: 18 }} />
                <span style={{ color: textColor, fontWeight: 600 }}>Preferences</span>
              </div>
            }
          >
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              <div>
                <Text style={{ color: textColor, fontWeight: 600, display: "block", marginBottom: 8 }}>
                  Language
                </Text>
                <Select
                  value={settings.language}
                  onChange={(value) => handleChange("language", value)}
                  style={{ width: "100%" }}
                  options={[
                    { value: "en", label: "English" },
                    { value: "es", label: "Spanish" },
                    { value: "fr", label: "French" },
                    { value: "de", label: "German" },
                  ]}
                />
              </div>

              <div>
                <Text style={{ color: textColor, fontWeight: 600, display: "block", marginBottom: 8 }}>
                  Timezone
                </Text>
                <Select
                  value={settings.timezone}
                  onChange={(value) => handleChange("timezone", value)}
                  style={{ width: "100%" }}
                  options={[
                    { value: "UTC", label: "UTC" },
                    { value: "EST", label: "Eastern Time" },
                    { value: "CST", label: "Central Time" },
                    { value: "PST", label: "Pacific Time" },
                    { value: "IST", label: "Indian Standard Time" },
                  ]}
                />
              </div>
            </Space>
          </Card>
        </Col>

        {/* Security Section */}
        <Col xs={24}>
          <Card
            style={{
              background: cardBg,
              borderRadius: 12,
              border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
            }}
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <LockOutlined style={{ color: "#6366f1", fontSize: 18 }} />
                <span style={{ color: textColor, fontWeight: 600 }}>Security</span>
              </div>
            }
          >
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <Text style={{ color: textColor, fontWeight: 600 }}>Two-Factor Authentication</Text>
                  <div style={{ color: labelColor, fontSize: 12, marginTop: 4 }}>
                    Add an extra layer of security to your account
                  </div>
                </div>
                <Switch
                  checked={settings.twoFactor}
                  onChange={() => handleToggle("twoFactor")}
                />
              </div>

              <Divider style={{ margin: "12px 0" }} />

              <div>
                <Text style={{ color: textColor, fontWeight: 600, display: "block", marginBottom: 8 }}>
                  Current Password
                </Text>
                <Input.Password placeholder="Enter your current password" />
              </div>

              <div>
                <Text style={{ color: textColor, fontWeight: 600, display: "block", marginBottom: 8 }}>
                  New Password
                </Text>
                <Input.Password placeholder="Enter new password" />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Action Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
        <Button
          onClick={handleReset}
          size="large"
          style={{
            borderRadius: 8,
            fontWeight: 600,
          }}
          icon={<UndoOutlined />}
        >
          Reset
        </Button>
        <Button
          type="primary"
          onClick={handleSave}
          size="large"
          style={{
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
          }}
          icon={<SaveOutlined />}
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
