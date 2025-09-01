import { useEffect, useState } from "react";
import { getStats } from "../../api/jobs";
import ClipLoader from "react-spinners/ClipLoader";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color="#3b82f6" size={50} />
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 bg-gray-800 rounded-xl shadow-md text-center">
        <h3 className="text-lg font-semibold text-cyan-400">Total Jobs</h3>
        <p className="text-3xl font-bold">{stats.totalJobs}</p>
      </div>

      <div className="p-6 bg-gray-800 rounded-xl shadow-md text-center">
        <h3 className="text-lg font-semibold text-yellow-400">Applied</h3>
        <p className="text-3xl font-bold">{stats.applied}</p>
      </div>

      <div className="p-6 bg-gray-800 rounded-xl shadow-md text-center">
        <h3 className="text-lg font-semibold text-green-400">Interviews</h3>
        <p className="text-3xl font-bold">{stats.interview}</p>
      </div>

      <div className="p-6 bg-gray-800 rounded-xl shadow-md text-center">
        <h3 className="text-lg font-semibold text-red-400">Rejected</h3>
        <p className="text-3xl font-bold">{stats.rejected}</p>
      </div>
    </div>
  );
};

export default Dashboard;
