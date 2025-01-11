import React, {FormEvent, useState} from 'react';
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {toast} from "sonner";


interface FormErrors {
    name?: string;
    email?: string;
    message?: string;
}

type SubmitStatus = 'success' | 'error' | null;

const ContactForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
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
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (!response.ok) {
                    console.log('data', data)
                    setSubmitStatus('error');
                    toast.error(data.message); // Directly show the error message from response
                    return;
                }

                setSubmitStatus('success');
                setFormData({name: '', email: '', message: ''});
                toast.success("Your message has been sent successfully.");

            } catch (error) {
                console.error('Error:', error);
                setSubmitStatus('error');
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
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="container bg-zinc-950 flex flex-col p-4 md:p-8">
            <main className="flex-1 flex items-center justify-center mx-auto w-full">
                <div className="w-full space-y-8">
                    <div className="space-y-2">
                        <p className="text-zinc-400 text-lg">
                            Send us a message and we'll get back to you soon.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {submitStatus === 'success' && (
                            <Alert className="bg-green-500/20 text-green-400 border-green-500">
                                <AlertDescription>
                                    Thank you! Your message has been sent successfully.
                                </AlertDescription>
                            </Alert>
                        )}


                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className="text-left w-full">
                                <Label htmlFor="name" className="text-white text-md">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`bg-zinc-800 border-zinc-700 text-white mt-2 p-2 rounded w-full ${
                                        errors.name ? 'border-red-500' : ''
                                    }`}
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>
                            <div className="text-left w-full">
                                <Label htmlFor="email" className="text-white text-md text-left">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`bg-zinc-800 border-zinc-700 text-white mt-2 p-2 rounded w-full ${
                                        errors.email ? 'border-red-500' : ''
                                    }`}
                                    required
                                />
                                {errors.email && (
                                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div className='grid grid-cols-1 gap-4'>
                            <div className="text-left w-full">
                                <Label htmlFor="message" className="text-white text-md">
                                    Message
                                </Label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    placeholder="Type your message here"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className={`bg-zinc-800 border-zinc-700 text-white min-h-32 mt-2 p-2 rounded resize-none w-full ${
                                        errors.message ? 'border-red-500' : ''
                                    }`}
                                    required
                                />
                                {errors.message && (
                                    <p className="text-red-400 text-sm mt-1">{errors.message}</p>
                                )}
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full md:w-auto text-white py-6 text-md px-10"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ContactForm;