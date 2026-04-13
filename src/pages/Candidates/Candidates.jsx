import { useEffect, useState } from "react";
import DashboardGrid from "../../components/dashboard/DashboardGrid";
import CandidateFormModal from "../../components/ui/CandidateFormModal";
import { fetchCandidates } from "../../services/api";
import { useAppContext } from "../../context/AppContext";

const Candidates = ({ darkMode }) => {
  const { candidates, setCandidates, setLoading, setError } = useAppContext();
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchCandidates();
      setCandidates(res.data || []);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch candidate data", e);
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (candidates.length === 0) {
      loadData();
    }
  }, []);

  return (
    <div>
      <h2 style={{ color: darkMode ? "#f8fafc" : "#1e293b", marginBottom: "20px" }}>Candidates / Applicants</h2>
      <DashboardGrid
        rowData={candidates}
        onAddCandidate={() => {
          setEditData(null);
          setOpen(true);
        }}
        onEditCandidate={(candidate) => {
          setEditData(candidate);
          setOpen(true);
        }}
        refreshData={loadData}
      />
      <CandidateFormModal
        open={open}
        setOpen={setOpen}
        editData={editData}
        refresh={loadData}
        clearEdit={() => setEditData(null)}
        darkMode={darkMode}
      />
    </div>
  );
};

export default Candidates;
