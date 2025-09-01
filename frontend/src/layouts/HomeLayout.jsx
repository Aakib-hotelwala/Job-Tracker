import { useState, useEffect } from "react";
import {
  Outlet,
  NavLink,
  useNavigate,
  useMatch,
  useLocation,
} from "react-router-dom";
import { FaSignOutAlt, FaBriefcase, FaPlus, FaChartPie } from "react-icons/fa";
import { logoutUser } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import { getStats } from "../api/jobs";

const HomeLayout = () => {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    jobType: "",
    sort: "latest",
  });

  const [searchInput, setSearchInput] = useState("");
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const isJobsPage = useMatch("/home/jobs");

  const handleLogout = async () => {
    await logoutUser();
    clearUser();
    navigate("/login");
  };

  useEffect(() => {
    console.log("Fetching stats...");
    const fetchStats = async () => {
      try {
        const { data } = await getStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (!isJobsPage) {
      setFilters({
        search: "",
        status: "",
        jobType: "",
        sort: "latest",
      });
    }
  }, [location.pathname, isJobsPage]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <header className="flex items-center justify-between bg-gray-800 p-4 shadow-md gap-3 flex-wrap">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Job Tracker
        </h2>

        <div className="flex items-center gap-3">
          <NavLink
            to="/home"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                isActive ? "bg-cyan-500 text-white" : "hover:bg-gray-700"
              }`
            }
          >
            <FaChartPie /> Dashboard
          </NavLink>

          <NavLink
            to="/home/jobs"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                isActive ? "bg-cyan-500 text-white" : "hover:bg-gray-700"
              }`
            }
          >
            <FaBriefcase /> Jobs
          </NavLink>

          <NavLink
            to="/home/create"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                isActive ? "bg-cyan-500 text-white" : "hover:bg-gray-700"
              }`
            }
          >
            <FaPlus /> Add Job
          </NavLink>
        </div>

        <div
          className={`flex items-center gap-2 flex-wrap transition-opacity duration-200 ${
            isJobsPage ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 outline-none"
          />

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 cursor-pointer rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
          >
            <option value="">All Status</option>
            {stats &&
              Object.entries(stats)
                .filter(([key]) => key !== "totalJobs")
                .map(([key]) => (
                  <option key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </option>
                ))}
          </select>

          <select
            value={filters.jobType}
            onChange={(e) =>
              setFilters({ ...filters, jobType: e.target.value })
            }
            className="px-3 py-2 cursor-pointer rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
          >
            <option value="">All Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="remote">Remote</option>
            <option value="internship">Internship</option>
          </select>

          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            className="px-3 py-2 cursor-pointer rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="a-z">A - Z</option>
            <option value="z-a">Z - A</option>
          </select>

          <button
            onClick={() => {
              setFilters({
                search: "",
                status: "",
                jobType: "",
                sort: "latest",
              });
              setSearchInput("");
            }}
            className="px-3 py-2 cursor-pointer rounded-lg bg-gray-700 hover:bg-gray-600 border border-gray-500 text-white transition"
          >
            Clear
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center cursor-pointer gap-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </header>

      <main className="flex-1 p-6">
        <Outlet context={{ filters, stats }} />
      </main>
    </div>
  );
};

export default HomeLayout;
