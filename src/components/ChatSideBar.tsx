"use client";
import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

type Props = {
    chats: DrizzleChat[];
    chatId: number;
};

const ChatSideBar = ({ chats, chatId }: Props) => {
    const [loading, setLoading] = React.useState(false);

    return (
        <div className="w-full h-screen soff p-4 text-gray-200 bg-gray-900">
            <Link href="/">
                <Button className="w-full border-dashed border-white border transition-all duration-200 ease-in-out transform hover:bg-blue-500 hover:text-white hover:shadow-lg hover:scale-105">
                    <PlusCircle className="mr-2 w-4 h-4" />
                    New Chat
                </Button>
            </Link>

            <div className="flex max-h-screen pb-20 flex-col gap-2 mt-10">
                {chats.map((chat) => (
                    <Link key={chat.id} href={`/chat/${chat.id}`}>
                        <div
                            className={cn("rounded-lg p-3 text-slate-300 flex items-center transition-all duration-200 ease-in-out transform", {
                                "bg-blue-500 text-white": chat.id === chatId,
                                "hover:bg-blue-800 hover:text-white": chat.id !== chatId,
                            })}
                        >
                            <MessageCircle className="mr-2" />
                            <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                                {chat.pdfName}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="flex gap-2 mt-4">
                <div className="absolute bottom-4 gap-2 left-4 flex flex-col items-start text-slate-500">
                    <div className="flex">
                        <Link href='/' className="hover:text-white">Home</Link>
                        {/* <div className="mx-5">
                            <Link className="hover:text-white" href='/sign-in'>Sign in</Link>
                        </div> */}
                    </div>
                    <div className="mt-2">
                            <a 
                                href="https://github.com/ioTa03" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="hover:underline hover:text-white"
                            >
                                @ioTa
                            </a>
                        </div>
                </div>
            </div>
        </div>
    );
};

export default ChatSideBar;
