"use client"

import GameHeader from "@/components/GameHeader";
import TextInput from "@/components/ui/TextInput";
import { Button, IconButton } from "@/components/ui/Button";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { ConsensiSuggestion } from "@/lib/interfaces";
import axios from "axios";
import { useToast } from "@/context/ToastContext";
import { ChevronLeft } from "lucide-react";

export default function SuggestConsensus() {
  const { data: session } = useSession();
  const { showToast } = useToast();

  const emptySuggestion = {
    category: "",
    author: session?.user?.name || "Anonymous",
    options: ["", "", "", ""],
  }
  
  const [formData, setFormData] = useState(emptySuggestion);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const suggestion: ConsensiSuggestion = {
      category: formData.category,
      author: formData.author,
      options: formData.options,
      date: null,
    };
    axios.post("/api/admin/suggestions", suggestion);
    setFormData(emptySuggestion);
    showToast("Suggestion submitted!", "Thanks for your contribution!", "success");
  }

  return (
    <>
    <GameHeader />
    <div className="max-w-md mx-auto">
      <h1 className="font-funnel font-bold md:text-2xl text-center my-8">Suggest a Consensus Category</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="category" className="block mb-2 font-funnel font-bold">Category</label>
        <TextInput
          placeholder="Category"
          name="category"
          className="mb-4"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />
        <label htmlFor="author" className="block mb-2 font-funnel font-bold">Author</label>
        <TextInput
          placeholder="Author"
          name="author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
        />
        <hr className="dark:border-inset my-6" />
        <TextInput
          className="border-2 border-gameBlue"
          placeholder="Option 1"
          value={formData.options[0]}
          onChange={(e) => {
            const newOptions = [...formData.options];
            newOptions[0] = e.target.value;
            setFormData({ ...formData, options: newOptions });
          }}
        />
        <br />
        <TextInput
          className="border-2 border-gameGreen"
          placeholder="Option 2"
          value={formData.options[1]}
          onChange={(e) => {
            const newOptions = [...formData.options];
            newOptions[1] = e.target.value;
            setFormData({ ...formData, options: newOptions });
          }}
        />
        <br />
        <TextInput
          className="border-2 border-gameYellow"
          placeholder="Option 3"
          value={formData.options[2]}
          onChange={(e) => {
            const newOptions = [...formData.options];
            newOptions[2] = e.target.value;
            setFormData({ ...formData, options: newOptions });
          }}
        />
        <br />
        <TextInput
          className="border-2 border-gameRed"
          placeholder="Option 4"
          value={formData.options[3]}
          onChange={(e) => {
            const newOptions = [...formData.options];
            newOptions[3] = e.target.value;
            setFormData({ ...formData, options: newOptions });
          }}
        />
        <Button className="w-full mt-8" type="submit" disabled={formData.category === "" || formData.author === "" || formData.options.some(option => option === "")}>Submit Suggestion</Button>
      </form>
    </div>
    </>
  );
}