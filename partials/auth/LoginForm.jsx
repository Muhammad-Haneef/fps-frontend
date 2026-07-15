"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";

import { toast } from "sonner";

import Image from "next/image";
import FormProvider from "@/components/form/form-provider";
import InputField from "@/components/form/input-field";
import SubmitButton from "@/components/form/submit-button";

import { LOGIN } from "@/helper/ServerSide";

import { ADMIN } from "@/constants/paths";

import useUserStore from "@/stores/useUserStore";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const LoginForm = (className, ...props) => {
  const router = useRouter();
  const { setUser } = useUserStore();

  const methods = useForm({
    resolver: zodResolver(formSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const handleLoginSuccess = async (data) => {
    await setUser(data);
    setTimeout(() => {
      router.replace(ADMIN?.DASHBOARD);
    }, 100);
  };

  const onSubmit = async (formData) => {
    try {
      const response = await LOGIN(formData);

      //console.log(response);

      if (response?.status === 200) {
        toast.success(response?.message || "Login successful");
        await handleLoginSuccess(response?.data);
      } else {
        toast.error("Login error:" + response.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Image
        src="/images/logo.png"
        width={100}
        height={100}
        alt="FPS"
        className="self-center"
      />
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider
            methods={methods}
            onSubmit={handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <InputField
              title="Email"
              name="email"
              type="email"
              placeholder="youremail@gmail.com"
              error={errors.email?.message}
            />
            <InputField
              title="Password"
              name="password"
              type="password"
              error={errors.password?.message}
            />
            <SubmitButton label="Login" isSubmitting={isSubmitting} />
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};
export default LoginForm;

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(2, { message: "Please enter your password" }),
});
