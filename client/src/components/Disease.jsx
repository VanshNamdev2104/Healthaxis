import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

export default function DiseaseForm() {
  const { register, handleSubmit, control, reset } = useForm();
  const [images, setImages] = useState([]);

  // Dynamic fields
  const createFieldArray = (name) =>
    useFieldArray({ control, name });

  const symptoms = createFieldArray("symptoms");
  const causes = createFieldArray("causes");
  const precautions = createFieldArray("precautions");
  const diagnosis = createFieldArray("diagnosis");
  const remedies = createFieldArray("homeRemedies");

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // text fields
      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          data[key].forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, data[key]);
        }
      });

      // images
      images.forEach((img) => {
        formData.append("images", img);
      });

      await axios.post("/api/disease", formData);

      alert("Disease added ✅");
      reset();
      setImages([]);
    } catch (err) {
      console.log(err);
    }
  };

  const Section = ({ title, fieldArray, name }) => (
    <div className="space-y-2">
      <h3 className="text-white font-semibold">{title}</h3>

      {fieldArray.fields.map((item, index) => (
        <div key={item.id} className="flex gap-2">
          <input
            {...register(`${name}.${index}`)}
            placeholder={`${title} ${index + 1}`}
            className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none"
          />
          <button
            type="button"
            onClick={() => fieldArray.remove(index)}
            className="px-3 bg-red-500/20 text-red-400 rounded-lg"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => fieldArray.append("")}
        className="text-sm text-cyan-400"
      >
        + Add {title}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#030303] p-6">
      <div className="w-full max-w-3xl bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">

        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Add Disease
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Name */}
          <input
            {...register("name", { required: true })}
            placeholder="Disease Name"
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none"
          />

          {/* Description */}
          <textarea
            {...register("description", { required: true })}
            placeholder="Description"
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none"
          />

          {/* Dynamic Sections */}
          <Section title="Symptoms" fieldArray={symptoms} name="symptoms" />
          <Section title="Causes" fieldArray={causes} name="causes" />
          <Section title="Precautions" fieldArray={precautions} name="precautions" />
          <Section title="Diagnosis" fieldArray={diagnosis} name="diagnosis" />
          <Section title="Home Remedies" fieldArray={remedies} name="homeRemedies" />

          {/* Image Upload */}
          <div>
            <h3 className="text-white font-semibold mb-2">Images</h3>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="text-white"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold hover:scale-105 transition"
          >
            Submit Disease
          </button>

        </form>
      </div>
    </div>
  );
}