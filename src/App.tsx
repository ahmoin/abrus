import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useState } from "react";

function App() {
  const [jsonText, setJsonText] = useState("");

  const handleClick = () => {
    let isValid = false;
    let reasonInvalid;
    try {
      const jsonData = JSON.parse(jsonText);

      if (!Array.isArray(jsonData)) {
        console.log("Invalid JSON: Must be an array of objects");
        return;
      }

      if (jsonData.length === 0) {
        console.log("Invalid: Must include at least one question");
        return;
      }

      let hasValidQuestion = false;
      for (const question of jsonData) {
        if (!question || typeof question !== "object") {
          console.log("Invalid question object: Must be an object");
          continue;
        }

        const requiredKeys = ["question", "correctAnswer", "falseAnswers"];
        let isValidQuestion = true;
        for (const key of requiredKeys) {
          if (!question.hasOwnProperty(key)) {
            reasonInvalid = `Missing required property: ${key}`;
            isValidQuestion = false;
          }
        }

        if (question.question && typeof question.question !== "string") {
          reasonInvalid = "Invalid question: Must be a string";
          isValidQuestion = false;
        }

        if (
          question.correctAnswer &&
          typeof question.correctAnswer !== "string"
        ) {
          reasonInvalid = "Invalid correctAnswer: Must be a string";
          isValidQuestion = false;
        }

        if (
          question.falseAnswers &&
          (!Array.isArray(question.falseAnswers) ||
            question.falseAnswers.length !== 3)
        ) {
          reasonInvalid = "Invalid falseAnswers: Must be an array of 3 strings";
          isValidQuestion = false;
        }

        for (const answer of question.falseAnswers) {
          if (typeof answer !== "string") {
            reasonInvalid = "Invalid falseAnswer: Must be a string";
            isValidQuestion = false;
          }
        }

        if (isValidQuestion) {
          hasValidQuestion = true;
          break;
        }
      }

      if (hasValidQuestion) {
        isValid = true;
      } else if (typeof reasonInvalid !== "string") {
        reasonInvalid = "No valid questions found in the JSON data";
      }
    } catch (error) {
      if (
        typeof error === "object" &&
        error &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        toast("JSON data not valid!", {
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-warning group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          },
          description: error.message,
        });
      }
    }
    if (isValid) {
      toast("JSON data validated!", {
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
        },
        description: "Your test is being created...",
      });
    } else if (typeof reasonInvalid === "string") {
      toast("JSON data not valid!", {
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-warning group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
        },
        description: reasonInvalid,
      });
    }
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="max-w-2xl mx-auto py-10 px-4">
        <header>
          <div className="flex items-center justify-between">
            <ModeToggle />
            <nav className="ml-auto text-sm font-medium space-x-6">
              <a href="/" rel="noopener noreferrer nofollow">
                <Badge variant="outline">Home</Badge>
              </a>
            </nav>
          </div>
        </header>
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="grid w-full gap-2">
          <Textarea
            id="json-textarea"
            placeholder="Input JSON here."
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
          />
          <Button onClick={handleClick}>Create Test</Button>
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
