import JobModel from "../models/job.model.js";

export const CreateJobController = async (req, res) => {
  try {
    const { company, position, status, jobType, description, location } =
      req.body;

    const createdBy = req.user._id;

    if (!company || !position) {
      return res.status(400).json({ message: "Fill all the required details" });
    }

    const newJob = new JobModel({
      company,
      position,
      status,
      jobType,
      description,
      location,
      createdBy,
    });

    await newJob.save();

    return res
      .status(201)
      .json({ message: "Job data added successfully", job: newJob });
  } catch (error) {
    console.log(`Error in Create Job Controller ${error}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const GetJobsController = async (req, res) => {
  try {
    const userId = req.user._id;

    let queryObject = { createdBy: userId };

    if (req.query.search) {
      queryObject.$or = [
        { company: { $regex: req.query.search, $options: "i" } },
        { position: { $regex: req.query.search, $options: "i" } },
      ];
    }

    if (req.query.status) {
      queryObject.status = req.query.status;
    }

    if (req.query.jobType) {
      queryObject.jobType = req.query.jobType;
    }

    let sortOption = { createdAt: -1 };
    if (req.query.sort === "oldest") sortOption = { createdAt: 1 };
    if (req.query.sort === "a-z") sortOption = { company: 1 };
    if (req.query.sort === "z-a") sortOption = { company: -1 };

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const jobs = await JobModel.find(queryObject)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const totalJobs = await JobModel.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalJobs / limit);

    return res.status(200).json({
      jobs,
      totalJobs,
      numOfPages,
      currentPage: page,
    });
  } catch (error) {
    console.log(`Error in Get Jobs Controller ${error}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const GetJobByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await JobModel.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this job" });
    }

    return res.status(200).json({ job: job });
  } catch (error) {
    console.log(`Error in Get Job By Id Controller ${error}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const UpdateJobController = async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.user._id;

    const { company, position, status, jobType, description, location } =
      req.body;

    const job = await JobModel.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (company.trim() === "" || position.trim() === "") {
      return res.status(400).json({ message: "Fill all required fields" });
    }

    if (job.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this job" });
    }

    const updatedJob = await JobModel.findByIdAndUpdate(
      id,
      {
        company,
        position,
        status,
        jobType,
        description,
        location,
      },
      { new: true, runValidators: true }
    );

    return res
      .status(200)
      .json({ message: "Job Updated Successfully", job: updatedJob });
  } catch (error) {
    console.log(`Error in Update Job Controller ${error}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const DeleteJobController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const job = await JobModel.findOneAndDelete({ _id: id, createdBy: userId });

    if (!job) {
      return res
        .status(404)
        .json({ message: "Job not found or not authorized to delete" });
    }

    return res.status(200).json({ message: "Job Deleted Successfully", job });
  } catch (error) {
    console.log(`Error in Delete Job Controller ${error}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
