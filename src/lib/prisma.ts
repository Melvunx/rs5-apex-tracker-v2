import { PrismaNeon } from "@prisma/adapter-neon";
import dotenv from "dotenv";
import { PrismaClient } from "../../app/generated/prisma/client";

dotenv.config();
const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaNeon({ connectionString });
export const prisma = new PrismaClient({ adapter });
