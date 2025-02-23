"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios"; // Import Axios
import { Separator } from "../ui/separator";
import { Card, Button } from 'flowbite-react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import toast from "react-hot-toast";
interface CollectionFormProps {
    initialData: CollectionType;
  }
  
const formSchema = z.object({
    name: z.string().min(2).max(20),
    description: z.string().min(2).max(500).trim(),
    icon: z.array(z.string()),
    typestore: z.string().min(1, "Please select a type"),
});

const CollectionForm: React.FC<CollectionFormProps> = ({ initialData }) => {
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<File[]>([]);
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: initialData.name || "",
        description: initialData.description || "",
        icon: initialData.icon ? (Array.isArray(initialData.icon) ? initialData.icon : [initialData.icon]) : [],
        typestore: initialData.typestore || "",
      },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileArray = Array.from(e.target.files);
            setImages(fileArray); // Update images state
            form.setValue("icon", fileArray.map(file => file.name)); // Set only file names if needed
        }
    };

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        setLoading(true); // Set loading state
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("typestore", data.typestore);
        images.forEach((icon) => {
            formData.append("icon", icon); // Append actual file
        });

        try {
            const token = localStorage.getItem('authtoken'); // Retrieve token from local storage
            const response = await axios.post(process.env.NEXT_PUBLIC_IPHOST + '/StoreAPI/categories/CreateCategory', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`, // Add token in the Authorization header


                },
            });
            console.log(response)
            toast.success("Category created successfully!");
            console.log('Category created successfully');
            // router.push('/collections');
        } catch (error) {
            toast.error("Failed to create category.");
            console.error('Error creating category:', error);
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <Card className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full max-w-3xl bg-transparent relative">
            <div className="p-10">
                <h1 className="text-2xl font-bold mb-4">Create Collection</h1>
                <Separator className="bg-grey-1 mt-4 mb-7" />
                <Form {...form}>
                    <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Collection Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="icon"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Icon</FormLabel>
                                    <FormControl>
                                        <Input type="file" multiple onChange={handleFileChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="typestore"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Store Type</FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            className="border p-2 w-full rounded"
                                        >
                                            <option value="">Select Type</option>
                                            <option value="accessoire">Accessoires store</option>
                                            <option value="vetement">Vetements store</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Description"
                                            {...field}
                                            rows={5}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-10">
                            <Button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? "Creating..." : "Submit"}
                            </Button>
                            <Button type="button" className="bg-blue-1 text-white">
                                Discard
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </Card >
    );
};

export default CollectionForm;