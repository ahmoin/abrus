import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type TestQuestionProps = {
  questionNumber: number;
  questionText: string;
  answers: string[];
};

export function TestQuestion({
  questionNumber,
  questionText,
  answers,
}: TestQuestionProps) {
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }

  const ids = answers.map(
    (_, index) => `${questionNumber}-answer-${index + 1}`
  );

  return (
    <div className="py-4">
      <h1 className="font-serif text-justify">
        {questionNumber} {questionText}
      </h1>
      <RadioGroup>
        {answers.map((answer, index) => (
          <div key={index} className="flex items-center space-x-2">
            <RadioGroupItem value={answer} id={ids[index]} />
            <Label htmlFor={ids[index]}>{answer}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
