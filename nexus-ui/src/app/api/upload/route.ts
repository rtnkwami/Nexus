// nexus-ui/app/api/upload/route.ts
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('image') as File;

  if (!file) return new Response('No file', { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}-${file.name}`;
  const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

  await writeFile(filePath, buffer);

  const url = `/uploads/${filename}`;
  return Response.json({ url });
}