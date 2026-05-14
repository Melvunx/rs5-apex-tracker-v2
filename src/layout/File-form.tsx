"use client";

import { Form } from "@/components/Form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { uploadChallengeFile } from "@app/actions/form-challenge";
import { ChangeEvent, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

export function FileForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetInput = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onHandleFormAction = async (formData: FormData) => {
    if (!file) {
      toast.warning("Aucun fichier sélectionné");
      return;
    }

    formData.append("file", file);

    startTransition(async () => {
      const result = await uploadChallengeFile(formData);

      if (result.success) {
        toast.success(
          `✨ ${result.imported} enregistrement${result.imported > 1 ? "s" : ""} importé${result.imported > 1 ? "s" : ""} !`,
          {
            description:
              result.errors > 0
                ? `⚠️ ${result.errors} ligne${result.errors > 1 ? "s" : ""} ignorée${result.errors > 1 ? "s" : ""} : ${result.error}`
                : undefined,
          },
        );
        resetInput();
      } else {
        toast.error("Erreur lors de l'import", {
          description: result.error,
        });
      }
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="scroll-m-20 text-2xl font-bold tracking-tight">
          Apex Legends Stats Importer !
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-xs uppercase font-semibold text-muted-foreground italic">
          Sélectionnez votre fichier de résultats
        </CardDescription>
        <Form
          action={onHandleFormAction}
          onReset={resetInput}
          pending={isPending}
          onChange={handleFileChange}
          file={file}
          inputRef={fileInputRef}
        />
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-6 items-start">
        <div className="flex items-center gap-2 py-1.5 px-2 rounded-sm hover:bg-accent transition-colors w-full">
          <span className="text-sm font-semibold text-muted-foreground">
            Format accepté :
          </span>
          <span className="font-bold text-primary">.txt</span>
        </div>
        <div className="flex items-center gap-2 py-1.5 px-2 rounded-sm hover:bg-accent transition-colors w-full">
          <span className="text-sm font-semibold text-muted-foreground">
            Format attendu :
          </span>
          <span className="font-semibold">CSV avec en-têtes</span>
        </div>
      </CardFooter>
    </Card>
  );
}
