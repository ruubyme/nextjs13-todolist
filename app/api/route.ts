import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const response = {
    message: "하하",
    data: "gg",
  };
  return NextResponse.json(response, { status: 201 });
}
