import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MedicineForm() {
  const { register, handleSubmit, control, reset } = useForm();

  const [diseases, setDiseases] = useState([]);

  // Dynamic side effects
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sideEffects",
  });

  // Fetch diseases for dropdown
  useEffect(() => {
    const fetchDiseases = async () => {
      const res = await axios.get("/api/disease");
      setDiseases(res.data);
    };
    fetchDiseases();
  }, []);

  const onSubmit = async (data) => {
    try {
      await axios.post("/api/medicine", data);
      alert("Medicine added!");
      reset();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Add Medicine</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Name */}
        <input
          placeholder="Medicine Name"
          {...register("name", { required: true })}
        />

        {/* Generic Name */}
        <input
          placeholder="Generic Name"
          {...register("genericName")}
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          {...register("description", { required: true })}
        />

        {/* Dosage */}
        <input
          placeholder="Dosage (e.g. 2 times a day)"
          {...register("dosage", { required: true })}
        />

        {/* Storage */}
        <input
          placeholder="Storage info"
          {...register("storage")}
        />

        {/* Prescription Required */}
        <label>
          <input type="checkbox" {...register("isPrescriptionRequired")} />
          Prescription Required
        </label>

        {/* Side Effects (dynamic) */}
        <h4>Side Effects</h4>
        {fields.map((item, index) => (
          <div key={item.id}>
            <input
              placeholder={`Side Effect ${index + 1}`}
              {...register(`sideEffects.${index}`)}
            />
            <button type="button" onClick={() => remove(index)}>
              ❌
            </button>
          </div>
        ))}

        <button type="button" onClick={() => append("")}>
          + Add Side Effect
        </button>

        {/* Diseases Dropdown (multi-select) */}
        <h4>Select Diseases</h4>
        <select multiple {...register("diseases")}>
          {diseases.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>

        <br /><br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}