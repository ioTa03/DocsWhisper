
import { UserButton } from "@clerk/nextjs";
import { auth } from '@clerk/nextjs/server';
// **
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import {LogIn} from 'lucide-react';
import { chats } from "@/lib/db/schema";
import { db } from "@/lib/db";
import FileUpload from "@/components/FileUpload";
import { eq } from "drizzle-orm";
export default async function Home() {
  const {userId}= await auth() 
  const isAuth = !!userId;
  let firstChat;
  // smooth
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));
    if (firstChat) {
      firstChat = firstChat[0];
    }
  }
  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-[#97E7E1] to-[#E7CCCC] ">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center">
          <UserButton afterSwitchSessionUrl="/" ></UserButton>
          <h1 className="mr-3 ml-4 text-5xl font-semibold text-[#244855]">Talk to any PDF</h1>
        </div>
        <div className="flex mt-10">
            {isAuth && firstChat && (
              <>
                <Link href={`/chat/${firstChat.id}`}>
                  <Button className="hover:bg-[#277855] ">
                   Previous Chats <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                
              </>
            )}
          </div>
        <p className="max-w-xl mt-6 text-lg text-[#244855] font-serif">Bruh! You know what to do...</p>
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
