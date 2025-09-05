import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

export async function GET() {
  try {
    // Path to your CSV file (place it inside /data/emails.csv at project root)
    const filePath = path.join(process.cwd(), "data", "emails.csv");

    // Read file contents
    const file = fs.readFileSync(filePath, "utf8");

    // Parse CSV into JSON
    const parsed = Papa.parse(file, {
      header: true,       // Treat first row as column headers
      skipEmptyLines: true,
    });

    // Send parsed data as JSON response
    return NextResponse.json(parsed.data);
  } catch (error: any) {
    console.error("Error loading CSV:", error);
    return NextResponse.json(
      { error: "Failed to load CSV data" },
      { status: 500 }
    );
  }
}
