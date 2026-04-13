import Medicine from "../../models/health/medicine.model.js";
import Disease from "../../models/health/disease.model.js";
import {
    successResponse,
    errorResponse,
    notFoundResponse,
    validationError,
    conflictResponse,
} from "../../utils/responsehandler.js";

/**
 * @desc    Create a new medicine
 * @route   POST /api/health/medicines
 * @access  Private (Admin)
 */
export const createMedicine = async (req, res) => {
    try {
        const { name, genericName, description, dosage, sideEffects, storage, isPrescriptionRequired, diseases } = req.body;

        // Validate that referenced diseases exist
        if (diseases && diseases.length > 0) {
            const existingDiseases = await Disease.find({ _id: { $in: diseases } });
            if (existingDiseases.length !== diseases.length) {
                return validationError(res, "One or more disease IDs are invalid");
            }
        }

        const medicine = await Medicine.create({
            name,
            genericName,
            description,
            dosage,
            sideEffects,
            storage,
            isPrescriptionRequired,
            diseases,
        });

        return successResponse(res, medicine, "Medicine created successfully", 201);
    } catch (error) {
        if (error.name === "ValidationError") {
            return validationError(res, error);
        }
        return errorResponse(res, error, "Failed to create medicine");
    }
};

/**
 * @desc    Get all medicines (with optional search/filter)
 * @route   GET /api/health/medicines
 * @access  Public
 */
export const getAllMedicines = async (req, res) => {
    try {
        const { search, prescription, page = 1, limit = 10 } = req.query;

        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { genericName: { $regex: search, $options: "i" } },
            ];
        }

        if (prescription !== undefined) {  
            query.isPrescriptionRequired = prescription === "true";
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [medicines, total] = await Promise.all([
            Medicine.find(query)
                .populate("diseases", "name")
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 }),
            Medicine.countDocuments(query),
        ]);

        return successResponse(res, {
            medicines,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        }, "Medicines fetched successfully");
    } catch (error) {
        return errorResponse(res, error, "Failed to fetch medicines");
    }
};

/**
 * @desc    Get a single medicine by ID
 * @route   GET /api/health/medicines/:id
 * @access  Public
 */
export const getMedicineById = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id).populate("diseases", "name description symptoms");

        if (!medicine) {
            return notFoundResponse(res, "Medicine not found");
        }

        return successResponse(res, medicine, "Medicine fetched successfully");
    } catch (error) {
        if (error.kind === "ObjectId") {
            return validationError(res, "Invalid medicine ID");
        }
        return errorResponse(res, error, "Failed to fetch medicine");
    }
};

/**
 * @desc    Get medicines by disease ID
 * @route   GET /api/health/medicines/disease/:diseaseId
 * @access  Public
 */
export const getMedicinesByDisease = async (req, res) => {
    try {
        const { diseaseId } = req.params;

        // Verify disease exists
        const disease = await Disease.findById(diseaseId);
        if (!disease) {
            return notFoundResponse(res, "Disease not found");
        }

        const medicines = await Medicine.find({ diseases: diseaseId })
            .populate("diseases", "name")
            .sort({ createdAt: -1 });

        return successResponse(res, { medicines, disease: disease.name }, "Medicines for disease fetched successfully");
    } catch (error) {
        if (error.kind === "ObjectId") {
            return validationError(res, "Invalid disease ID");
        }
        return errorResponse(res, error, "Failed to fetch medicines by disease");
    }
};

/**
 * @desc    Update a medicine
 * @route   PUT /api/health/medicines/:id
 * @access  Private (Admin)
 */
export const updateMedicine = async (req, res) => {
    try {
        const { name, genericName, description, dosage, sideEffects, storage, isPrescriptionRequired, diseases } = req.body;

        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) {
            return notFoundResponse(res, "Medicine not found");
        }

        // Validate that referenced diseases exist
        if (diseases && diseases.length > 0) {
            const existingDiseases = await Disease.find({ _id: { $in: diseases } });
            if (existingDiseases.length !== diseases.length) {
                return validationError(res, "One or more disease IDs are invalid");
            }
        }

        const updatedMedicine = await Medicine.findByIdAndUpdate(
            req.params.id,
            { name, genericName, description, dosage, sideEffects, storage, isPrescriptionRequired, diseases },
            { new: true, runValidators: true }
        ).populate("diseases", "name");

        return successResponse(res, updatedMedicine, "Medicine updated successfully");
    } catch (error) {
        if (error.kind === "ObjectId") {
            return validationError(res, "Invalid medicine ID");
        }
        if (error.name === "ValidationError") {
            return validationError(res, error);
        }
        return errorResponse(res, error, "Failed to update medicine");
    }
};

/**
 * @desc    Delete a medicine
 * @route   DELETE /api/health/medicines/:id
 * @access  Private (Admin)
 */
export const deleteMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);

        if (!medicine) {
            return notFoundResponse(res, "Medicine not found");
        }

        await Medicine.findByIdAndDelete(req.params.id);

        return successResponse(res, null, "Medicine deleted successfully");
    } catch (error) {
        if (error.kind === "ObjectId") {
            return validationError(res, "Invalid medicine ID");
        }
        return errorResponse(res, error, "Failed to delete medicine");
    }
};
