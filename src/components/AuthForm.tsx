"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

import { Input } from "./ui/input";
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/user.actions";

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (type === "sign-up") {
        const newUser = await signUp(data);
        setUser(newUser);
      }
      if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });
        if (response) {
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className=" auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer flex items-center gap-1 px-4">
          <Image
            src="/icons/logo.svg"
            alt="Horizon Logo"
            width={34}
            height={34}
          />
          <h1 className=" text-26 font-ibm-plex-serif font-bold text-black-1">
            Horizon
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className=" text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-up" ? "Sign Up" : "Sign In"}
            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Link your account to get started"
                : "Please enter your details"}
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className=" flex flex-col gap-4"></div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  <div className=" flex gap-4 ">
                    <CustomInput
                      control={form.control}
                      name="firstName"
                      placeholder="ex: John"
                      label="First Name"
                    />
                    <CustomInput
                      control={form.control}
                      name="lastName"
                      placeholder="ex: Doe"
                      label="Last Name"
                    />
                  </div>
                  <CustomInput
                    control={form.control}
                    name="address1"
                    placeholder="Enter your specific address"
                    label="Address"
                  />
                  <CustomInput
                    control={form.control}
                    name="city"
                    placeholder="Enter your city"
                    label="City"
                  />
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="state"
                      placeholder="ex: Benue"
                      label="State"
                    />
                    <CustomInput
                      control={form.control}
                      name="postalCode"
                      placeholder="ex: 90110"
                      label="Postal Code"
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="dateOfBirth"
                      placeholder="yyyy-mm-dd"
                      label="Date of Birth"
                    />
                    <CustomInput
                      control={form.control}
                      name="ssn"
                      placeholder="ex: 1234"
                      label="SSN"
                    />
                  </div>
                </>
              )}
              <CustomInput
                control={form.control}
                name="email"
                placeholder="Enter your Email"
                label="Email"
              />

              <CustomInput
                control={form.control}
                name="password"
                placeholder="Enter your Password"
                label="Password"
              />

              {/* <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <div className=" form-item">
                    <FormLabel className=" form-label">Password</FormLabel>
                    <div className=" flex w-full flex-col">
                      <FormControl>
                        <Input
                          placeholder="Enter your password"
                          className=" input-class"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className=" form-message mt-2" />
                    </div>
                  </div>
                )}
              /> */}
              <div className="flex flex-col gap-4 ">
                <Button
                  type="submit"
                  className=" form-btn "
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className=" animate-spin" /> &nbsp;
                      Loading
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <footer className=" flex justify-center gap-1 ">
            <p className=" text-14 font-normal text-gray-600">
              {type === "sign-in"
                ? "Don't have an account? "
                : "Already have an account? "}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className=" form-link"
            >
              {type === "sign-in" ? "Sign up" : "Sign in"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
