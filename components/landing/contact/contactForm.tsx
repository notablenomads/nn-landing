import React, { FormEvent, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

type SubmitStatus = "success" | "error" | null;

interface ContactFormProps {
  onBack?: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    if (validateForm()) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}email/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const responseData = await response.json();

        if (!response.ok) {
          console.log("data", responseData);
          setSubmitStatus("error");
          toast.error(responseData.message || "Failed to send message");
          return;
        }

        if (responseData.data) {
          setSubmitStatus("success");
          setFormData({ name: "", email: "", message: "" });
          toast.success(responseData.message || "Your message has been sent successfully.");
        } else {
          setSubmitStatus("error");
          toast.error(responseData.message || "Failed to send message");
        }
      } catch (error) {
        console.error("Error:", error);
        setSubmitStatus("error");
        toast.error("Failed to send message");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please fill in all required fields correctly.");
      setIsSubmitting(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {submitStatus === "success" && (
          <Alert className="bg-green-500/20 text-green-400 border-green-500">
            <AlertDescription>Thank you! Your message has been sent successfully.</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className={`bg-white/5 border-white/10 focus:bg-white/10 text-white ${
                errors.name ? "border-red-500" : "hover:border-white/20"
              }`}
              required
            />
            {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={`bg-white/5 border-white/10 focus:bg-white/10 text-white ${
                errors.email ? "border-red-500" : "hover:border-white/20"
              }`}
              required
            />
            {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-white">
            Message
          </Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Type your message here"
            value={formData.message}
            onChange={handleChange}
            className={`bg-white/5 border-white/10 focus:bg-white/10 text-white min-h-[150px] ${
              errors.message ? "border-red-500" : "hover:border-white/20"
            }`}
            required
          />
          {errors.message && <p className="text-red-400 text-sm">{errors.message}</p>}
        </div>

        <div className="flex justify-between items-center">
          {onBack && (
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="text-white hover:text-white hover:bg-white/10"
              onClick={onBack}
            >
              ← Back to Project Journey
            </Button>
          )}
          <Button
            type="submit"
            size="lg"
            className="min-w-[200px] bg-[#F5900D] hover:bg-[#FFA940] text-white font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Sending...</span>
              </div>
            ) : (
              "Send Message"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
