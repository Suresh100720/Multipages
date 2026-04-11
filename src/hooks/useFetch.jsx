import { useEffect, useState } from "react";

const useFetch = (apiFunc) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const res = await apiFunc();
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, refetch: fetchData };
};

export default useFetch;