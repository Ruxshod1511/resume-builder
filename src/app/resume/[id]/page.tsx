"use client";

import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useRef,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { TbFileTextSpark } from "react-icons/tb";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/Firebase.config";
import { Drawer } from "vaul";
import { toast, Toaster } from "react-hot-toast";
import Select from "react-select";

interface SelectOption {
  label: string;
  value: string;
}

type Project = {
  projectName: string;
  deployLink: string;
  repositoryLink: string;
  description: string;
};

type Language = {
  name: string;
  proficiency: number;
};

type Experience = {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  isPresent: boolean;
  description: string;
};

type Education = {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  isPresent: boolean;
  description: string;
};

type Skill = {
  name: string;
  proficiency: number;
};

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  address: string;
  jobTitle: string;
  summary: string;
  experiences: Experience[];
  projects: Project[];
  education: Education[];
  languages: Language[];
  skills: Skill[];
};

type Errors = Partial<
  Omit<
    FormData,
    "experiences" | "projects" | "education" | "skills" | "languages"
  >
>;

const initialFormData: FormData = {
  fullName: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
  portfolio: "",
  address: "",
  jobTitle: "",
  summary: "",
  experiences: [],
  projects: [],
  education: [],
  skills: [],
  languages: [],
};

const initialExperience: Experience = {
  company: "",
  role: "",
  location: "",
  startDate: "",
  endDate: "",
  isPresent: false,
  description: "",
};

const initialProject: Project = {
  projectName: "",
  deployLink: "",
  repositoryLink: "",
  description: "",
};

const initialEducation: Education = {
  institution: "",
  degree: "",
  fieldOfStudy: "",
  startDate: "",
  endDate: "",
  isPresent: false,
  description: "",
};

const initialSkill: Skill = {
  name: "",
  proficiency: 1,
};
const initialLanguage: Language = {
  name: "",
  proficiency: 1,
};

const initialErrors: Errors = {
  fullName: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
  portfolio: "",
  address: "",
  jobTitle: "",
  summary: "",
};

const skillOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "react", label: "React" },
  { value: "nextjs", label: "Next.js" },
  { value: "nodejs", label: "Node.js" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "php", label: "PHP" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "sass", label: "SASS" },
  { value: "tailwind", label: "Tailwind CSS" },
  { value: "bootstrap", label: "Bootstrap" },
  { value: "mongodb", label: "MongoDB" },
  { value: "mysql", label: "MySQL" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "firebase", label: "Firebase" },
  { value: "aws", label: "AWS" },
  { value: "docker", label: "Docker" },
  { value: "git", label: "Git" },
  { value: "figma", label: "Figma" },
  { value: "photoshop", label: "Photoshop" },
  { value: "illustrator", label: "Illustrator" },
  { value: "xd", label: "Adobe XD" },
];
const LanguageOptions = [
  { value: "english", label: "english" },
  { value: "russion", label: "russion" },
  { value: "uzbek", label: "uzbek" },
];

const Page = () => {
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerOpenProject, setIsDrawerOpenProject] = useState(false);
  const [isDrawerOpenEducation, setIsDrawerOpenEducation] = useState(false);
  const [isDrawerOpenSkill, setIsDrawerOpenSkill] = useState(false);
  const [isDrawerOpenLanguage, setIsDrawerOpenLanguage] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [experience, setExperience] = useState<Experience>(initialExperience);
  const [project, setProject] = useState<Project>(initialProject);
  const [education, setEducation] = useState<Education>(initialEducation);
  const [skill, setSkill] = useState<Skill>(initialSkill);
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [errors, setErrors] = useState<Errors>(initialErrors);
  const [loading, setLoading] = useState(true);

  const validateInput = (name: keyof Errors, value: string): string => {
    switch (name) {
      case "fullName":
        return value.trim() ? "" : "Full name is required";
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Invalid email address";
      case "phone":
        return /^\+?[0-9]{10,15}$/.test(value)
          ? ""
          : "Phone must be 10-15 digits";
      case "linkedin":
        return value && !/^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(value)
          ? "Invalid LinkedIn URL"
          : "";
      case "github":
        return value && !/^https?:\/\/(www\.)?github\.com\/.*$/.test(value)
          ? "Invalid GitHub URL"
          : "";
      case "portfolio":
        return value && !/^https?:\/\/.*$/.test(value)
          ? "Invalid portfolio URL"
          : "";
      case "address":
        return value.trim() ? "" : "Address is required";
      case "jobTitle":
        return value.trim() ? "" : "Job title is required";
      case "summary":
        return value.trim() ? "" : "Summary is required";
      default:
        return "";
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateInput(name as keyof Errors, value),
    }));
  };

  const fetchData = async () => {
    try {
      if (!id) return;

      const docRef = doc(db, "rsFile", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as FormData;
        setFormData({
          ...initialFormData,
          ...data,
          experiences: data.experiences || [],
          projects: data.projects || [],
          education: data.education || [],
          skills: data.skills || [],
          languages: data.languages || [],
        });
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log(error);

      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Errors = {};
    Object.keys(formData).forEach((key) => {
      if (
        key === "experiences" ||
        key === "projects" ||
        key === "education" ||
        key === "skills" ||
        key === "languages"
      )
        return;
      const value = formData[key as keyof FormData];
      if (typeof value === "string") {
        const error = validateInput(key as keyof Errors, value);
        if (error) newErrors[key as keyof Errors] = error;
      }
    });

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      if (!id) throw new Error("No document ID");

      const docRef = doc(db, "rsFile", id);
      await updateDoc(docRef, formData);
      toast.success("Resume saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data");
    }
  };

  const handleExperienceChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setExperience((prev) => ({
        ...prev,
        isPresent: (e.target as HTMLInputElement).checked,
        endDate: (e.target as HTMLInputElement).checked ? "" : prev.endDate,
      }));
    } else {
      setExperience((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEducationChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setEducation((prev) => ({
        ...prev,
        isPresent: (e.target as HTMLInputElement).checked,
        endDate: (e.target as HTMLInputElement).checked ? "" : prev.endDate,
      }));
    } else {
      setEducation((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleProjectChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillSelectChange = (selectedOption: SelectOption | null) => {
    setSkill((prev) => ({
      ...prev,
      name: selectedOption ? selectedOption.label : "",
    }));
  };
  const handleLanguageSelectChange = (selectedOption: SelectOption | null) => {
    setLanguage((prev) => ({
      ...prev,
      name: selectedOption ? selectedOption.label : "",
    }));
  };

  const handleProficiencyChange = (rating: number) => {
    setSkill((prev) => ({
      ...prev,
      proficiency: rating,
    }));
  };
  const handleProficiencyChangeLanguage = (rating: number) => {
    setLanguage((prev) => ({
      ...prev,
      proficiency: rating,
    }));
  };

  const handleExperienceSave = (e: FormEvent) => {
    e.preventDefault();

    if (!experience.company || !experience.role || !experience.startDate) {
      toast.error("Please fill required fields (Company, Role, Start Date)");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          ...experience,
          endDate: experience.isPresent ? "Present" : experience.endDate,
        },
      ],
    }));

    setExperience(initialExperience);
    setIsDrawerOpen(false);
    toast.success("Experience added!");
  };

  const handleEducationSave = (e: FormEvent) => {
    e.preventDefault();

    if (!education.institution || !education.degree || !education.startDate) {
      toast.error(
        "Please fill required fields (Institution, Degree, Start Date)"
      );
      return;
    }

    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          ...education,
          endDate: education.isPresent ? "Present" : education.endDate,
        },
      ],
    }));

    setEducation(initialEducation);
    setIsDrawerOpenEducation(false);
    toast.success("Education added!");
  };

  const handleProjectSave = (e: FormEvent) => {
    e.preventDefault();

    if (!project.projectName || !project.repositoryLink) {
      toast.error(
        "Please fill required fields (Project Name and Repository Link)"
      );
      return;
    }

    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, project],
    }));

    setProject(initialProject);
    setIsDrawerOpenProject(false);
    toast.success("Project added!");
  };

  const handleSkillSave = (e: FormEvent) => {
    e.preventDefault();

    if (!skill.name) {
      toast.error("Please select a skill");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));

    setSkill(initialSkill);
    setIsDrawerOpenSkill(false);
    toast.success("Skill added!");
  };

  const handleLanguageSave = (e: FormEvent) => {
    e.preventDefault();

    if (!language.name) {
      toast.error("Please select a language");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      languages: [...prev.languages, language],
    }));

    setLanguage(initialLanguage);
    setIsDrawerOpenLanguage(false);
    toast.success("Language added!");
  };

  const handleRemoveExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
    toast.success("Experience removed");
  };

  const handleRemoveProject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
    toast.success("Project removed");
  };

  const handleRemoveEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
    toast.success("Education removed");
  };

  const handleRemoveSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
    toast.success("Skill removed");
  };

  const handleRemoveLanguage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
    toast.success("Language removed");
  };
  const contentRef = useRef<HTMLDivElement>(null);

  const handleGeneratePDF = async () => {
    if (!contentRef.current) {
      toast.error("Content not available for PDF generation");
      return;
    }

    // Set PDF options
    const options = {
      margin: 0,
      filename: `${formData.fullName || "resume"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2, // yuqori aniqlik uchun
        useCORS: true,
        backgroundColor: "#FFFFFF",
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794, // A4 eni (px)
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    };

    try {
      const html2pdf = (await import("html2pdf.js")).default;
      await html2pdf().set(options).from(contentRef.current).save();

      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto md:p-4  text-amber-50 flex gap-3 flex-wrap">
      <Toaster position="top-center" reverseOrder={false} />
      <form
        onSubmit={handleSubmit}
        className="bg-[#1E212B] min-h-[80vh] max-w-xl p-4 sm:p-6 rounded-lg shadow-lg scroll-auto h-full overflow-y-auto"
      >
        <h1
          className="text-2xl sm:text-3xl flex items-center gap-2 mb-6"
          style={{ fontFamily: "cursive" }}
        >
          <TbFileTextSpark className="text-blue-500" />
          General
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {(
            [
              {
                label: "Full Name",
                name: "fullName",
                type: "text",
                placeholder: "Enter your full name...",
                required: true,
              },
              {
                label: "Email Address",
                name: "email",
                type: "email",
                placeholder: "Enter your email address...",
                required: true,
              },
              {
                label: "Phone Number",
                name: "phone",
                type: "tel",
                placeholder: "Enter your phone number...",
                required: true,
              },
              {
                label: "LinkedIn",
                name: "linkedin",
                type: "url",
                placeholder: "Enter your LinkedIn profile link...",
                required: false,
              },
              {
                label: "GitHub",
                name: "github",
                type: "url",
                placeholder: "Enter your GitHub profile link...",
                required: false,
              },
              {
                label: "Portfolio",
                name: "portfolio",
                type: "url",
                placeholder: "Enter your portfolio link...",
                required: false,
              },
              {
                label: "Address",
                name: "address",
                type: "text",
                placeholder: "Enter your address...",
                required: true,
              },
              {
                label: "Job Title",
                name: "jobTitle",
                type: "text",
                placeholder: "Enter your job title...",
                required: true,
              },
            ] as const
          ).map(({ label, name, type, placeholder, required }) => (
            <div key={name}>
              <label
                className="block text-sm font-medium mb-2"
                style={{ fontFamily: "cursive" }}
              >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                style={{ fontFamily: "cursive" }}
                className={`bg-[#222630] h-12 px-4 py-3 outline-none w-full text-white rounded-lg border-2 ${
                  errors[name] ? "border-red-500" : "border-[#2B3040]"
                } focus:border-[#596A95] transition-colors duration-100`}
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
              />
              {errors[name] && (
                <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <label
            className="block text-sm font-medium mb-2"
            style={{ fontFamily: "cursive" }}
          >
            Summary (About Yourself) <span className="text-red-500">*</span>
          </label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            className={`bg-[#222630] min-h-[8rem] px-4 py-3 outline-none w-full text-white rounded-lg border-2 ${
              errors.summary ? "border-red-500" : "border-[#2B3040]"
            } focus:border-[#596A95] transition-colors duration-100`}
            placeholder="Write a brief summary about yourself..."
            style={{ fontFamily: "cursive" }}
            required
          ></textarea>
          {errors.summary && (
            <p className="text-red-500 text-sm mt-1">{errors.summary}</p>
          )}
        </div>

        {/* Experiences */}
        <div className="mt-8">
          <h1 style={{ fontFamily: "cursive" }} className="text-xl mb-2">
            Work Experience
          </h1>
          {formData.experiences.length > 0 ? (
            <div className="mb-4 space-y-3">
              {formData.experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="bg-[#23273A] rounded-lg p-3 text-white flex flex-col gap-1 border border-[#2B3040] relative"
                >
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-lg"
                    onClick={() => handleRemoveExperience(idx)}
                    title="Remove"
                  >
                    ×
                  </button>
                  <div className="font-bold">
                    {exp.role} — {exp.company}
                  </div>
                  <div className="text-sm">{exp.location}</div>
                  <div className="text-xs opacity-80">
                    {exp.startDate} -{" "}
                    {exp.isPresent ? "Present" : exp.endDate || "Not specified"}
                  </div>
                  <div className="text-sm">{exp.description}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 mb-4">No experiences added yet</p>
          )}

          <Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <Drawer.Trigger asChild>
              <button
                type="button"
                style={{
                  fontFamily: "cursive",
                  borderRadius: "10px",
                  border: "2px dashed #2B3050",
                }}
                className="w-full p-4 mt-2 bg-[#23273A] text-white hover:bg-[#2a2e3a] transition-colors"
              >
                + Add Experience
              </button>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40" />
              <Drawer.Content className="bg-white flex flex-col fixed bottom-0 left-0 right-0 rounded-t-[20px] max-h-[90vh]">
                <div className="max-w-md w-full mx-auto p-6 rounded-t-[20px] overflow-x-hidden">
                  <Drawer.Handle className="mx-auto w-12 h-1.5 bg-gray-300 rounded-full mt-2" />
                  <Drawer.Title
                    style={{ fontFamily: "cursive" }}
                    className="font-bold text-gray-900 text-center mt-4 text-xl"
                  >
                    Add Work Experience
                  </Drawer.Title>
                  <form onSubmit={handleExperienceSave}>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="company"
                          className="font-semibold text-gray-700 text-sm block mb-2"
                          style={{ fontFamily: "cursive" }}
                        >
                          Company <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          value={experience.company}
                          onChange={handleExperienceChange}
                          className="border border-gray-300 bg-white w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                          placeholder="Example: Google"
                          style={{ fontFamily: "cursive" }}
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="role"
                          className="font-semibold text-gray-700 text-sm block mb-2"
                          style={{ fontFamily: "cursive" }}
                        >
                          Role <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="role"
                          name="role"
                          type="text"
                          value={experience.role}
                          onChange={handleExperienceChange}
                          className="border border-gray-300 bg-white w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                          placeholder="Example: Software Engineer"
                          style={{ fontFamily: "cursive" }}
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="location"
                          className="font-semibold text-gray-700 text-sm block mb-2"
                          style={{ fontFamily: "cursive" }}
                        >
                          Location
                        </label>
                        <input
                          id="location"
                          name="location"
                          type="text"
                          value={experience.location}
                          onChange={handleExperienceChange}
                          className="border border-gray-300 bg-white w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                          placeholder="Example: San Francisco, CA"
                          style={{ fontFamily: "cursive" }}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="startDate"
                          className="font-semibold text-gray-700 text-sm block mb-2"
                          style={{ fontFamily: "cursive" }}
                        >
                          Start Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="startDate"
                          name="startDate"
                          type="date"
                          value={experience.startDate}
                          onChange={handleExperienceChange}
                          className="border border-gray-300 bg-white w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                          style={{ fontFamily: "cursive" }}
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="endDate"
                          className="font-semibold text-gray-700 text-sm block mb-2"
                          style={{ fontFamily: "cursive" }}
                        >
                          End Date
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            id="endDate"
                            name="endDate"
                            type="date"
                            value={
                              experience.isPresent ? "" : experience.endDate
                            }
                            onChange={handleExperienceChange}
                            disabled={experience.isPresent}
                            className="border border-gray-300 bg-white w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                            style={{ fontFamily: "cursive" }}
                          />
                        </div>
                        <label className="flex items-center ml-1 gap-1 text-xs text-gray-700 mt-3">
                          <input
                            type="checkbox"
                            name="isPresent"
                            checked={experience.isPresent}
                            onChange={handleExperienceChange}
                            className="accent-blue-600"
                          />
                          Currently working here
                        </label>
                      </div>
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="description"
                          className="font-semibold text-gray-700 text-sm block mb-2"
                          style={{ fontFamily: "cursive" }}
                        >
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={experience.description}
                          onChange={handleExperienceChange}
                          className="border-gray-300 bg-white min-h-[5rem] px-4 py-3 outline-none w-full text-black rounded-lg border-2"
                          style={{ fontFamily: "cursive" }}
                          placeholder="Describe your responsibilities and achievements..."
                        ></textarea>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="h-11 bg-blue-600 text-white rounded-lg mt-6 w-full font-semibold transition-colors hover:bg-blue-700"
                    >
                      Save Experience
                    </button>
                  </form>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </div>

        {/* Projects */}
        <div className="mt-8">
          <h1 style={{ fontFamily: "cursive" }} className="text-xl mb-2">
            Projects
          </h1>
          {formData.projects.length > 0 ? (
            <div className="mb-4 space-y-3">
              {formData.projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="bg-[#23273A] rounded-lg p-3 text-white flex flex-col gap-1 border border-[#2B3040] relative"
                >
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-lg"
                    onClick={() => handleRemoveProject(idx)}
                    title="Remove"
                  >
                    ×
                  </button>
                  <div className="font-bold">{proj.projectName}</div>
                  {proj.deployLink && (
                    <div className="text-sm">
                      <a
                        href={proj.deployLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        View Live
                      </a>
                    </div>
                  )}
                  <div className="text-sm">
                    <a
                      href={proj.repositoryLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      View Code
                    </a>
                  </div>
                  {proj.description && (
                    <div className="text-sm mt-2">{proj.description}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 mb-4">No projects added yet</p>
          )}

          <Drawer.Root
            open={isDrawerOpenProject}
            onOpenChange={setIsDrawerOpenProject}
          >
            <Drawer.Trigger asChild>
              <button
                type="button"
                style={{
                  fontFamily: "cursive",
                  borderRadius: "10px",
                  border: "2px dashed #2B3050",
                }}
                className="w-full p-4 mt-2 bg-[#23273A] text-white hover:bg-[#2a2e3a] transition-colors"
              >
                + Add Project
              </button>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40" />
              <Drawer.Content className="bg-white flex flex-col fixed bottom-0 left-0 right-0 rounded-t-[20px] max-h-[90vh]">
                <div className="max-w-md w-full mx-auto p-6 rounded-t-[20px]">
                  <Drawer.Handle className="mx-auto w-12 h-1.5 bg-gray-300 rounded-full mt-2" />
                  <Drawer.Title
                    style={{ fontFamily: "cursive" }}
                    className="font-bold text-gray-900 text-center mt-4 text-xl"
                  >
                    Add Project
                  </Drawer.Title>
                  <form onSubmit={handleProjectSave}>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="projectName"
                          className="font-semibold text-gray-700 text-sm block mb-2"
                          style={{ fontFamily: "cursive" }}
                        >
                          Project Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="projectName"
                          name="projectName"
                          type="text"
                          value={project.projectName}
                          onChange={handleProjectChange}
                          className="border border-gray-300 bg-white w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                          placeholder="Example: E-commerce Website"
                          style={{ fontFamily: "cursive" }}
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="deployLink"
                          className="font-semibold text-gray-700 text-sm block mb-2"
                          style={{ fontFamily: "cursive" }}
                        >
                          Deploy Link
                        </label>
                        <input
                          id="deployLink"
                          name="deployLink"
                          type="url"
                          value={project.deployLink}
                          onChange={handleProjectChange}
                          className="border border-gray-300 bg-white w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                          placeholder="Example: https://myapp.vercel.app"
                          style={{ fontFamily: "cursive" }}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="repositoryLink"
                          className="font-semibold text-gray-700 text-sm block mb-2"
                          style={{ fontFamily: "cursive" }}
                        >
                          Repository Link{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="repositoryLink"
                          name="repositoryLink"
                          type="url"
                          value={project.repositoryLink}
                          onChange={handleProjectChange}
                          className="border border-gray-300 bg-white w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                          placeholder="Example: https://github.com/user/repo"
                          style={{ fontFamily: "cursive" }}
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="description"
                          className="font-semibold text-gray-700 text-sm block mb-2"
                          style={{ fontFamily: "cursive" }}
                        >
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={project.description}
                          onChange={handleProjectChange}
                          className="border-gray-300 bg-white min-h-[5rem] px-4 py-3 outline-none w-full text-black rounded-lg border-2"
                          style={{ fontFamily: "cursive" }}
                          placeholder="Describe the project, technologies used, and your role..."
                        ></textarea>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="h-11 bg-blue-600 text-white rounded-lg mt-6 w-full font-semibold transition-colors hover:bg-blue-700"
                    >
                      Save Project
                    </button>
                  </form>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </div>

        {/* Education */}
        <div className="mt-8">
          <h1 style={{ fontFamily: "cursive" }} className="text-xl mb-2">
            Education
          </h1>
          {formData.education.length > 0 ? (
            <div className="mb-4 space-y-3">
              {formData.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="bg-[#23273A] rounded-lg p-3 text-white flex flex-col gap-1 border border-[#2B3040] relative"
                >
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-lg"
                    onClick={() => handleRemoveEducation(idx)}
                    title="Remove"
                  >
                    ×
                  </button>
                  <div className="font-bold">
                    {edu.degree} — {edu.institution}
                  </div>
                  <div className="text-sm">{edu.fieldOfStudy}</div>
                  <div className="text-xs opacity-80">
                    {edu.startDate} -{" "}
                    {edu.isPresent ? "Present" : edu.endDate || "Not specified"}
                  </div>
                  <div className="text-sm">{edu.description}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 mb-4">No education added yet</p>
          )}

          <Drawer.Root
            open={isDrawerOpenEducation}
            onOpenChange={setIsDrawerOpenEducation}
          >
            <Drawer.Trigger asChild>
              <button
                type="button"
                style={{
                  fontFamily: "cursive",
                  borderRadius: "10px",
                  border: "2px dashed #2B3050",
                }}
                className="w-full p-4 mt-2 bg-[#23273A] text-white hover:bg-[#2a2e3a] transition-colors"
              >
                + Add Education
              </button>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40" />
              <Drawer.Content className="bg-white flex flex-col fixed bottom-0 left-0 right-0 rounded-t-[20px] max-h-[90vh]">
                <div className="max-w-md w-full mx-auto p-6 rounded-t-[20px] overflow-x-hidden">
                  <Drawer.Handle className="mx-auto w-12 h-1.5 bg-gray-300 rounded-full mt-2" />
                  <Drawer.Title
                    style={{ fontFamily: "cursive" }}
                    className="font-bold text-gray-900 text-center mt-4 text-xl"
                  >
                    Add Education
                  </Drawer.Title>
                  <form onSubmit={handleEducationSave}>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="institution"
                          className="font-semibold text-gray-700 text-sm block mb-2"
                          style={{ fontFamily: "cursive" }}
                        >
                          Institution <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="institution"
                          name="institution"
                          type="text"
                          value={education.institution}
                          onChange={handleEducationChange}
                          className="border border-gray-300 bg-white w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                          placeholder="Example: Harvard University"
                          style={{ fontFamily: "cursive" }}
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="degree"
                          className="font-semibold text-gray-700 text-sm block mb-2"
                          style={{ fontFamily: "cursive" }}
                        >
                          Degree <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="degree"
                          name="degree"
                          type="text"
                          value={education.degree}
                          onChange={handleEducationChange}
                          className="border border-gray-300 bg-white w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                          placeholder="Example: Bachelor of Science"
                          style={{ fontFamily: "cursive" }}
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="fieldOfStudy"
                          className="font-semibold text-gray-700 text-sm block mb-2"
                          style={{ fontFamily: "cursive" }}
                        >
                          Field of Study
                        </label>
                        <input
                          id="fieldOfStudy"
                          name="fieldOfStudy"
                          type="text"
                          value={education.fieldOfStudy}
                          onChange={handleEducationChange}
                          className="border border-gray-300 bg-white w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                          placeholder="Example: Computer Science"
                          style={{ fontFamily: "cursive" }}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="startDate"
                          className="font-semibold text-gray-700 text-sm block mb-2"
                          style={{ fontFamily: "cursive" }}
                        >
                          Start Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="startDate"
                          name="startDate"
                          type="date"
                          value={education.startDate}
                          onChange={handleEducationChange}
                          className="border border-gray-300 bg-white w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                          style={{ fontFamily: "cursive" }}
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="endDate"
                          className="font-semibold text-gray-700 text-sm block mb-2"
                          style={{ fontFamily: "cursive" }}
                        >
                          End Date
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            id="endDate"
                            name="endDate"
                            type="date"
                            value={education.isPresent ? "" : education.endDate}
                            onChange={handleEducationChange}
                            disabled={education.isPresent}
                            className="border border-gray-300 bg-white w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                            style={{ fontFamily: "cursive" }}
                          />
                        </div>
                        <label className="flex items-center ml-1 gap-1 text-xs text-gray-700 mt-3">
                          <input
                            type="checkbox"
                            name="isPresent"
                            checked={education.isPresent}
                            onChange={handleEducationChange}
                            className="accent-blue-600"
                          />
                          Currently studying here
                        </label>
                      </div>
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="description"
                          className="font-semibold text-gray-700 text-sm block mb-2"
                          style={{ fontFamily: "cursive" }}
                        >
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={education.description}
                          onChange={handleEducationChange}
                          className="border-gray-300 bg-white min-h-[5rem] px-4 py-3 outline-none w-full text-black rounded-lg border-2"
                          style={{ fontFamily: "cursive" }}
                          placeholder="Describe your coursework, achievements, etc..."
                        ></textarea>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="h-11 bg-blue-600 text-white rounded-lg mt-6 w-full font-semibold transition-colors hover:bg-blue-700"
                    >
                      Save Education
                    </button>
                  </form>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </div>

        {/* Skills */}
        <div className="mt-8">
          <h1 style={{ fontFamily: "cursive" }} className="text-xl mb-2">
            Skills
          </h1>
          {formData.skills.length > 0 ? (
            <div className="mb-4 space-y-3">
              {formData.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="bg-[#23273A] rounded-lg p-3 text-white flex flex-col gap-1 border border-[#2B3040] relative"
                >
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-lg"
                    onClick={() => handleRemoveSkill(idx)}
                    title="Remove"
                  >
                    ×
                  </button>
                  <div className="font-bold">{skill.name}</div>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-lg ${
                          star <= skill.proficiency
                            ? "text-yellow-400"
                            : "text-gray-400"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 mb-4">No skills added yet</p>
          )}

          <Drawer.Root
            open={isDrawerOpenSkill}
            onOpenChange={setIsDrawerOpenSkill}
          >
            <Drawer.Trigger asChild>
              <button
                type="button"
                style={{
                  fontFamily: "cursive",
                  borderRadius: "10px",
                  border: "2px dashed #2B3050",
                }}
                className="w-full p-4 mt-2 bg-[#23273A] text-white hover:bg-[#2a2e3a] transition-colors"
              >
                + Add Skill
              </button>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40" />
              <Drawer.Content className="bg-white flex flex-col fixed bottom-0 left-0 right-0 rounded-t-[20px] max-h-[90vh]">
                <div className="max-w-md w-full mx-auto p-6 rounded-t-[20px] overflow-x-hidden">
                  <Drawer.Handle className="mx-auto w-12 h-1.5 bg-gray-300 rounded-full mt-2" />
                  <Drawer.Title
                    style={{ fontFamily: "cursive" }}
                    className="font-bold text-gray-900 text-center mt-4 text-xl"
                  >
                    Add Skill
                  </Drawer.Title>
                  <form onSubmit={handleSkillSave}>
                    <div className="mt-6 grid grid-cols-1 gap-4">
                      <div>
                        <label
                          htmlFor="skill"
                          className="font-semibold text-gray-700 text-sm block mb-2"
                          style={{ fontFamily: "cursive" }}
                        >
                          Skill <span className="text-red-500">*</span>
                        </label>
                        <Select
                          options={skillOptions}
                          onChange={handleSkillSelectChange}
                          placeholder="Select a skill..."
                          className="text-gray-900"
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              minHeight: "44px",
                              border: "1px solid #d1d5db",
                              borderRadius: "0.5rem",
                            }),
                          }}
                        />
                      </div>
                      <div>
                        <label
                          className="font-semibold text-gray-700 text-sm block mb-2"
                          style={{ fontFamily: "cursive" }}
                        >
                          Proficiency Level
                        </label>
                        <div className="flex items-center space-x-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleProficiencyChange(star)}
                              className="text-2xl focus:outline-none"
                            >
                              {star <= skill.proficiency ? (
                                <span className="text-yellow-400">★</span>
                              ) : (
                                <span className="text-gray-400">★</span>
                              )}
                            </button>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {skill.proficiency === 1 && "Beginner"}
                          {skill.proficiency === 2 && "Intermediate"}
                          {skill.proficiency === 3 && "Proficient"}
                          {skill.proficiency === 4 && "Advanced"}
                          {skill.proficiency === 5 && "Expert"}
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="h-11 bg-blue-600 text-white rounded-lg mt-6 w-full font-semibold transition-colors hover:bg-blue-700"
                    >
                      Save Skill
                    </button>
                  </form>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </div>

        <div className="mt-8">
          <h1 style={{ fontFamily: "cursive" }} className="text-xl mb-2">
            Language
          </h1>
          {formData.languages.length > 0 ? (
            <div className="mb-4 space-y-3">
              {formData.languages.map((language, idx) => (
                <div
                  key={idx}
                  className="bg-[#23273A] rounded-lg p-3 text-white flex flex-col gap-1 border border-[#2B3040] relative"
                >
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-lg"
                    onClick={() => handleRemoveLanguage(idx)}
                    title="Remove"
                  >
                    ×
                  </button>
                  <div className="font-bold">{language.name}</div>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-lg ${
                          star <= language.proficiency
                            ? "text-yellow-400"
                            : "text-gray-400"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 mb-4">No Languages added yet</p>
          )}

          <Drawer.Root
            open={isDrawerOpenLanguage}
            onOpenChange={setIsDrawerOpenLanguage}
          >
            <Drawer.Trigger asChild>
              <button
                type="button"
                style={{
                  fontFamily: "cursive",
                  borderRadius: "10px",
                  border: "2px dashed #2B3050",
                }}
                className="w-full p-4 mt-2 bg-[#23273A] text-white hover:bg-[#2a2e3a] transition-colors"
              >
                + Add Language
              </button>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40" />
              <Drawer.Content className="bg-white flex flex-col fixed bottom-0 left-0 right-0 rounded-t-[20px] max-h-[90vh]">
                <div className="max-w-md w-full mx-auto p-6 rounded-t-[20px] overflow-x-hidden">
                  <Drawer.Handle className="mx-auto w-12 h-1.5 bg-gray-300 rounded-full mt-2" />
                  <Drawer.Title
                    style={{ fontFamily: "cursive" }}
                    className="font-bold text-gray-900 text-center mt-4 text-xl"
                  >
                    Add Language
                  </Drawer.Title>
                  <form onSubmit={handleLanguageSave}>
                    <div className="mt-6 grid grid-cols-1 gap-4">
                      <div>
                        <label
                          htmlFor="language"
                          className="font-semibold text-gray-700 text-sm block mb-2"
                          style={{ fontFamily: "cursive" }}
                        >
                          Language <span className="text-red-500">*</span>
                        </label>
                        <Select
                          options={LanguageOptions}
                          onChange={handleLanguageSelectChange}
                          placeholder="Select a Language..."
                          className="text-gray-900"
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              minHeight: "44px",
                              border: "1px solid #d1d5db",
                              borderRadius: "0.5rem",
                            }),
                          }}
                        />
                      </div>
                      <div>
                        <label
                          className="font-semibold text-gray-700 text-sm block mb-2"
                          style={{ fontFamily: "cursive" }}
                        >
                          Proficiency Level
                        </label>
                        <div className="flex items-center space-x-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() =>
                                handleProficiencyChangeLanguage(star)
                              }
                              className="text-2xl focus:outline-none"
                            >
                              {star <= language.proficiency ? (
                                <span className="text-yellow-400">★</span>
                              ) : (
                                <span className="text-gray-400">★</span>
                              )}
                            </button>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {language.proficiency === 1 && "Beginner"}
                          {language.proficiency === 2 && "Intermediate"}
                          {language.proficiency === 3 && "Proficient"}
                          {language.proficiency === 4 && "Advanced"}
                          {language.proficiency === 5 && "Expert"}
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="h-11 bg-blue-600 text-white rounded-lg mt-6 w-full font-semibold transition-colors hover:bg-blue-700"
                    >
                      Save language
                    </button>
                  </form>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </div>
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 w-100 hover:bg-blue-700 text-white py-5 px-10 mx-auto rounded-lg font-semibold transition-colors duration-300"
            style={{ fontFamily: "cursive" }}
          >
            Save Resume
          </button>
        </div>
      </form>
      <div className="w-[210mm] top-7 left-156 ">
        <div className="container mx-auto p-4 sm:p-6">
          <Toaster position="top-center" reverseOrder={false} />
          <div
            ref={contentRef}
            className="p-8 rounded-lg shadow-inner h-full"
            style={{
              backgroundColor: "#ffffff",
              color: "#000000",
              fontFamily: "'Calibri', 'Arial', sans-serif",
              lineHeight: 1.5,
            }}
          >
            {/* Header Section */}
            <div className="text-center mb-8 border-b-2 border-gray-200 pb-6">
              <h1
                className="mb-2"
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: "#2d3748", // Dark gray
                  fontFamily: "'Georgia', serif",
                }}
              >
                {formData.fullName || "FULL NAME"}
              </h1>
              <p
                className="mb-1"
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#3182ce", // Blue
                }}
              >
                {formData.jobTitle || "PROFESSIONAL TITLE"}
              </p>
              <div
                className="flex flex-wrap justify-center gap-x-4 text-sm"
                style={{ color: "#4a5568" }} // Medium gray
              >
                {formData.email && <span>{formData.email}</span>}
                {formData.phone && <span>{formData.phone}</span>}
                {formData.address && <span>{formData.address}</span>}
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {formData.linkedin && (
                  <a
                    href={formData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#3182ce", textDecoration: "underline" }} // Blue
                  >
                    LinkedIn
                  </a>
                )}
                {formData.github && (
                  <a
                    href={formData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#3182ce", textDecoration: "underline" }} // Blue
                  >
                    GitHub
                  </a>
                )}
                {formData.portfolio && (
                  <a
                    href={formData.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#3182ce", textDecoration: "underline" }} // Blue
                  >
                    Portfolio
                  </a>
                )}
              </div>
            </div>

            {/* Summary Section */}
            {formData.summary && (
              <div className="mb-8">
                <h2
                  className="mb-2"
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: "#2d3748", // Dark gray
                    borderBottom: "1px solid #e2e8f0", // Light gray
                    paddingBottom: "0.5rem",
                    textTransform: "uppercase",
                  }}
                >
                  PROFESSIONAL SUMMARY
                </h2>
                <p style={{ color: "#4a5568" }}>{formData.summary}</p>{" "}
                {/* Medium gray */}
              </div>
            )}

            {/* Experience Section */}
            {formData.experiences.length > 0 && (
              <div className="mb-8">
                <h2
                  className="mb-2"
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: "#2d3748", // Dark gray
                    borderBottom: "1px solid #e2e8f0", // Light gray
                    paddingBottom: "0.5rem",
                    textTransform: "uppercase",
                  }}
                >
                  WORK EXPERIENCE
                </h2>
                {formData.experiences.map((exp, idx) => (
                  <div key={idx} className="mb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p
                          className="font-bold text-lg"
                          style={{ color: "#2d3748" }} // Dark gray
                        >
                          {exp.role || "Your Position"}
                        </p>
                        <p className="text-sm" style={{ color: "#4a5568" }}>
                          {" "}
                          {/* Medium gray */}
                          {exp.company || "Company Name"} |{" "}
                          {exp.location || "Location"}
                        </p>
                      </div>
                      <p className="text-sm" style={{ color: "#4a5568" }}>
                        {" "}
                        {/* Medium gray */}
                        {exp.startDate || "Start Date"} -{" "}
                        {exp.isPresent ? "Present" : exp.endDate || "End Date"}
                      </p>
                    </div>
                    <ul
                      className="list-disc ml-5 mt-2"
                      style={{ color: "#4a5568" }} // Medium gray
                    >
                      {exp.description.split("\n").map((item, i) => (
                        <li key={i} className="mb-1">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Projects Section */}
            {formData.projects.length > 0 && (
              <div className="mb-8">
                <h2
                  className="mb-2"
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: "#2d3748", // Dark gray
                    borderBottom: "1px solid #e2e8f0", // Light gray
                    paddingBottom: "0.5rem",
                    textTransform: "uppercase",
                  }}
                >
                  PROJECTS
                </h2>
                {formData.projects.map((proj, idx) => (
                  <div key={idx} className="mb-6">
                    <p
                      className="font-bold text-lg"
                      style={{ color: "#2d3748" }} // Dark gray
                    >
                      {proj.projectName || "Project Name"}
                    </p>
                    <div className="flex gap-4 text-sm mb-2">
                      {proj.deployLink && (
                        <a
                          href={proj.deployLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#3182ce", // Blue
                            textDecoration: "underline",
                          }}
                        >
                          Live Demo
                        </a>
                      )}
                      {proj.repositoryLink && (
                        <a
                          href={proj.repositoryLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#3182ce", // Blue
                            textDecoration: "underline",
                          }}
                        >
                          Source Code
                        </a>
                      )}
                    </div>
                    <p style={{ color: "#4a5568" }}>{proj.description}</p>{" "}
                    {/* Medium gray */}
                  </div>
                ))}
              </div>
            )}

            {/* Education Section */}
            {formData.education.length > 0 && (
              <div className="mb-8">
                <h2
                  className="mb-2"
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: "#2d3748", // Dark gray
                    borderBottom: "1px solid #e2e8f0", // Light gray
                    paddingBottom: "0.5rem",
                    textTransform: "uppercase",
                  }}
                >
                  EDUCATION
                </h2>
                {formData.education.map((edu, idx) => (
                  <div key={idx} className="mb-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-bold" style={{ color: "#2d3748" }}>
                          {" "}
                          {/* Dark gray */}
                          {edu.institution || "Institution Name"}
                        </p>
                        <p className="text-sm" style={{ color: "#4a5568" }}>
                          {" "}
                          {/* Medium gray */}
                          {edu.degree || "Degree"},{" "}
                          {edu.fieldOfStudy || "Field of Study"}
                        </p>
                      </div>
                      <p className="text-sm" style={{ color: "#4a5568" }}>
                        {" "}
                        {/* Medium gray */}
                        {edu.startDate || "Start Date"} -{" "}
                        {edu.isPresent ? "Present" : edu.endDate || "End Date"}
                      </p>
                    </div>
                    {edu.description && (
                      <p className="text-sm" style={{ color: "#4a5568" }}>
                        {" "}
                        {/* Medium gray */}
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Skills Section */}
            {formData.skills.length > 0 && (
              <div className="mb-8">
                <h2
                  className="mb-2"
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: "#2d3748", // Dark gray
                    borderBottom: "1px solid #e2e8f0", // Light gray
                    paddingBottom: "0.5rem",
                    textTransform: "uppercase",
                  }}
                >
                  TECHNICAL SKILLS
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.skills.map((skill, idx) => (
                    <div key={idx} className="mb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span
                          className="font-medium"
                          style={{ color: "#2d3748" }} // Dark gray
                        >
                          {skill.name}
                        </span>
                        <span className="text-xs" style={{ color: "#a0aec0" }}>
                          {" "}
                          {/* Light gray */}
                          {skill.proficiency}/5
                        </span>
                      </div>
                      <div
                        className="w-full rounded-full h-2.5"
                        style={{ backgroundColor: "#e2e8f0" }} // Light gray background
                      >
                        <div
                          className="h-2.5 rounded-full"
                          style={{
                            width: `${(skill.proficiency / 5) * 100}%`,
                            backgroundColor: "#3182ce", // Blue progress
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages Section */}
            {formData.languages.length > 0 && (
              <div className="mb-8">
                <h2
                  className="mb-2"
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: "#2d3748", // Dark gray
                    borderBottom: "1px solid #e2e8f0", // Light gray
                    paddingBottom: "0.5rem",
                    textTransform: "uppercase",
                  }}
                >
                  LANGUAGES
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.languages.map((lang, idx) => (
                    <div key={idx} className="mb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span
                          className="font-medium"
                          style={{ color: "#2d3748" }} // Dark gray
                        >
                          {lang.name.charAt(0).toUpperCase() +
                            lang.name.slice(1)}
                        </span>
                        <span className="text-xs" style={{ color: "#a0aec0" }}>
                          {" "}
                          {/* Light gray */}
                          {lang.proficiency === 5
                            ? "Native"
                            : lang.proficiency === 4
                            ? "Fluent"
                            : lang.proficiency === 3
                            ? "Intermediate"
                            : lang.proficiency === 2
                            ? "Basic"
                            : "Beginner"}
                        </span>
                      </div>
                      <div
                        className="w-full rounded-full h-2.5"
                        style={{ backgroundColor: "#e2e8f0" }} // Light gray background
                      >
                        <div
                          className="h-2.5 rounded-full"
                          style={{
                            width: `${(lang.proficiency / 5) * 100}%`,
                            backgroundColor: "#38a169", // Green progress
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Download Button */}
          <div className="mt-8 flex justify-center ">
            <button
              onClick={handleGeneratePDF}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition font-semibold shadow-md"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
