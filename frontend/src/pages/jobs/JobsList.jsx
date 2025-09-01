import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { deleteJob, getJobs, updateJob } from "../../api/jobs";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";

const JobsList = () => {
  const { filters } = useOutletContext();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [numOfPages, setNumOfPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  const [openDialog, setOpenDialog] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const navigate = useNavigate();

  const statuses = ["applied", "interview", "offer", "rejected"];
  const jobTypes = ["internship", "full-time", "part-time", "contract"];

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await getJobs({ ...filters, page });
      setJobs(data.jobs);
      setNumOfPages(data.numOfPages);
      setTotalJobs(data.totalJobs);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [JSON.stringify(filters), page]);

  const handleInlineUpdate = async (id, field, value) => {
    try {
      const jobToUpdate = jobs.find((j) => j._id === id);
      if (!jobToUpdate) return;

      const updatedJob = { ...jobToUpdate, [field]: value };

      await updateJob(id, updatedJob);

      setJobs((prev) => prev.map((job) => (job._id === id ? updatedJob : job)));
      toast.success("Job updated successfully");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update job");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;

    try {
      await deleteJob(jobToDelete._id);
      setJobs((prev) => prev.filter((j) => j._id !== jobToDelete._id));
      toast.success("Job deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete job");
    } finally {
      setOpenDialog(false);
      setJobToDelete(null);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <ClipLoader color="#3b82f6" size={50} />
      </Box>
    );
  }

  if (!jobs.length) {
    const hasAnyJobs = totalJobs > 0;

    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="50vh"
        textAlign="center"
        sx={{
          bgcolor: "#111827",
          borderRadius: 3,
          p: 6,
          border: "1px dashed #374151",
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(6,182,212,0.2))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <span style={{ fontSize: 28 }}>{hasAnyJobs ? "🔍" : "📭"}</span>
        </Box>

        <Typography
          variant="h6"
          sx={{ color: "#f3f4f6", fontWeight: "bold", mb: 1 }}
        >
          {hasAnyJobs ? "No matching jobs" : "No jobs found"}
        </Typography>

        <Typography variant="body2" sx={{ color: "#9ca3af", maxWidth: 360 }}>
          {hasAnyJobs ? (
            "Try adjusting your filters or search query to see more results."
          ) : (
            <>
              Looks like you haven’t added any jobs yet. Start by clicking{" "}
              <b style={{ color: "#22d3ee" }}>“Add Job”</b> to begin tracking
              your applications.
            </>
          )}
        </Typography>

        {!hasAnyJobs && (
          <Button
            variant="contained"
            onClick={() => navigate("/home/create")}
            sx={{
              mt: 3,
              bgcolor: "#3b82f6",
              "&:hover": { bgcolor: "#2563eb" },
              borderRadius: 2,
              px: 4,
              color: "#fff",
            }}
          >
            Add Job
          </Button>
        )}
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={4}>
        {jobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job._id}>
            <Card
              sx={{
                bgcolor: "#1f2937",
                borderRadius: 3,
                border: "1px solid #374151",
                boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.7)",
                },
              }}
            >
              <Box
                sx={{
                  height: 6,
                  background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
                  mb: 1,
                }}
              />

              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    mb: 1,
                    color: "white",
                    textTransform: "capitalize",
                  }}
                >
                  {job.position}
                </Typography>

                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 2,
                    color: "#f3f4f6",
                    fontWeight: 500,
                  }}
                >
                  {job.company} • {job.location}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mb: 2,
                    color: "#e5e7eb",
                    minHeight: 40,
                    maxHeight: 60,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {job.description || "No description provided"}
                </Typography>

                <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                  <select
                    value={job.status}
                    onChange={(e) =>
                      handleInlineUpdate(job._id, "status", e.target.value)
                    }
                    className="px-3 py-2 rounded-lg cursor-pointer bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>

                  <select
                    value={job.jobType}
                    onChange={(e) =>
                      handleInlineUpdate(job._id, "jobType", e.target.value)
                    }
                    className="px-3 py-2 rounded-lg cursor-pointer bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
                  >
                    {jobTypes.map((t) => (
                      <option key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                </Box>

                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 1,
                    color: "#f9fafb",
                    fontStyle: "italic",
                    opacity: 0.9,
                  }}
                >
                  📅 Created: {new Date(job.createdAt).toLocaleDateString()}
                </Typography>

                <Box mt={2} display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      color: "#3b82f6",
                      borderColor: "#3b82f6",
                      "&:hover": { backgroundColor: "rgba(59,130,246,0.1)" },
                    }}
                    onClick={() => navigate(`/home/jobs/${job._id}/edit`)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      color: "#ef4444",
                      borderColor: "#ef4444",
                      "&:hover": { backgroundColor: "rgba(239,68,68,0.1)" },
                    }}
                    onClick={() => {
                      setJobToDelete(job);
                      setOpenDialog(true);
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {numOfPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={numOfPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            sx={{
              "& .MuiPaginationItem-root": { color: "white" },
            }}
          />
        </Box>
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: "#1f2937",
            color: "#f9fafb",
            borderRadius: 3,
            border: "1px solid #374151",
            boxShadow: "0 8px 24px rgba(0,0,0,0.7)",
            minWidth: 360,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "#f87171",
            pb: 1,
          }}
        >
          Confirm Delete
        </DialogTitle>

        <DialogContent sx={{ color: "#e5e7eb", fontSize: 14 }}>
          Are you sure you want to delete this job entry:{" "}
          <b style={{ color: "#22d3ee" }}>{jobToDelete?.position}</b> at{" "}
          <b style={{ color: "#22d3ee" }}>{jobToDelete?.company}</b>?
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              color: "#9ca3af",
              borderColor: "#9ca3af",
              "&:hover": { backgroundColor: "rgba(156,163,175,0.1)" },
            }}
            variant="outlined"
          >
            Cancel
          </Button>

          <Button
            onClick={handleDeleteConfirm}
            sx={{
              color: "#ef4444",
              borderColor: "#ef4444",
              "&:hover": { backgroundColor: "rgba(239,68,68,0.1)" },
            }}
            variant="outlined"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default JobsList;
