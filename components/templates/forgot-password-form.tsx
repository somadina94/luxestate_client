"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
import { useRouter } from "next/navigation";
import IconButton from "../atoms/IconButton";
import { KeyRound, Mail } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await authService.forgotPassword(data.email);

    if (response.status === 200) {
      toast.success(response.data.message);
      form.reset();
      router.push("/reset-password");
    } else {
      toast.error(
        "Something went wrong or email does not exist with us, contact support",
      );
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
          <CardTitle className="font-heading text-2xl">Reset password</CardTitle>
          <CardDescription>
            Enter your registered email and we&apos;ll send you a 6-digit code
            to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <fieldset disabled={isSubmitting} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail
                            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                            aria-hidden
                          />
                          <Input
                            className="pl-10"
                            placeholder="you@example.com"
                            type="email"
                            autoComplete="email"
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
                  title="Send reset code"
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
