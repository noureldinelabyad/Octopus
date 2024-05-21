"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const Error = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
       src="/error-light.png"
       height={300}
       width={300}
       alt="Error"
       className="dark:hidden"
        />
      <Image
       src="/error-dark.png"
       height={300}
       width={350}
       alt="Error"
       className="hidden dark:block rounded-xl"
        />
      <h2 className="text-xl font-medium">
         Something went wrong
      </h2>
      <Button asChild>
        <Link href="/documents">
            Go to Back
        </Link>
      </Button>
    </div>
  );
};

export default Error;

