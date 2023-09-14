import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useToast } from "./ui/use-toast";
import { api } from "@/lib/axios";

type Prompt = {
  id: string;
  title: string;
  template: string;
};

type PromptSelectProps = {
  onPromptSelected: (template: string) => void;
};

export function PromptSelect({ onPromptSelected }: PromptSelectProps) {
  const { toast } = useToast();

  const [prompts, setPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    async function loadPrompts() {
      try {
        const response = await api.get("/prompts");

        setPrompts(response.data);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Ops!",
          description:
            "Deu algo de errado ao tentar carregar as opções de prompts.",
        });
      }
    }

    loadPrompts();
  }, []);

  function handlePromptSelected(promptId: string) {
    const selectedPrompt = prompts.find((prompt) => prompt.id === promptId);

    if (!selectedPrompt) {
      return;
    }

    onPromptSelected(selectedPrompt.template);
  }

  return (
    <Select onValueChange={handlePromptSelected}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione um prompt" />
      </SelectTrigger>
      <SelectContent>
        {prompts.map((prompt) => (
          <SelectItem key={prompt.id} value={prompt.id}>
            {prompt.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
