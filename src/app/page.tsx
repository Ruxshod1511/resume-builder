"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CgFileAdd } from "react-icons/cg";
import { FaRegFilePdf } from "react-icons/fa6";
import { Drawer } from "vaul";
import { toast, Toaster } from "react-hot-toast";
import { db } from "./utils/Firebase.config";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
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

  const handleSave = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text first.");
      return;
    }

    if (text.length > 8) {
      toast.error("The word length must not exceed 8 characters.");
      return;
    }

    setIsSaving(true);
    try {
      await addDoc(collection(db, "rsFile"), {
        nameRs: text,
        userId: user?.id,
      });
      toast.success("Text saved successfully!");
      setText("");
      setIsDrawerOpen(false);
      fetchData();
    } catch (error) {
      console.log(error);

      toast.error("Failed to save text.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-3 container mx-auto min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center mt-70 md:mt-80">
          <div className="w-16 h-16 border-4 border-b-fuchsia-100 border-dashed rounded-full animate-spin"></div>
          <p className="mt-4 text-amber-50 font-semibold">Loading...</p>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ fontFamily: "cursive" }}
            className="text-xl md:text-2xl bg-blue-200 text-black p-3 rounded-2xl text-center mx-auto w-full md:w-2/5 mt-5"
          >
            Start a New Resume or Choose an Existing One
          </motion.div>

          <div className="mt-8 flex gap-4 flex-wrap justify-center">
            {data.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/resume/${item.id}`)}
                className="bg-fuchsia-100 w-32 h-32 md:w-40 md:h-40 rounded-3xl shadow-md flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 ease-in-out border-2 border-fuchsia-400"
              >
                <FaRegFilePdf size={50} className="text-emerald-500" />
                <h3
                  style={{ fontFamily: "cursive" }}
                  className="text-sm md:text-lg font-semibold text-center mt-2 text-blue-950"
                >
                  {item.nameRs}
                </h3>
              </div>
            ))}

            {/* the modal is resume add */}
            <div className="bg-blue-200 w-32 h-32 md:w-40 md:h-40 rounded-3xl shadow-md flex items-center justify-center hover:scale-105 transition-transform duration-300 ease-in-out">
              <Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <Drawer.Trigger asChild>
                  <button>
                    <CgFileAdd
                      size={70}
                      className="md:size-[100px] text-blue-600"
                    />
                  </button>
                </Drawer.Trigger>

                <Drawer.Portal>
                  <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                  <Drawer.Content className="bg-white flex flex-col fixed bottom-0 left-0 right-0 max-h-[82vh] rounded-t-[20px]">
                    <div className="max-w-md w-full mx-auto overflow-auto p-6 rounded-t-[20px]">
                      <Drawer.Handle />
                      <Drawer.Title className="font-bold text-gray-900 text-center mt-4">
                        Create a New Resume
                      </Drawer.Title>
                      <Drawer.Description className="leading-6 mt-2 text-gray-600 text-center">
                        Enter text below and save to add it to your list.
                      </Drawer.Description>

                      <div className="mt-6">
                        <label
                          htmlFor="text"
                          className="font-semibold text-gray-700 text-sm block mb-2"
                        >
                          Enter Resume Name
                        </label>
                        <input
                          id="text"
                          type="text"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          className="border border-gray-300 bg-white w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                          placeholder="Resume name..."
                        />
                      </div>

                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`h-11 ${
                          isSaving ? "bg-gray-400" : "bg-blue-600"
                        } text-white rounded-lg mt-6 w-full font-semibold transition-colors`}
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </Drawer.Content>
                </Drawer.Portal>
              </Drawer.Root>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
