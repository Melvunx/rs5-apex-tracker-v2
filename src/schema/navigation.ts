import { z } from "zod";

export const LinkTypeSchema = z.object({
  link: z.string().min(1),
  label: z.string().min(1),
  classname: z.string().optional(),
  size: z.enum(["sm", "lg"]).optional(),
  variant: z
    .enum(["outline", "ghost", "link", "destructive", "secondary"])
    .optional(),
});

export type LinkType = z.infer<typeof LinkTypeSchema>;

export const NAV_LINKS = [
  { link: "#graph", label: "Graphique", classname: "text-indigo-200" },
  { link: "#form", label: "Ajouter des stats", classname: "text-amber-200" },
  { link: "#carrousel", label: "Stats par armes", classname: "text-lime-200" },
] satisfies LinkType[];
