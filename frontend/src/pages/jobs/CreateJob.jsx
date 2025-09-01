import React, { useState } from "react";
import { addJob } from "../../api/jobs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

const CreateJob = () => {
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    company: "",
    position: "",
    jobType: "full-time",
    status: "applied",
    location: "remote",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobData.company.trim() || !jobData.position.trim()) {
      toast.error("Company and Position are required");
      return;
    }

    setSaving(true);
    try {
      await addJob(jobData);
      toast.success("Job created successfully!");
      navigate("/home/jobs");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create job");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-start justify-center py-8 px-4 md:px-6">
      <div className="w-full max-w-2xl md:max-w-3xl bg-gray-900 p-6 md:p-8 rounded-2xl shadow-xl border border-gray-700">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 text-center">
          Add New Job
        </h2>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Company & Position */}
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

          {/* Job Type */}
          <div className="flex flex-col md:flex-row gap-3">
            <select
              name="jobType"
              value={jobData.jobType}
              onChange={handleChange}
              className="flex-1 px-3 py-2 rounded-lg cursor-pointer bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-cyan-400 outline-none transition"
            >
              <option value="internship">Internship</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
            </select>

            {/* Status (locked) */}
            <input
              type="text"
              value="Applied"
              readOnly
              className="flex-1 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-300 cursor-not-allowed"
            />
          </div>

          {/* Location */}
          <input
            type="text"
            name="location"
            value={jobData.location}
            onChange={handleChange}
            placeholder="Location"
            className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 outline-none transition"
          />

          {/* Description */}
          <textarea
            name="description"
            value={jobData.description}
            onChange={handleChange}
            placeholder="Job Description"
            maxLength={500}
            rows="4"
            className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 outline-none transition resize-none"
          />

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-3 mt-3">
            <button
              type="submit"
              disabled={saving}
              className={`flex-1 ${
                saving
                  ? "bg-cyan-400 cursor-not-allowed"
                  : "bg-cyan-500 hover:bg-cyan-600"
              } text-white font-bold py-2 rounded-lg cursor-pointer transition shadow-md hover:shadow-lg flex items-center justify-center gap-2`}
            >
              {saving ? (
                <>
                  <ClipLoader size={18} color="#fff" /> Saving...
                </>
              ) : (
                "Add Job"
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

export default CreateJob;
