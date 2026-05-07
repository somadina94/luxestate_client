"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { authService } from "@/services";
import { useAppDispatch, login, setUser } from "@/store";
import { useRouter } from "next/navigation";
import IconButton from "../atoms/IconButton";
import { KeyRound, Lock, LockKeyhole } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const formSchema = z.object({
  token: z.string().min(6, "OTP is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  passwordConfirm: z
    .string()
    .min(6, "Password confirm must be at least 6 characters"),
});

export default function ResetPasswordForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      token: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await authService.resetPassword(
      data.password,
      data.passwordConfirm,
      data.token,
    );

    if (response.status === 200) {
      const message =
        (response.data as { message?: string })?.message ??
        "Password reset successfully";
      toast.success(message);
      form.reset();
      const token = (response.data as { token?: string })?.token;
      if (token) {
        const userResponse = await authService.getUser(response.data);
        if (userResponse.status === 200) {
          dispatch(setUser(userResponse.data));
        }
        dispatch(login(token));
      }
      router.push("/login");
    } else {
      const message =
        (response as { message?: string }).message ??
        (response.data as { message?: string })?.message ??
        "Password reset failed";
      toast.error(message);
    }
  };

  const {
    formState: { isSubmitting, isValid },
  } = form;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.45 }}
      className="mx-auto w-full max-w-md p-2"
    >
      <Card className="w-full border-border/80 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <KeyRound className="size-6" aria-hidden />
          </div>
          <CardTitle className="font-heading text-2xl">Set new password</CardTitle>
          <CardDescription>
            Enter the 6-digit code from your email and choose a new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <fieldset disabled={isSubmitting} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="token"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>6-digit OTP</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                          <Input
                            className="pl-10"
                            placeholder="••••••••"
                            type="password"
                            autoComplete="new-password"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passwordConfirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                          <Input
                            className="pl-10"
                            placeholder="••••••••"
                            type="password"
                            autoComplete="new-password"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <IconButton
                  Icon={KeyRound}
                  title="Update password"
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  isLoading={isSubmitting}
                  className="w-full"
                />
              </fieldset>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
