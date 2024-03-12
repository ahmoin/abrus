import { createRoot } from "react-dom/client";
import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useState } from "react";
import { TestQuestion } from "./components/ui/test-question";

function App() {
  const [jsonText, setJsonText] = useState("");
  let root: any;

  const [open, setOpen] = useState(false); // State to manage dialog visibility

  const handleClose = () => setOpen(false); // Function to close the dialog

  const handleClick = () => {
    let isValid = false;
    let reasonInvalid;
    const container = document.getElementById("test-questions-container");
    if (container) {
      if (!root) {
        root = createRoot(container);
      }
      try {
        const jsonData = JSON.parse(jsonText);

        if (!Array.isArray(jsonData)) {
          reasonInvalid = "Invalid JSON: Must be an array of objects";
        }

        if (jsonData.length === 0) {
          reasonInvalid = "Invalid: Must include at least one question";
        }
        if (typeof reasonInvalid !== "string") {
          let hasValidQuestion = false;
          for (const question of jsonData) {
            if (!question || typeof question !== "object") {
              reasonInvalid = "Invalid question object: Must be an object";
              continue;
            }

            const requiredKeys = ["question", "answers"];
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
              question.answers &&
              (!Array.isArray(question.answers) ||
                question.answers.length !== 4)
            ) {
              reasonInvalid = "Invalid answers: Must be an array of 4 strings";
              isValidQuestion = false;
            }

            for (const answer of question.answers) {
              if (typeof answer !== "string") {
                reasonInvalid = "Invalid answer: Must be a string";
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
        }
      } catch (error) {
        if (
          typeof error === "object" &&
          error &&
          "message" in error &&
          typeof error.message === "string"
        ) {
          reasonInvalid = error.message;
        }
      }
      if (isValid) {
        console.log("Validated!");
        toast("JSON data validated!", {
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          },
          description: "Your test is being created...",
        });
        const questions = JSON.parse(jsonText);

        const testQuestionElements = questions.map(
          (question: any, index: number) => (
            <TestQuestion
              key={index}
              questionNumber={index + 1}
              questionText={question.question}
              answers={question.answers}
            />
          )
        );

        // Render the elements directly into the container:
        root.render(testQuestionElements);
      } else {
        console.log(reasonInvalid);
        toast("JSON data not valid!", {
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-warning group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          },
          description: reasonInvalid,
        });
      }
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
        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">JSON Data Editor</Button>
            </DialogTrigger>
            <DialogContent className="h-auto sm:w-[400px] md:min-w-[800px]">
              <DialogHeader>
                <DialogTitle>JSON Editor</DialogTitle>
              </DialogHeader>
              <Textarea
                id="json-textarea"
                placeholder="Input JSON here."
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
              />
              <DialogFooter>
                <Button type="button" variant={"secondary"}>
                  Copy to Clipboard
                </Button>
                <Button
                  type="button"
                  variant={"secondary"}
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button type="submit" onClick={handleClick}>
                  Apply Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </ul>
      </div>
      <div
        id="test-questions-container"
        className="max-w-2xl mx-auto py-10 px-4"
      ></div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
