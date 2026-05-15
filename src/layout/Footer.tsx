// components/Footer.tsx
import { Button } from "@/components/ui/button";
import { ExternalLink, FolderBookmarkIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          R5 <span className="font-semibold text-foreground">Melvunx</span>{" "}
          tracker
        </p>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <FolderBookmarkIcon className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          </Button>

          <Button variant="ghost" size="sm">
            <a
              href="https://apexlegendsstatus.com/stats/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Apex Legends Status</span>
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
}
