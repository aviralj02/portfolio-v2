"use client";

import { cn } from "@/lib/utils";
import { Loader, SendHorizonal } from "lucide-react";
import React, { FC, FormEvent, useRef, useState } from "react";
import { z } from "zod";
import emailjs from "@emailjs/browser";

type Props = {};

const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string;
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string;
const publickey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string;

const ContactSchema = z.object({
  name: z
    .string()
    .min(1, "your name is required!")
    .max(100, "name is too long!"),
  email: z.string().email("invalid email!"),
  message: z.string().min(1, "message is required!"),
});

type ContactFormData = z.infer<typeof ContactSchema>;

const ContactTile: FC<Props> = (props: Props) => {
  const [errors, setErrors] = useState<z.ZodFormattedError<ContactFormData>>();
  const [success, setSuccess] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const formValues: ContactFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    const validation = ContactSchema.safeParse(formValues);
    if (!validation.success) {
      const fieldErrors = validation.error.format();
      setErrors(fieldErrors);
      return;
    }

    setErrors(undefined);

    setSending(true);
    emailjs
      .send(serviceId, templateId, formValues, {
        publicKey: publickey,
      })
      .then(() => {
        setSuccess(true);
        setSending(false);

        formRef.current?.reset();
      })
      .catch((error) => {
        setSending(false);
        console.log(error);
      });
  };

  return (
    <div
      className={cn(
        "col-span-2 lg:order-8 order-9",
        "flex flex-col gap-6 bg-card rounded-2xl p-6 w-full"
      )}
    >
      <div className="flex lg:flex-row flex-col items-center lg:justify-between gap-3 lg:gap-0">
        <h2 className="text-lg sm:text-xl font-medium">Get in Touch</h2>
        {success && (
          <p className="text-xs sm:text-sm text-secondary-text font-medium">
            Your message has been sent!
          </p>
        )}
        {sending && (
          <span className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground font-medium">
            Sending <Loader className="animate-spin h-4 w-4" />
          </span>
        )}
      </div>

      <form
        ref={formRef}
        className="grid lg:grid-cols-2 grid-cols-1 gap-3 w-full"
        onSubmit={handleSubmit}
      >
        <div className="order-1 flex flex-col gap-1">
          <input
            type="text"
            name="name"
            placeholder="name"
            className="px-4 py-2 outline-none text-xs sm:text-sm placeholder:text-dim bg-secondary rounded-xl w-full"
            disabled={success}
          />
          {errors?.name && (
            <p className="text-red-600 font-medium text-xs sm:text-sm">
              {errors.name._errors[0]}
            </p>
          )}
        </div>

        <div className={cn("order-2 lg:order-3", "flex flex-col gap-1")}>
          <input
            type="email"
            name="email"
            placeholder="email address"
            className="px-4 py-2 rounded-xl outline-none text-xs sm:text-sm placeholder:text-dim bg-secondary w-full"
            disabled={success}
          />
          {errors?.email && (
            <p className="text-red-600 font-medium text-xs sm:text-sm">
              {errors.email._errors[0]}
            </p>
          )}
        </div>

        <div
          className={cn("row-span-3 lg:order-2 order-3", "flex flex-col gap-1")}
        >
          <textarea
            name="message"
            placeholder="message"
            rows={4}
            className="w-full h-full resize-none text-primary text-xs sm:text-sm outline-none rounded-xl px-4 py-2 placeholder:text-dim bg-secondary scrollbar"
            disabled={success}
          />
          {errors?.message && (
            <p className="text-red-600 font-medium text-xs sm:text-sm block">
              {errors.message._errors[0]}
            </p>
          )}
        </div>

        <button
          id="contact"
          type="submit"
          className="bg-background text-primary flex items-center rounded-xl py-2 justify-center gap-3 order-last disabled:opacity-55 group"
          disabled={success}
        >
          <span className="text-sm">send</span>{" "}
          <SendHorizonal className="w-3 h-3 transform group-hover:-rotate-45 transition-all" />
        </button>
      </form>
    </div>
  );
};

export default ContactTile;
