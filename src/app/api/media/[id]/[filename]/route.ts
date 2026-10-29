import { NextRequest } from "next/server";
import { handleMediaRequest } from "@/lib/server/serveMedia";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; filename: string }> }
) {
  const { id, filename } = await params;
  return handleMediaRequest(Number(id), filename);
}
