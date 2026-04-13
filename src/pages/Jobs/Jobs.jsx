import { useEffect, useState } from "react";
import { Button, Row, Col, Card, Tag, Typography } from "antd";
import { PlusOutlined, BankOutlined, DollarOutlined, GlobalOutlined, ClockCircleOutlined } from "@ant-design/icons";
import JobFormModal from "../../components/ui/JobFormModal";
import ApplyJobModal from "../../components/ui/ApplyJobModal";
import { fetchJobs } from "../../services/api";
import { useAppContext } from "../../context/AppContext";

const { Title, Text } = Typography;

const Jobs = ({ darkMode }) => {
  const { jobs = [], setJobs, setLoading, setError } = useAppContext();
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchJobs();
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ padding: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <Title level={2} style={{ color: darkMode ? "#f8fafc" : "#1e293b", margin: 0, fontWeight: 800 }}>Careers & Opportunities</Title>
          <Text style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>Manage job postings and applications efficiently.</Text>
        </div>
        <Button 
          type="primary" 
          size="large"
          icon={<PlusOutlined />} 
          onClick={() => setPostModalOpen(true)}
          style={{ 
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)", 
            fontWeight: 600, 
            border: "none",
            borderRadius: 8,
            boxShadow: "0 4px 14px rgba(99,102,241,0.4)"
          }}
        >
          Post New Job
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {(Array.isArray(jobs) ? jobs : []).length === 0 && <div style={{ color: darkMode ? "#cbd5e1" : "#475569", padding: 20 }}>No jobs posted yet.</div>}
        {(Array.isArray(jobs) ? jobs : []).map(job => {
          const isInactive = job.hiringStatus === "Inactive" || job.hiringStatus === "Closed";
          return (
          <Col xs={24} sm={12} lg={8} xl={6} key={job._id}>
            <Card 
              hoverable
              style={{ 
                background: darkMode ? "#1e293b" : "#fff", 
                borderColor: darkMode ? "#334155" : "#e2e8f0",
                borderRadius: 16,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
              styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column' } }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ 
                  width: 48, height: 48, borderRadius: 12, 
                  background: isInactive ? (darkMode ? '#334155' : '#f1f5f9') : "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))",
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: isInactive ? '#94a3b8' : '#8b5cf6', fontSize: 24
                }}>
                  <BankOutlined />
                </div>
                <Tag 
                  color={isInactive ? "default" : job.hiringStatus === "Urgently Hiring" ? "volcano" : "geekblue"} 
                  style={{ borderRadius: 12, padding: '4px 12px', fontWeight: 600, border: 'none' }}
                >
                  {isInactive ? "Inactive" : job.hiringStatus}
                </Tag>
              </div>

              <Title level={4} style={{ color: darkMode ? "#f1f5f9" : "#1e293b", marginTop: 0, marginBottom: 16 }}>{job.roleName}</Title>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: darkMode ? "#cbd5e1" : "#64748b" }}>
                  <ClockCircleOutlined /> <span style={{ fontWeight: 500 }}>{job.experience}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: darkMode ? "#cbd5e1" : "#64748b" }}>
                  <DollarOutlined /> <span style={{ fontWeight: 500 }}>{job.salaryRange}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: darkMode ? "#cbd5e1" : "#64748b" }}>
                  <GlobalOutlined /> <span style={{ fontWeight: 500 }}>{job.country}</span>
                </div>
              </div>

              {!isInactive && (
                <Button 
                   type="primary" 
                   block
                   size="large"
                   onClick={() => { setSelectedJob(job); setApplyModalOpen(true); }}
                   style={{ 
                     borderRadius: 8, 
                     fontWeight: 600,
                     background: darkMode ? "rgba(99,102,241,0.2)" : "#f5f5ff",
                     color: "#6366f1",
                     border: "none"
                   }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.background = "#6366f1";
                     e.currentTarget.style.color = "#fff";
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.background = darkMode ? "rgba(99,102,241,0.2)" : "#f5f5ff";
                     e.currentTarget.style.color = "#6366f1";
                   }}
                >
                   Apply Now
                </Button>
              )}
            </Card>
          </Col>
        )})}
      </Row>

      <JobFormModal 
        open={postModalOpen} 
        setOpen={setPostModalOpen} 
        refresh={loadData} 
        darkMode={darkMode} 
      />
      
      {selectedJob && (
        <ApplyJobModal 
          open={applyModalOpen} 
          setOpen={setApplyModalOpen} 
          job={selectedJob} 
          darkMode={darkMode} 
        />
      )}
    </div>
  );
};

export default Jobs;
