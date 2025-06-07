"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CgFileAdd } from "react-icons/cg";
import {
  FaRegFilePdf,
  FaMagic,
  FaUserTie,
  FaShare,
  FaSave,
} from "react-icons/fa";
import { Drawer } from "vaul";
import { toast, Toaster } from "react-hot-toast";
import { db } from "../utils/Firebase.config";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function Navbar() {
  const [text, setText] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [data, setData] = useState<{ id: string; nameRs: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const router = useRouter();

  // Fetch user resumes
  const fetchData = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const userResumesQuery = query(
        collection(db, "rsFile"),
        where("userId", "==", user.id)
      );
      const querySnapshot = await getDocs(userResumesQuery);
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        nameRs: doc.data().nameRs || "",
      }));
      setData(fetchedData);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  // Handle saving a new resume
  const handleSave = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text first.");
      return;
    }

    if (text.length > 8) {
      toast.error("The name must not exceed 8 characters.");
      return;
    }

    setIsSaving(true);
    try {
      await addDoc(collection(db, "rsFile"), {
        nameRs: text,
        userId: user?.id,
        createdAt: new Date().toISOString(),
      });
      toast.success("Resume created successfully!");
      setText("");
      setIsDrawerOpen(false);
      fetchData(); // Refresh the list
    } catch (error) {
      console.log(error);
      toast.error("Failed to create resume.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle sharing a resume
  const handleShare = async (resumeId: string) => {
    try {
      const shareUrl = `${window.location.origin}/resume/${resumeId}`;

      if (navigator.share) {
        await navigator.share({
          title: "Check out my resume",
          text: "I created this resume using Resume Builder",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share resume");
    }
  };

  // Handle saving changes to an existing resume
  const handleSaveChanges = async (resumeId: string) => {
    try {
      const docRef = doc(db, "rsFile", resumeId);
      await updateDoc(docRef, {
        updatedAt: new Date().toISOString(),
      });
      toast.success("Resume updated successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-white font-semibold">Loading your resumes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-4">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto text-center py-12"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="mb-6 p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg inline-block"
        >
          <FaUserTie className="text-white text-4xl" />
        </motion.div>

        <motion.h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Resumes
          </span>
        </motion.h1>

        <motion.p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Create, manage, and share your professional resumes
        </motion.p>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring" }}
              whileHover={{ y: -5 }}
              className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:shadow-lg hover:shadow-blue-500/10 transition-all"
            >
              <div className="p-6 flex flex-col">
                <div className="relative mb-4 flex justify-center">
                  <FaRegFilePdf className="text-5xl text-red-500" />
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
                    <FaMagic className="text-xs text-white" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white text-center mb-4">
                  {item.nameRs}
                </h3>

                <div className="flex justify-between mt-auto">
                  <button
                    onClick={() => router.push(`/resume/${item.id}`)}
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors"
                  >
                    Edit
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveChanges(item.id)}
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                      title="Save Changes"
                    >
                      <FaSave />
                    </button>
                    <button
                      onClick={() => handleShare(item.id)}
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                      title="Share"
                    >
                      <FaShare />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add New Resume Card */}
          <Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <Drawer.Trigger asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ y: -5 }}
                className="bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-600 hover:border-blue-400 flex items-center justify-center min-h-[200px] transition-all cursor-pointer"
              >
                <div className="flex flex-col items-center p-6">
                  <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                    <CgFileAdd className="text-3xl text-blue-400" />
                  </div>
                  <span className="text-blue-400 font-medium">
                    Create New Resume
                  </span>
                </div>
              </motion.div>
            </Drawer.Trigger>

            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40" />
              <Drawer.Content className="bg-gray-800 flex flex-col fixed bottom-0 left-0 right-0 rounded-t-[20px] max-h-[90vh] border-t border-gray-700">
                <div className="max-w-md w-full mx-auto p-6 rounded-t-[20px] overflow-auto">
                  <div className="mx-auto w-12 h-1.5 bg-gray-600 rounded-full mb-4" />

                  <Drawer.Title className="font-bold text-xl text-white text-center mb-2">
                    Create New Resume
                  </Drawer.Title>

                  <Drawer.Description className="text-gray-400 text-center mb-6">
                    Give your resume a name to get started
                  </Drawer.Description>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="resume-name"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Resume Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="resume-name"
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="My Awesome Resume"
                        maxLength={8}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Max 8 characters (currently {text.length}/8)
                      </p>
                    </div>

                    <button
                      onClick={handleSave}
                      disabled={isSaving || !text.trim()}
                      className={`w-full py-3 rounded-lg font-medium transition ${
                        isSaving || !text.trim()
                          ? "bg-blue-500/50 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      } text-white flex items-center justify-center gap-2`}
                    >
                      {isSaving ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Creating...
                        </>
                      ) : (
                        <>
                          <FaSave />
                          Create Resume
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </div>
      </div>
    </div>
  );
}
