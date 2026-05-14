"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

type SubmitProps = {
  emptyInput?: boolean;
};

export function Submit({ emptyInput: empty }: SubmitProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      className="cursor-pointer transition-colors"
      variant="ghost"
      type="submit"
      disabled={pending || empty}
    >
      {pending ? (
        <span>
          Envoie en cours <Spinner />
        </span>
      ) : (
        "Envoyer"
      )}
    </Button>
  );
}
