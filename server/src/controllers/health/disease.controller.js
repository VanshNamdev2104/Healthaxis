import Disease from "../../models/health/disease.model.js";
import {
    successResponse,
    errorResponse,
    notFoundResponse,
    validationError,
    conflictResponse,
} from "../../utils/responsehandler.js";

/**
 * @desc    Create a new disease
 * @route   POST /api/health/diseases
 * @access  Private (Admin)
 */
export const createDisease = async (req, res) => {
    try {
        const { name, description, symptoms, causes, precautions, diagnosis, homeRemedies } = req.body;

        // Check if disease already exists (name is unique)
        const existingDisease = await Disease.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
        if (existingDisease) {
            return conflictResponse(res, "Disease with this name already exists");
        }

        const disease = await Disease.create({
            name,
            description,
            symptoms,
            causes,
            precautions,
            diagnosis,
            homeRemedies,
        });

        return successResponse(res, disease, "Disease created successfully", 201);
    } catch (error) {
        if (error.name === "ValidationError") {
            return validationError(res, error);
        }
        return errorResponse(res, error, "Failed to create disease");
    }
};

/**
 * @desc    Get all diseases (with optional search/filter)
 * @route   GET /api/health/diseases
 * @access  Public
 */
export const getAllDiseases = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;

        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { symptoms: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [diseases, total] = await Promise.all([
            Disease.find(query).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
            Disease.countDocuments(query),
        ]);

        return successResponse(res, {
            diseases,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        }, "Diseases fetched successfully");
    } catch (error) {
        return errorResponse(res, error, "Failed to fetch diseases");
    }
};

/**
 * @desc    Get a single disease by ID
 * @route   GET /api/health/diseases/:id
 * @access  Public
 */
export const getDiseaseById = async (req, res) => {
    try {
        const disease = await Disease.findById(req.params.id);

        if (!disease) {
            return notFoundResponse(res, "Disease not found");
        }

        return successResponse(res, disease, "Disease fetched successfully");
    } catch (error) {
        if (error.kind === "ObjectId") {
            return validationError(res, "Invalid disease ID");
        }
        return errorResponse(res, error, "Failed to fetch disease");
    }
};

/**
 * @desc    Update a disease
 * @route   PUT /api/health/diseases/:id
 * @access  Private (Admin)
 */
export const updateDisease = async (req, res) => {
    try {
        const { name, description, symptoms, causes, precautions, diagnosis, homeRemedies } = req.body;

        const disease = await Disease.findById(req.params.id);
        if (!disease) {
            return notFoundResponse(res, "Disease not found");
        }

        // If name is being changed, check for duplicates
        if (name && name !== disease.name) {
            const existingDisease = await Disease.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
            if (existingDisease) {
                return conflictResponse(res, "Disease with this name already exists");
            }
        }

        const updatedDisease = await Disease.findByIdAndUpdate(
            req.params.id,
            { name, description, symptoms, causes, precautions, diagnosis, homeRemedies },
            { new: true, runValidators: true }
        );

        return successResponse(res, updatedDisease, "Disease updated successfully");
    } catch (error) {
        if (error.kind === "ObjectId") {
            return validationError(res, "Invalid disease ID");
        }
        if (error.name === "ValidationError") {
            return validationError(res, error);
        }
        return errorResponse(res, error, "Failed to update disease");
    }
};

/**
 * @desc    Delete a disease
 * @route   DELETE /api/health/diseases/:id
 * @access  Private (Admin)
 */
export const deleteDisease = async (req, res) => {
    try {
        const disease = await Disease.findById(req.params.id);

        if (!disease) {
            return notFoundResponse(res, "Disease not found");
        }

        await Disease.findByIdAndDelete(req.params.id);

        return successResponse(res, null, "Disease deleted successfully");
    } catch (error) {
        if (error.kind === "ObjectId") {
            return validationError(res, "Invalid disease ID");
        }
        return errorResponse(res, error, "Failed to delete disease");
    }
};

