import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { purchaseId, message, serviceContext } = await req.json();
    console.log("Service chat request:", { purchaseId, serviceContext });

    // Get purchase details and history
    const { data: purchase } = await supabase
      .from("purchases")
      .select(`
        *,
        service:services(name, description, features)
      `)
      .eq("id", purchaseId)
      .single();

    // Get previous messages for context
    const { data: previousMessages } = await supabase
      .from("purchase_messages")
      .select("content, role")
      .eq("purchase_id", purchaseId)
      .order("created_at", { ascending: true })
      .limit(20);

    // Build context from service details
    let serviceInfo = "";
    if (purchase?.service) {
      serviceInfo = `
Service: ${purchase.service.name}
Description: ${purchase.service.description || "N/A"}
Features: ${JSON.stringify(purchase.service.features) || "N/A"}
Status: ${purchase.status}
`;
    }

    const systemPrompt = `You are a helpful legal assistant for LexCounsel, assisting a client with their purchased legal service.

CURRENT SERVICE CONTEXT:
${serviceInfo}

Your role is to:
1. Answer questions about this specific legal service the user purchased
2. Explain legal terms and concepts related to their service
3. Provide guidance on next steps in their legal process
4. Help them understand their documents once generated

Important guidelines:
- Be professional but friendly
- Only discuss matters related to their purchased service
- If asked about unrelated legal matters, politely redirect them to purchase the appropriate service
- Never provide specific legal advice - always recommend consulting with a licensed attorney for specific situations
- Be helpful with general information and explanations`;

    // Build messages array
    const messages = [
      { role: "system", content: systemPrompt },
    ];

    // Add previous conversation history
    if (previousMessages && previousMessages.length > 0) {
      for (const msg of previousMessages) {
        if (msg.role === "user" || msg.role === "assistant") {
          messages.push({ role: msg.role, content: msg.content });
        }
      }
    }

    // Add current message
    messages.push({ role: "user", content: message });

    // Call Lovable AI
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Service chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
