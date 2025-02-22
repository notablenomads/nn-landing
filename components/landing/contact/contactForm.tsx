import React, { FormEvent, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

interface FormData {
  name: string;
  email: string;
  message: string;
  company?: string;
}

type SubmitStatus = "success" | "error" | null;

interface ContactFormProps {
  onBack?: () => void;
  showCompanyField?: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({ onBack, showCompanyField = false }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    company: "",
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
          setFormData({ name: "", email: "", message: "", company: "" });
          setErrors({});
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
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {submitStatus === "success" && (
          <Alert className="bg-green-500/20 text-green-400 border-green-500">
            <AlertDescription>Thank you! Your message has been sent successfully.</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 bg-white/10 text-xl ${errors.name ? "border-red-500" : ""}`}
              placeholder="Your full name"
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 bg-white/10 text-xl ${errors.email ? "border-red-500" : ""}`}
              placeholder="your@email.com"
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
        </div>

        {showCompanyField && (
          <div>
            <Label htmlFor="company">Company (Optional)</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="mt-1 bg-white/10 text-lg"
              placeholder="Your company name"
              disabled={isSubmitting}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={`mt-1 bg-white/10 min-h-[150px] ${errors.message ? "border-red-500" : ""}`}
            placeholder="Tell us about your project..."
            disabled={isSubmitting}
          />
          {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
        </div>

        <div className="flex gap-4">
          {onBack && (
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="flex-1 text-white hover:bg-white/10 hover:text-white border border-white/20"
            >
              ← Back
            </Button>
          )}
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </div>
            ) : (
              "Send Message →"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
