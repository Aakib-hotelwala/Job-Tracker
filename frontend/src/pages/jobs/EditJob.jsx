import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById, updateJob } from "../../api/jobs";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const statuses = ["applied", "interview", "offer", "rejected"];
  const jobTypes = ["internship", "full-time", "part-time", "contract"];

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await getJobById(id);
        setJobData(data.job);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load job");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateJob(id, jobData);
      toast.success("Job updated successfully!");
      navigate("/home/jobs");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update job");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <ClipLoader color="#3b82f6" size={48} />
      </div>
    );
  }

  if (!jobData) {
    return <p className="text-center text-red-400 mt-10">Job not found</p>;
  }

  return (
    <div className="min-h-[70vh] flex items-start justify-center py-8 px-4 md:px-6">
      <div className="w-full max-w-2xl md:max-w-3xl bg-gray-900 p-6 md:p-8 rounded-2xl shadow-xl border border-gray-700">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 text-center">
          Edit Job
        </h2>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              name="company"
              value={jobData.company}
              onChange={handleChange}
              placeholder="Company"
              className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 outline-none transition"
              required
            />
            <input
              type="text"
              name="position"
              value={jobData.position}
              onChange={handleChange}
              placeholder="Position"
              className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 outline-none transition"
              required
            />
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <select
              name="jobType"
              value={jobData.jobType}
              onChange={handleChange}
              className="flex-1 px-3 py-2 rounded-lg cursor-pointer bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-cyan-400 outline-none transition"
            >
              {jobTypes.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>

            <select
              name="status"
              value={jobData.status}
              onChange={handleChange}
              className="flex-1 px-3 py-2 rounded-lg cursor-pointer bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-cyan-400 outline-none transition"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            name="location"
            value={jobData.location}
            onChange={handleChange}
            placeholder="Location"
            className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 outline-none transition"
          />

          <textarea
            name="description"
            value={jobData.description || ""}
            onChange={handleChange}
            placeholder="Job Description"
            maxLength={500}
            rows="4"
            className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 outline-none transition resize-none"
          />

          <div className="flex flex-col md:flex-row gap-3 mt-3">
            <button
              type="submit"
              disabled={saving}
              className={`flex-1 ${
                saving
                  ? "bg-cyan-400 cursor-not-allowed"
                  : "bg-cyan-500 hover:bg-cyan-600"
              } text-white font-bold py-2 rounded-lg cursor-pointer transition shadow-md hover:shadow-lg`}
            >
              {saving ? (
                <>
                  <ClipLoader size={18} color="#fff" /> Saving...
                </>
              ) : (
                "Update Job"
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/home/jobs")}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg cursor-pointer transition shadow-md hover:shadow-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;
