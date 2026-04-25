import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { gsap } from "gsap";
import { Pill } from "lucide-react";

const PremiumInput = ({ label, icon, ...props }) => (
  <div className="flex flex-col gap-2 group/input">
    <label className="text-[10px] font-black text-[#6c7a71] uppercase tracking-[0.15em] px-2">{label}</label>
    <div className="relative">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a0a3a5] group-focus-within/input:text-blue-600 transition-colors duration-300">
        {icon}
      </div>
      <input
        {...props}
        className="w-full pl-14 pr-6 py-4 rounded-[20px] bg-blue-50 border-2 border-transparent 
                   text-[#171c1f] text-sm font-semibold outline-none transition-all duration-300
                   focus:bg-white focus:border-blue-200 focus:ring-8 focus:ring-blue-100"
      />
    </div>
  </div>
);

const PremiumTextarea = ({ label, icon, ...props }) => (
  <div className="flex flex-col gap-2 group/input">
    <label className="text-[10px] font-black text-[#6c7a71] uppercase tracking-[0.15em] px-2">{label}</label>
    <div className="relative">
      <div className="absolute left-5 top-5 text-[#a0a3a5] group-focus-within/input:text-blue-600 transition-colors duration-300">
        {icon}
      </div>
      <textarea
        {...props}
        className="w-full pl-14 pr-6 py-4 rounded-[20px] bg-blue-50 border-2 border-transparent 
                   text-[#171c1f] text-sm font-semibold outline-none transition-all duration-300 resize-none
                   focus:bg-white focus:border-blue-200 focus:ring-8 focus:ring-blue-100"
      />
    </div>
  </div>
);

export default function MedicineForm({ isOpen, onClose, onSuccess }) {
  const { register, handleSubmit, control, reset } = useForm();
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sideEffects",
  });

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 });
      gsap.fromTo(modalRef.current, { y: 40, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' });
    }
  }, [isOpen]);


  if (!isOpen) return null;

  const handleClose = () => {
    gsap.to(modalRef.current, { y: 20, opacity: 0, scale: 0.95, duration: 0.3, onComplete: onClose });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
    reset();
    setImages([]);
  };



  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          data[key].forEach((item) => {
            if (item) formData.append(key, item);
          });
        } else {
          formData.append(key, data[key]);
        }
      });

      images.forEach((img) => formData.append("images", img));

      await axios.post("/api/medicine", formData);
      alert("Medicine added ✅");
      onSuccess?.();
      handleClose();
    } catch (err) {
      console.log(err);
      alert("Error adding medicine");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-[#0f171f]/60 backdrop-blur-xl"
        onClick={handleClose}
      />

      <div
        ref={modalRef}
        className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.2)] overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-blue-50 px-10 py-8 border-b border-white/50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-[#171c1f] tracking-tight">Register Pharmaceutical</h2>
            <p className="text-[#6c7a71] text-xs font-bold uppercase tracking-widest mt-1">Medicine Database Integration</p>
          </div>
          <button onClick={handleClose} className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#a0a3a5] hover:text-blue-600 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-8">
          <div>
            <h3 className="text-lg font-black text-[#171c1f] mb-4 flex items-center gap-2">
              <Pill size={20} className="text-blue-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <PremiumInput
                label="Medicine Name"
                placeholder="e.g., Aspirin"
                {...register("name", { required: true })}
                icon={<Pill size={20} />}
              />
              <PremiumInput
                label="Generic Name"
                placeholder="e.g., Acetylsalicylic Acid"
                {...register("genericName")}
                icon={<Pill size={20} />}
              />
            </div>
          </div>

          <PremiumTextarea
            label="Description"
            placeholder="Detailed description of the medicine..."
            {...register("description", { required: true })}
            icon={<Pill size={20} />}
            rows="4"
          />

          <div className="grid grid-cols-2 gap-6">
            <PremiumInput
              label="Dosage"
              placeholder="e.g., 2 times daily"
              {...register("dosage", { required: true })}
              icon={<Pill size={20} />}
            />
            <PremiumInput
              label="Storage Instructions"
              placeholder="e.g., Keep in cool place"
              {...register("storage")}
              icon={<Pill size={20} />}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-[#171c1f] flex items-center gap-2">
                <Pill size={20} className="text-blue-600" />
                Side Effects
              </h3>
              <button
                type="button"
                onClick={() => append("")}
                className="px-4 py-2 bg-blue-50 text-blue-600 font-bold text-xs rounded-lg hover:bg-blue-100 transition"
              >
                + Add Side Effect
              </button>
            </div>
            <div className="space-y-2">
              {fields.map((field, idx) => (
                <div key={field.id} className="flex gap-2">
                  <input
                    {...register(`sideEffects.${idx}`)}
                    placeholder={`Side Effect ${idx + 1}`}
                    className="flex-1 px-4 py-2 rounded-lg bg-blue-50 border border-blue-100 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                  {fields.length > 0 && (
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="px-3 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition text-sm font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-[20px] border-2 border-blue-100">
            <input 
              type="checkbox" 
              {...register("isPrescriptionRequired")} 
              className="w-5 h-5 rounded cursor-pointer"
              id="prescriptionReq"
            />
            <label htmlFor="prescriptionReq" className="text-sm font-bold text-[#171c1f] cursor-pointer">
              Prescription Required for this Medicine
            </label>
          </div>

          <div className="flex gap-4 mt-10">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-5 rounded-3xl bg-blue-50 text-blue-600 font-black text-xs uppercase tracking-widest hover:bg-blue-100 transition-all duration-300"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-5 rounded-3xl bg-linear-to-r from-blue-600 to-blue-500 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Registering...' : 'Register Medicine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}