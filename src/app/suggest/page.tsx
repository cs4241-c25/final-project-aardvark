"use client";

import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModalProvider } from "@/context/ModalContext";
import ModalWrapper from "@/components/ModalWrapper";
import GameHeader from "@/components/GameHeader";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {ConsensiSuggestion} from "@/lib/interfaces";

export default function Suggest() {
    const form = useForm({
        defaultValues: {
            author: "",
            category: "",
            option1: "",
            option2: "",
            option3: "",
            option4: "",
        },
    });

    const onSubmit = async (values: { author: string; category: string; option1: string; option2: string; option3: string; option4: string }) => {
        const suggestion:ConsensiSuggestion = {
            author: values.author || "Anonymous",
            category: values.category,
            options: [values.option1, values.option2, values.option3, values.option4].map(opt => opt.trim()),
            date: "null"
        };

        try {
            await axios.post("/api/admin/suggestions", suggestion);
            form.reset();
        } catch (error) {
            console.error("Error submitting suggestion:", error);
        }
    };

    return (
        <ModalProvider>
            <ModalWrapper />
            <GameHeader />
            <div className="flex flex-col items-center justify-center min-h-screen p-6">
                <Card className="w-full max-w-md bg-white text-black shadow-lg">
                    <CardHeader>
                        <CardTitle>Submit a Suggestion</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="author"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Author</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter author name (or leave blank for Anonymous)" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter category" required />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="option1"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Option 1</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter first option" required />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="option2"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Option 2</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter second option" required />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="option3"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Option 3</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter third option" required />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="option4"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Option 4</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter fourth option" required />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full outline outline-1 outline-black">
                                    Submit Suggestion
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </ModalProvider>
    );
}
