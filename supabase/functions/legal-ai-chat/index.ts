import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LEGAL_SYSTEM_PROMPT = `You are an expert AI legal assistant for LexCounsel, a modern legal services platform. You specialize in:

1. **Contract Law**: NDAs, service agreements, employment contracts, lease agreements
2. **Business Formation**: LLC setup, corporation formation, operating agreements
3. **Employment Law**: Employment contracts, employee handbooks, workplace policies
4. **Intellectual Property**: Trademarks, copyrights, patents
5. **Real Estate**: Purchase agreements, lease contracts, property documentation

Your role is to:
- Explain legal concepts in clear, accessible language
- Help users understand their legal documents
- Answer questions about legal processes and requirements
- Provide guidance on which services they might need
- Draft initial contract clauses when requested (with disclaimer that lawyer review is required)

Important guidelines:
- Always be professional but approachable
- Provide educational information, not legal advice
- Remind users that AI-generated content should be reviewed by a licensed attorney
- Be concise but thorough in your explanations
- When unsure, recommend consulting with a human lawyer
- Never provide advice on ongoing litigation or criminal matters

If the user provides context about a specific service or document they're working on, tailor your responses to that context.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { messages, sessionId, serviceContext } = await req.json();
    console.log("Received chat request:", { sessionId, messageCount: messages?.length, serviceContext });

    // Build context-aware system prompt
    let systemPrompt = LEGAL_SYSTEM_PROMPT;
    if (serviceContext) {
      systemPrompt += `\n\nContext: The user is currently working on a ${serviceContext} service. Focus your assistance on this specific area.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please contact support." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response from AI Gateway");
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("Error in legal-ai-chat:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
