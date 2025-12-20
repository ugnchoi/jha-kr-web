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
      { error: "Revalidation secret not configured" },
      { status: 500 }
    );
  }

  const providedSecret = getProvidedSecret(request);

  if (providedSecret !== secret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  let payload: RevalidatePayload = {};

  try {
    if (request.headers.get("content-length") !== "0") {
      payload = await request.json();
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const tags = collectValues(payload.tag, payload.tags);
  const paths = collectValues(payload.path, payload.paths);

  if (!tags.length && !paths.length) {
    return NextResponse.json(
      { error: "Provide at least one tag or path." },
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
      { error: "Revalidation secret not configured" },
      { status: 500 }
    );
  }

  const providedSecret = getProvidedSecret(request);

  if (providedSecret !== secret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    message: "Revalidate endpoint ready. Use POST to trigger.",
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


