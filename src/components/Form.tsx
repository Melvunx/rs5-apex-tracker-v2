"use client";

import { Upload } from "lucide-react";
import { RefObject } from "react";
import { Submit } from "./Submit";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type FormProps = {
  action: (formData: FormData) => Promise<void>;
  onReset: () => void;
  pending: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  file: File | null;
};

export function Form({
  action: onHandleFormAction,
  onReset,
  pending,
  onChange: handleFileChange,
  inputRef: ref,
  file,
}: FormProps) {
  return (
    <form
      action={(formData) => onHandleFormAction(formData)}
      className="w-full flex flex-col items-center justify-center gap-2"
    >
      <div>
        <label
          htmlFor="file-upload"
          className="flex items-center justify-evenly w-sm p-2 border-2 border-dashed border-amber-400 rounded-md cursor-pointer hover:border-amber-800 transition-colors gap-4"
        >
          <input
            type="file"
            accept=".txt"
            onChange={handleFileChange}
            ref={ref}
            className="hidden"
            id="file-upload"
          />

          {pending ? <Spinner /> : <Upload />}
          <span
            className={`transition-colors ${pending ? "text-amber-700 italic" : "text-amber-400"}`}
          >
            {file ? file.name : "Cliquer pour choisir un fichier"}
          </span>
        </label>
      </div>
      <div>
        <Submit emptyInput={!file} />
        <Tooltip>
          <TooltipTrigger>
            <Button size="sm" variant="ghost" onClick={onReset}>
              X
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Reset</span>
          </TooltipContent>
        </Tooltip>
      </div>
    </form>
  );
}
