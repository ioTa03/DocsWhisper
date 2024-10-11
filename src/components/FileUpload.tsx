'use client'; // make sure this is at the top

import { useDropzone } from "react-dropzone";
import React from 'react';
import { Inbox } from "lucide-react";
import { uploadToS3 } from "@/lib/s3";

const FileUpload = () => {
    const { getRootProps, getInputProps } = useDropzone({
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            console.log(acceptedFiles);
            const file=acceptedFiles[0]
            if(file.size> 10*1024*1024)
            {
                alert('Please Upload a smaller file man')
                return
            }
            try {
            const data =await uploadToS3(file)
            console.log(data)
                
            } catch (error) {
                console.log(error)
            }
        },
    });

    return (
        <div className="p-2 bg-white rounded-xl">
            <div
                {...getRootProps({
                    className:
                        "border-dashed border-gray-500 rounded-l cursor-pointer bg-gray-100 py-8 flex justify-center items-center flex-col",
                })}
            >
                <input {...getInputProps()} />
                <>
                    <Inbox className="w-10 h-10 text-blue-500" />
                    <p className="mt-2 text-sm text-slate-400">Drop your PDF Here</p>
                </>
            </div>
        </div>
    );
};

export default FileUpload;