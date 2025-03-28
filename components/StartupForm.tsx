"use client";

import React, { useState, useActionState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";
const StartupForm = () => {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("Hello World");
  const { toast } = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      };
      await formSchema.parseAsync(formValues);
      console.log(formValues);

      const result = await createPitch(prevState, formData, pitch);

      if (result.status == "SUCCESS") {
        toast({
          title: "Success",
          description: "You startup pitch has been craeted successfully",
        });
        router.push(`/startup/${result._id}`);
      }
      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.flatten().fieldErrors;
        setErrors(fieldError as unknown as Record<string, string>);
        toast({
          title: "error",
          description: "Please Check Your input and try again",
          variant: "destructive",
        });
        return { ...prevState, error: "validation failed", status: "error" };
      }
      toast({
        title: "error",
        description: "an unexpected error has occurred",
        variant: "destructive",
      });
      return {
        ...prevState,
        error: "an unexpected error has occurred",
        status: "error",
      };
    }
  };

  const [state, action, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "initial",
  });
  return (
    <>
      <form action={action} className="startup-form">
        <div>
          <label htmlFor="title" className="startup-form_label">
            Title
          </label>
          <Input
            id="title"
            name="title"
            className="startup-form_input"
            required
            placeholder="Startup Title"
          />
          {errors.title && <p className="startup-form_error">{errors.title}</p>}
        </div>
        <div>
          <label htmlFor="description" className="startup-form_label">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            className="startup-form_textarea"
            required
            placeholder="Startup Description"
          />
          {errors.description && (
            <p className="startup-form_error">{errors.description}</p>
          )}
        </div>
        <div>
          <label htmlFor="category" className="startup-form_label">
            Category
          </label>
          <Input
            id="category"
            name="category"
            className="startup-form_input"
            required
            placeholder="Startup category(Tech,Health,Education...)"
          />
          {errors.category && (
            <p className="startup-form_error">{errors.category}</p>
          )}
        </div>
        <div>
          <label htmlFor="link" className="startup-form_label">
            Image URL
          </label>
          <Input
            id="link"
            name="link"
            className="startup-form_input"
            required
            placeholder="Startup Image URL"
          />
          {errors.link && <p className="startup-form_error">{errors.link}</p>}
        </div>
        <div data-color-mode="light">
          <label htmlFor="link" className="startup-form_label">
            Pitch
          </label>
          <MDEditor
            value={pitch}
            onChange={(value) => setPitch(value as string)}
            id="pitch"
            preview="edit"
            height={300}
            style={{ borderRadius: 20, overflow: "hidden" }}
            textareaProps={{
              placeholder:
                "Briefly descripbe your idea and what problem it solves",
            }}
            previewOptions={{
              disallowedElements: ["style"],
            }}
          />
          {errors.link && <p className="startup-form_error">{errors.link}</p>}
        </div>
        <Button
          type="submit"
          className="startup-form_btn text-white"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Submit You Pitch"}
          <Send className="size-6 ml-2" />
        </Button>
      </form>
    </>
  );
};

export default StartupForm;
