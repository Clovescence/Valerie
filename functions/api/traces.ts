interface Env {
  TRACES_DB: KVNamespace;
}

interface Trace {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const data = await context.env.TRACES_DB.get("traces_list");
    const traces = data ? JSON.parse(data) : [];
    
    return new Response(JSON.stringify({ traces }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch traces" }), { status: 500 });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as Trace;
    
    if (!body.message || body.message.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Message is required" }), { status: 400 });
    }

    const newTrace: Trace = {
      id: body.id || crypto.randomUUID(),
      name: body.name?.trim() || "Anonymous",
      message: body.message.trim(),
      createdAt: body.createdAt || new Date().toISOString(),
    };

    // Fetch existing traces
    const data = await context.env.TRACES_DB.get("traces_list");
    const traces: Trace[] = data ? JSON.parse(data) : [];

    // Add new trace to the beginning of the array
    traces.unshift(newTrace);

    // Optional: Keep only the latest 100 traces to prevent KV from getting too large
    if (traces.length > 100) {
      traces.length = 100;
    }

    // Save back to KV
    await context.env.TRACES_DB.put("traces_list", JSON.stringify(traces));

    return new Response(JSON.stringify(newTrace), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to submit trace" }), { status: 500 });
  }
};
