"use client";

import { Error } from "@mui/icons-material";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Input } from "@heroui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

import { roboto } from "@/config/fonts";
import { loginSchema, LoginSchema } from "@/types/loginSchema";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "all",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const userSignIn = async (data: LoginSchema) => {
    // console.log("Submitting data, please wait...");
    // // Add a 2-second delay before outputting the form data.
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    // console.log("Submitted data:", data);
    const callbackUrl = searchParams.get("callbackUrl") || "/user/dashboard";

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      // Handle errors returned from NextAuth
      if (result?.error) {
        setErrorMsg(result.error);
      } else {
        // Redirect to the callback URL after a successful login
        router.push(callbackUrl);
      }
    } catch (error) {
      console.log("Error during sign-in:", error);
      setErrorMsg("An unexpected error occurred. Please try again.");

      toast.error("Something went wrong");
      return;
    }
  };

  const toggleVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <Card className="w-96">
        <CardHeader>
          <div className="flex flex-col mb-3">
            <h2 className={`${roboto.className} text-2xl font-semibold`}>
              Login
            </h2>
            <p className="text-slate-400">
              Use your app credentials for account access
            </p>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit(userSignIn)}>
          <CardBody>
            <Input
              isClearable
              required
              aria-label="Email Input"
              autoComplete="email"
              autoFocus={true}
              className="mb-3"
              placeholder="Enter Email"
              type="email"
              variant="bordered"
              {...register("email")}
              isInvalid={!!errors.email}
            />
            {errors.email && (
              <div className="bg-red-100 text-red-700 px-4 py-3 rounded-full flex gap-2 items-start mb-3">
                <Error fontSize="medium" />
                <span className="text-sm">{errors.email.message}</span>
              </div>
            )}

            <Input
              required
              autoComplete="password"
              className="mb-3"
              minLength={6}
              placeholder="Enter Password"
              type={showPassword ? "text" : "password"}
              variant="bordered"
              {...register("password")}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </button>
              }
              isInvalid={!!errors.password}
            />
            {errors.password && (
              <div className="bg-red-100 text-red-700 px-4 py-3 rounded-full flex gap-2 items-start">
                <Error fontSize="medium" />
                <span className="text-sm">{errors.password.message}</span>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-100 text-red-700 px-4 py-3 rounded-full flex gap-2 items-center mt-2">
                <Error fontSize="medium" />
                <span className="text-sm">{errorMsg}</span>
              </div>
            )}
          </CardBody>

          <CardFooter className="flex justify-end">
            <Button
              key="submit"
              aria-label="Submit Button"
              color="primary"
              isDisabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
              name="submit"
              type="submit"
            >
              Submit
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
