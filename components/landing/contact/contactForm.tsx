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
}

interface SubmitStatus {
  type: "success" | "error";
  message: string;
}

interface ContactFormProps {
  onBack?: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onBack }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);

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
        // Create payload with only the fields we want to send
        const payload = {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        };

        console.log("Sending payload:", payload);

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}email/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const responseData = await response.json();

        if (!response.ok) {
          console.log("data", responseData);
          setSubmitStatus({ type: "error", message: responseData.message || "Failed to send message" });
          toast.error(responseData.message || "Failed to send message");
          return;
        }

        if (responseData.data) {
          setSubmitStatus({ type: "success", message: responseData.message || "Your message has been sent successfully." });
          setFormData({ name: "", email: "", message: "" });
          setErrors({});
          toast.success(responseData.message || "Your message has been sent successfully.");
        } else {
          setSubmitStatus({ type: "error", message: responseData.message || "Failed to send message" });
          toast.error(responseData.message || "Failed to send message");
        }
      } catch (error) {
        console.error("Error:", error);
        setSubmitStatus({ type: "error", message: "Failed to send message" });
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
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {submitStatus?.type === "success" && (
          <Alert className="bg-[#F5900D]/10 text-[#FFA940] border border-[#F5900D]/30">
            <AlertDescription>Thank you! Your message has been sent successfully.</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white/80">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`bg-white/5 border-white/10 focus:border-[#F5900D]/50 ${errors.name ? "border-[#F5900D]" : ""}`}
              placeholder="Your full name"
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-sm text-[#F5900D]">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/80">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`bg-white/5 border-white/10 focus:border-[#F5900D]/50 ${errors.email ? "border-[#F5900D]" : ""}`}
              placeholder="your@email.com"
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-sm text-[#F5900D]">{errors.email}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-white/80">
            Message
          </Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={`bg-white/5 border-white/10 focus:border-[#F5900D]/50 min-h-[150px] ${
              errors.message ? "border-[#F5900D]" : ""
            }`}
            placeholder="Tell us about your project..."
            disabled={isSubmitting}
          />
          {errors.message && <p className="text-sm text-[#F5900D]">{errors.message}</p>}
        </div>

        <div className="flex gap-4">
          {onBack && (
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="flex-1 text-[#F5900D] hover:bg-[#F5900D]/10 hover:text-[#FFA940] border border-[#F5900D]/20 hover:border-[#F5900D]/40 transition-all duration-300"
            >
              ← Back
            </Button>
          )}
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-br from-[#F5900D] to-[#F5900D]/80 hover:from-[#FFA940] hover:to-[#F5900D] text-black font-medium shadow-[0_0_15px_rgba(245,144,13,0.3)] hover:shadow-[0_0_20px_rgba(245,144,13,0.5)] transition-all duration-300"
            disabled={isSubmitting}
          >
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
