import Disease from "../../models/health/disease.model.js";
import {
    uploadMultipleToImageKit,
    deleteMultipleFromImageKit,
} from "../../services/storage.service.js";
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

        // Handle multiple image uploads to ImageKit
        let images = [];
        if (req.files && req.files.length > 0) {
            images = await uploadMultipleToImageKit(req.files, "/healthaxis/diseases");
        }

        const disease = await Disease.create({
            name,
            description,
            symptoms: symptoms ? (Array.isArray(symptoms) ? symptoms : JSON.parse(symptoms)) : [],
            causes: causes ? (Array.isArray(causes) ? causes : JSON.parse(causes)) : [],
            precautions: precautions ? (Array.isArray(precautions) ? precautions : JSON.parse(precautions)) : [],
            diagnosis: diagnosis ? (Array.isArray(diagnosis) ? diagnosis : JSON.parse(diagnosis)) : [],
            homeRemedies: homeRemedies ? (Array.isArray(homeRemedies) ? homeRemedies : JSON.parse(homeRemedies)) : [],
            images,
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

        const updateData = {
            name,
            description,
            symptoms: symptoms ? (Array.isArray(symptoms) ? symptoms : JSON.parse(symptoms)) : disease.symptoms,
            causes: causes ? (Array.isArray(causes) ? causes : JSON.parse(causes)) : disease.causes,
            precautions: precautions ? (Array.isArray(precautions) ? precautions : JSON.parse(precautions)) : disease.precautions,
            diagnosis: diagnosis ? (Array.isArray(diagnosis) ? diagnosis : JSON.parse(diagnosis)) : disease.diagnosis,
            homeRemedies: homeRemedies ? (Array.isArray(homeRemedies) ? homeRemedies : JSON.parse(homeRemedies)) : disease.homeRemedies,
        };

        // Handle multiple image uploads — delete all old images, then upload new ones
        if (req.files && req.files.length > 0) {
            // Delete old images from ImageKit
            if (disease.images && disease.images.length > 0) {
                const oldFileIds = disease.images.map((img) => img.fileId);
                await deleteMultipleFromImageKit(oldFileIds);
            }

            // Upload new images
            updateData.images = await uploadMultipleToImageKit(req.files, "/healthaxis/diseases");
        }

        const updatedDisease = await Disease.findByIdAndUpdate(
            req.params.id,
            updateData,
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

        // Delete all images from ImageKit
        if (disease.images && disease.images.length > 0) {
            const fileIds = disease.images.map((img) => img.fileId);
            await deleteMultipleFromImageKit(fileIds);
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
