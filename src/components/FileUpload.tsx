"use client";

import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "react-hot-toast";
// imp
import { useRouter } from "next/navigation";
// interface CreateChatResponse {
//   message: string;
//   file_key: string;
//   file_name: string;
//   pages: any; // Adjust this type based on what `pages` contains
// }

const FileUpload = () => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log("check1");
      console.log(data.file_key); 
      console.log(data.file_name); 
      console.log("Hii");
      toast.success("Wait a sec..");
    },
    onError: (err) => {
      console.log(err);
      toast.error("Error creating chat69");
    },
  });
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles);
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large");
        return;
      }

      try {
        setUploading(true);
        const data = await uploadToS3(file);
        console.log("check2");
        console.log(data.file_key);
        console.log(data.file_name);
        if (!data?.file_key || !data.file_name) {
          toast.error("Something went wrong333");
          return;
        }
        mutate(data, {
          onSuccess: ({ chat_id }) => {
            toast.success("Chat created!");
            // toast.success(chat_id);
            router.push(`/chat/${chat_id}`);
          },
          onError: (err) => {
            console.log(err);
            toast.error("Error creating chat");
          },
        });
      } catch (error) {
        console.error(error);
        toast.error("File upload failed444");
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <div className="p-2 bg-white rounded-xl">
  <div
    {...getRootProps({
      className: "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
    })}
  >
    <input {...getInputProps()} />
    {uploading || isPending ? (
      <>
        {/* First Loader with blue color */}
        {/* <Loader2 className="h-10 w-10 text-blue-500 animate-spin" /> */}
        
        {/* Conditional second Loader with different color */}
        <Loader2 className="h-10 w-10 text-[#277855] animate-spin" />
        
        <p className="mt-2 text-sm text-slate-400">Abra Ka Dabra...</p>
      </>
    ) : (
      <>
        <Inbox className="w-10 h-10 text-[#277855]" />
        <p className="mt-2 text-sm text-slate-400">PDF here</p>
      </>
    )}
  </div>
</div>

  );
};

export default FileUpload;