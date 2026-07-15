"use client";

import BackButton from "@/components/form/back-button";
import SubmitButton from "@/components/form/submit-button";

import {
  Card,
  //CardAction,
  CardContent,
  //CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FormCard({
  title = "Record Form",
  formState = false,
  children,
}) {
  return (
    <>
      <Card className="w-full rounded-md">
        <CardHeader>
          <CardTitle className="text-sm">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">{children}</CardContent>
        <CardFooter className="flex items-center justify-between gap-2 py-2 bg-[#fffefb]">
          <div>
            <BackButton />
          </div>
          <div>
            <SubmitButton formState={formState} isSubmitting={formState} />
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
