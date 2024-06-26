import path from "path";
import fs from "fs";

export async function GET(req: Request) {
  return Response.json({
    hello: "world"
  })
}


export async function POST(req: Request, context: any) {
  try {
    let body = await req.json();

    let url = path.join(process.cwd(), 'public', body.src)
    const file = await fs.promises.readFile(url, 'utf8');
    const data = JSON.parse(file);

    return new Response(JSON.stringify(data.transcription) , {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
      status : 201
    })
  } 
  catch(err){
    return new Response(JSON.stringify(err), {
      headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      },
      status : 400
    })
  }
}