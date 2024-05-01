import { NextResponse } from "next/server";

type ErrorResponse = {
  type: "error";
  message: string;
};

type SuccessResponse<Res> = {
  type: "success";
  data: Res;
};

export type ApiResponse<Res> = ErrorResponse | SuccessResponse<Res>;

export const executeApi =
  <Res, Req>(
    schema: (payload: any) => Req,
    handler: (req: Request, body: Req) => Promise<Res>
  ) =>
  async (req: Request) => {
    try {
      const payload = await req.json();
      const parsed = schema(payload);
      const data = await handler(req, parsed);
      return NextResponse.json({
        type: "success",
        data: data,
      });
    } catch (err) {
      return NextResponse.json(
        { type: "error", message: (err as Error).message },
        {
          status: 500,
        }
      );
    }
  };