import reportModel from "../../models/hospital/report.model.js";
import prescriptionModel from "../../models/hospital/prescription.model.js";
import appointmentModel from "../../models/hospital/appointment.model.js";
import medicineModel from "../../models/health/medicine.model.js";
import { uploadToImageKit } from "../../services/storage.service.js";
import { geminiModel } from "../../services/ai/model.service.js";
import { HumanMessage } from "@langchain/core/messages";
import logger from "../../config/logger.js";
import { calculateHealthScore } from "../../services/ai/healthScore.service.js";

/**
 * Utility to extract JSON object from AI string responses.
 */
const extractJson = (text) => {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON object found in response");
    return JSON.parse(match[0]);
};

/**
 * Upload and analyze medical report using Gemini Flash
 */
export const uploadReport = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No report file uploaded" });
        }

        logger.info(`Processing medical report upload for user: ${req.user.id}`);

        // 1. Upload to ImageKit
        const uploadResult = await uploadToImageKit(
            req.file.buffer,
            `${Date.now()}_${req.file.originalname}`,
            "/medical-reports"
        );

        // 2. Perform Gemini Flash multimodal analysis
        const base64File = req.file.buffer.toString("base64");
        const mimeType = req.file.mimetype;

        const promptText = `
You are an expert clinical laboratory analysis system. Analyze the attached medical report image or document.
Extract the following information:
1. Report Type: A precise name (e.g., "Complete Blood Count (CBC)", "Lipid Profile", "Thyroid Profile", "Renal Function Test", "Liver Function Test", etc.).
2. Summary: A patient-friendly, helpful summary explaining the overall health findings, any areas of concern, and action steps (in 3-4 clear sentences).
3. Biomarkers: Extract all laboratory parameters/biomarkers. For each biomarker, identify:
   - name: The biomarker name (e.g., "Hemoglobin", "Total Cholesterol", "TSH", "HbA1c").
   - value: The numeric or text value (e.g., "13.5", "210", "5.8").
   - unit: The metric/measurement unit (e.g., "g/dL", "mg/dL", "uIU/mL", "%").
   - flag: Determine if it is "NORMAL", "HIGH", or "LOW" based on standard clinical reference ranges or the ranges printed on the report.
4. Extracted Text: A raw text transcription containing the main report text content.

Your response must be a valid JSON object matching this schema:
{
  "reportType": "string",
  "summary": "string",
  "extractedText": "string",
  "biomarkers": [
    {
      "name": "string",
      "value": "string",
      "unit": "string",
      "flag": "NORMAL | HIGH | LOW"
    }
  ]
}

Return ONLY the JSON. Do not include any markdown formatting, backticks, or explanation.
`;

        const response = await geminiModel.invoke([
            new HumanMessage({
                content: [
                    { type: "text", text: promptText },
                    {
                        type: "image_url",
                        image_url: `data:${mimeType};base64,${base64File}`
                    }
                ]
            })
        ]);

        const textResponse = response?.content || response?.text || String(response);
        logger.info("Gemini medical report analysis response received");

        const parsedResult = extractJson(textResponse);

        // 3. Save report to database
        const newReport = await reportModel.create({
            user: req.user.id,
            reportType: parsedResult.reportType || "General Medical Report",
            fileUrl: uploadResult.url,
            fileId: uploadResult.fileId,
            extractedText: parsedResult.extractedText || "",
            summary: parsedResult.summary || "",
            biomarkers: parsedResult.biomarkers || []
        });

        res.status(201).json({
            success: true,
            message: "Medical report uploaded and analyzed successfully",
            data: newReport
        });
    } catch (error) {
        logger.error(`Error in uploadReport: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Fetch all medical reports for the current user
 */
export const getReports = async (req, res, next) => {
    try {
        const reports = await reportModel.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: reports });
    } catch (error) {
        logger.error(`Error in getReports: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Upload and perform OCR on prescription, matching medicines with existing database
 */
export const uploadPrescription = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No prescription file uploaded" });
        }

        logger.info(`Processing prescription OCR upload for user: ${req.user.id}`);

        // 1. Upload to ImageKit
        const uploadResult = await uploadToImageKit(
            req.file.buffer,
            `${Date.now()}_${req.file.originalname}`,
            "/prescriptions"
        );

        // 2. Perform Gemini Flash OCR
        const base64File = req.file.buffer.toString("base64");
        const mimeType = req.file.mimetype;

        const promptText = `
You are an expert medical transcriptionist. Analyze the attached doctor's hand-written or printed prescription image or document.
Extract all listed medications. For each medication, extract:
- name: The brand or generic name of the medicine (e.g. "Paracetamol", "Amoxicillin", "Atorvastatin").
- dosage: The dosage strength or quantity per intake (e.g. "500mg", "1 tablet").
- duration: The duration to take it (e.g. "5 days", "1 month").
- frequency: How often to take it (e.g. "Twice daily", "1-0-1", "Every 8 hours").

Also extract the rawText: The full transcript of any readable text on the prescription.

Your response must be a valid JSON object matching this schema:
{
  "rawText": "string",
  "medicines": [
    {
      "name": "string",
      "dosage": "string",
      "duration": "string",
      "frequency": "string"
    }
  ]
}

Return ONLY the JSON. Do not include any markdown formatting, backticks, or explanation.
`;

        const response = await geminiModel.invoke([
            new HumanMessage({
                content: [
                    { type: "text", text: promptText },
                    {
                        type: "image_url",
                        image_url: `data:${mimeType};base64,${base64File}`
                    }
                ]
            })
        ]);

        const textResponse = response?.content || response?.text || String(response);
        logger.info("Gemini prescription OCR response received");

        const parsedResult = extractJson(textResponse);

        // 3. Search and fuzzy match against database medicines
        const matchedMedicines = [];
        if (parsedResult.medicines && Array.isArray(parsedResult.medicines)) {
            for (const med of parsedResult.medicines) {
                let matchedMedId = null;
                const cleanName = med.name.trim();

                // Exact match case-insensitive
                let dbMed = await medicineModel.findOne({
                    name: { $regex: new RegExp(`^${cleanName}$`, "i") }
                });

                if (!dbMed) {
                    // Try generic name match
                    dbMed = await medicineModel.findOne({
                        genericName: { $regex: new RegExp(`^${cleanName}$`, "i") }
                    });
                }

                if (!dbMed) {
                    // Fuzzy match (substring)
                    dbMed = await medicineModel.findOne({
                        name: { $regex: new RegExp(cleanName, "i") }
                    });
                }

                if (dbMed) {
                    matchedMedId = dbMed._id;
                }

                matchedMedicines.push({
                    medicine: matchedMedId,
                    name: med.name,
                    dosage: med.dosage || "",
                    duration: med.duration || "",
                    frequency: med.frequency || ""
                });
            }
        }

        // 4. Save prescription to database
        const newPrescription = await prescriptionModel.create({
            user: req.user.id,
            fileUrl: uploadResult.url,
            fileId: uploadResult.fileId,
            rawText: parsedResult.rawText || "",
            medicines: matchedMedicines
        });

        // Fetch populated version to return
        const populatedPrescription = await prescriptionModel.findById(newPrescription._id)
            .populate("medicines.medicine");

        res.status(201).json({
            success: true,
            message: "Prescription OCR parsed and processed successfully",
            data: populatedPrescription
        });
    } catch (error) {
        logger.error(`Error in uploadPrescription: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Fetch all prescriptions for the current user
 */
export const getPrescriptions = async (req, res, next) => {
    try {
        const prescriptions = await prescriptionModel.find({ user: req.user.id })
            .populate("medicines.medicine")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: prescriptions });
    } catch (error) {
        logger.error(`Error in getPrescriptions: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Fetch unified Personal Health Timeline events
 */
export const getTimeline = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // 1. Fetch appointments
        const appointments = await appointmentModel.find({ user: userId })
            .populate("doctor")
            .populate("hospital")
            .sort({ date: -1 });

        // 2. Fetch reports
        const reports = await reportModel.find({ user: userId }).sort({ createdAt: -1 });

        // 3. Fetch prescriptions
        const prescriptions = await prescriptionModel.find({ user: userId })
            .populate("medicines.medicine")
            .sort({ createdAt: -1 });

        // 4. Transform and unify
        const timelineItems = [];

        // Map appointments
        appointments.forEach(appt => {
            timelineItems.push({
                id: appt._id,
                type: "appointment",
                date: appt.date,
                title: `Visit with Dr. ${appt.doctor?.name || "Doctor"}`,
                description: `Specialization: ${appt.doctor?.specialization || "N/A"} at ${appt.hospital?.name || "Hospital"}. Status: ${appt.status}.`,
                details: {
                    status: appt.status,
                    time: appt.time,
                    doctor: appt.doctor,
                    hospital: appt.hospital,
                    serialNo: appt.serialNo
                }
            });
        });

        // Map medical reports
        reports.forEach(report => {
            timelineItems.push({
                id: report._id,
                type: "report",
                date: report.createdAt,
                title: `Medical Report: ${report.reportType}`,
                description: report.summary || `File: ${report.reportType} parsed successfully.`,
                details: {
                    fileUrl: report.fileUrl,
                    biomarkers: report.biomarkers,
                    extractedText: report.extractedText
                }
            });
        });

        // Map prescriptions
        prescriptions.forEach(rx => {
            const medList = rx.medicines.map(m => `${m.name} (${m.dosage || "N/A"} - ${m.frequency || "N/A"})`).join(", ");
            timelineItems.push({
                id: rx._id,
                type: "prescription",
                date: rx.createdAt,
                title: `Prescription Record Added`,
                description: medList ? `Medications: ${medList}` : "Uploaded prescription parsed.",
                details: {
                    fileUrl: rx.fileUrl,
                    medicines: rx.medicines,
                    rawText: rx.rawText
                }
            });
        });

        // Sort unified timeline by date descending
        timelineItems.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.status(200).json({
            success: true,
            data: timelineItems
        });
    } catch (error) {
        logger.error(`Error in getTimeline: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Fetch patient health index score calculations
 */
export const getHealthScore = async (req, res, next) => {
    try {
        const bmi = req.query.bmi ? parseFloat(req.query.bmi) : undefined;
        logger.info(`Calculating health score for patient ID: ${req.user.id}`);
        const result = await calculateHealthScore(req.user.id, bmi);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        logger.error(`Error in getHealthScore controller: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};
