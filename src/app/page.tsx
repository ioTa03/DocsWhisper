
import { UserButton } from "@clerk/nextjs";
import { auth } from '@clerk/nextjs/server';
// **
import { Button } from "@/components/ui/button"
import Link from "next/link";
import Image from "next/image";
import {LogIn} from 'lucide-react';
import FileUpload from "@/components/FileUpload";
export default async function Home() {
  const {userId}= await auth() 
  const isAuth = !!userId
  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-blue-200 to-red-200 ">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center">
          <UserButton afterSwitchSessionUrl="/" ></UserButton>
          <h1 className="mr-3 ml-4 text-5xl font-semibold ">Talk to any PDF</h1>
        </div>
        <div className="flex mt-6 ">
          {isAuth && <Button>Previous Chats</Button>}
        </div>
        <p className="max-w-xl mt-2 text-lg text-slate-700 font-serif">Bruh! You know what to do...</p>
      <div className="w-full mt-5">
        {isAuth? (
          <FileUpload/>)
          :(
          <Link href="/sign-in">
          <Button className="p-6"> Login to get started!  
            <LogIn className="w-4 ml-2 h-4"/>
          </Button>
          </Link>)}
      </div>
      </div>
      </div>
    </div>
  );
}
