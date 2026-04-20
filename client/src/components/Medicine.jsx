import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MedicineForm() {
  const { register, handleSubmit, control, reset } = useForm();
  const [images, setImages] = useState([]);
  const [diseases, setDiseases] = useState([]);

  // Dynamic sideEffects
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sideEffects",
  });

  // Fetch diseases (for relation)
  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const res = await axios.get("/api/disease");
        setDiseases(res.data.data || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchDiseases();
  }, []);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // normal fields
      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          data[key].forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, data[key]);
        }
      });

      // images
      images.forEach((img) => formData.append("images", img));

      await axios.post("/api/medicine", formData);

      alert("Medicine added ✅");
      reset();
      setImages([]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030303] p-6">
      <div className="w-full max-w-3xl bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">

        <h2 className="text-2xl text-white font-bold mb-6 text-center">
          Add Medicine
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Name */}
          <input
            {...register("name", { required: true })}
            placeholder="Medicine Name"
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none"
          />

          {/* Generic Name */}
          <input
            {...register("genericName")}
            placeholder="Generic Name"
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none"
          />

          {/* Description */}
          <textarea
            {...register("description", { required: true })}
            placeholder="Description"
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none"
          />

          {/* Dosage */}
          <input
            {...register("dosage", { required: true })}
            placeholder="Dosage (e.g. 2 times daily)"
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none"
          />

          {/* Storage */}
          <input
            {...register("storage")}
            placeholder="Storage (e.g. Keep in cool place)"
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none"
          />

          {/* Prescription Required */}
          <div className="flex items-center gap-2 text-white">
            <input type="checkbox" {...register("isPrescriptionRequired")} />
            <label>Prescription Required</label>
          </div>

          {/* Side Effects */}
          <div>
            <h3 className="text-white font-semibold mb-2">Side Effects</h3>

            {fields.map((item, index) => (
              <div key={item.id} className="flex gap-2 mb-2">
                <input
                  {...register(`sideEffects.${index}`)}
                  placeholder={`Side Effect ${index + 1}`}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="px-3 bg-red-500/20 text-red-400 rounded-lg"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => append("")}
              className="text-cyan-400 text-sm"
            >
              + Add Side Effect
            </button>
          </div>

          {/* Diseases Multi Select */}
          <div>
            <h3 className="text-white font-semibold mb-2">Related Diseases</h3>

            <select
              multiple
              {...register("diseases")}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
            >
              {diseases.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Images */}
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
            Submit Medicine
          </button>

        </form>
      </div>
    </div>
  );
}