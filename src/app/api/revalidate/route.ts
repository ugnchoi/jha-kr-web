import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

const secret = process.env.SANITY_REVALIDATE_SECRET;

const getProvidedSecret = (request: NextRequest) =>
  request.nextUrl.searchParams.get("secret") ??
  request.headers.get("x-revalidate-secret");

type RevalidatePayload = {
  tag?: string;
  tags?: string[];
  path?: string;
  paths?: string[];
};

const collectValues = (single?: string, multiple?: string[]) => {
  const values = new Set<string>();

  if (single) {
    values.add(single);
  }

  multiple?.forEach((value) => {
    if (value) {
      values.add(value);
    }
  });

  return [...values];
};

export async function POST(request: NextRequest) {
  if (!secret) {
    return NextResponse.json(
      { error: "재검증 시크릿이 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const providedSecret = getProvidedSecret(request);

  if (providedSecret !== secret) {
    return NextResponse.json({ error: "올바르지 않은 시크릿입니다." }, { status: 401 });
  }

  let payload: RevalidatePayload = {};

  try {
    if (request.headers.get("content-length") !== "0") {
      payload = await request.json();
    }
  } catch {
    return NextResponse.json(
      { error: "잘못된 JSON 페이로드입니다." },
      { status: 400 }
    );
  }

  const tags = collectValues(payload.tag, payload.tags);
  const paths = collectValues(payload.path, payload.paths);

  if (!tags.length && !paths.length) {
    return NextResponse.json(
      { error: "최소한 하나의 태그 또는 경로를 제공해 주세요." },
      { status: 400 }
    );
  }

  await Promise.all([
    ...tags.map(async (tag) => revalidateTag(tag, { expire: 0 })),
    ...paths.map(async (path) => revalidatePath(path)),
  ]);

  return NextResponse.json({
    revalidated: true,
    tags,
    paths,
    timestamp: Date.now(),
  });
}

export async function GET(request: NextRequest) {
  if (!secret) {
    return NextResponse.json(
      { error: "재검증 시크릿이 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const providedSecret = getProvidedSecret(request);

  if (providedSecret !== secret) {
    return NextResponse.json({ error: "올바르지 않은 시크릿입니다." }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    message: "재검증 엔드포인트가 준비되었습니다. POST로 호출해 주세요.",
    timestamp: Date.now(),
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: "POST, GET, OPTIONS",
    },
  });
}


