import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";

export default function DiseaseForm() {
  const { register, handleSubmit, control, reset } = useForm();

  // Dynamic fields
  const { fields: symptoms, append: addSymptom, remove: removeSymptom } =
    useFieldArray({ control, name: "symptoms" });

  const { fields: causes, append: addCause, remove: removeCause } =
    useFieldArray({ control, name: "causes" });

  const { fields: precautions, append: addPrecaution, remove: removePrecaution } =
    useFieldArray({ control, name: "precautions" });

  const { fields: diagnosis, append: addDiagnosis, remove: removeDiagnosis } =
    useFieldArray({ control, name: "diagnosis" });

  const { fields: remedies, append: addRemedy, remove: removeRemedy } =
    useFieldArray({ control, name: "homeRemedies" });

  const onSubmit = async (data) => {
    try {
      await axios.post("/api/disease", data);
      alert("Disease added!");
      reset();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Add Disease</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Name */}
        <input
          placeholder="Disease Name"
          {...register("name", { required: "Name required" })}
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          {...register("description", { required: true })}
        />

        {/* Dynamic Section */}
        {[
          { label: "Symptoms", fields: symptoms, add: addSymptom, remove: removeSymptom, name: "symptoms" },
          { label: "Causes", fields: causes, add: addCause, remove: removeCause, name: "causes" },
          { label: "Precautions", fields: precautions, add: addPrecaution, remove: removePrecaution, name: "precautions" },
          { label: "Diagnosis", fields: diagnosis, add: addDiagnosis, remove: removeDiagnosis, name: "diagnosis" },
          { label: "Home Remedies", fields: remedies, add: addRemedy, remove: removeRemedy, name: "homeRemedies" }
        ].map((section, idx) => (
          <div key={idx}>
            <h4>{section.label}</h4>

            {section.fields.map((item, index) => (
              <div key={item.id}>
                <input
                  placeholder={`${section.label} ${index + 1}`}
                  {...register(`${section.name}.${index}`)}
                />
                <button type="button" onClick={() => section.remove(index)}>
                  ❌
                </button>
              </div>
            ))}

            <button type="button" onClick={() => section.add("")}>
              + Add {section.label}
            </button>
          </div>
        ))}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}