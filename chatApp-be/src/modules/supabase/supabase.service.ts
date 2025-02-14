import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_API_KEY,
    );
  }
  async uploadFile(file: Express.Multer.File) {
    const { originalname, buffer } = file;
    const fileName = `${Date.now()}-${originalname}`;

    const { data, error } = await this.supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(fileName, buffer, { contentType: file.mimetype });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    return this.getPublicUrl(fileName);
  }

  getPublicUrl(fileName: string) {
    return this.supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .getPublicUrl(fileName);
  }
}
