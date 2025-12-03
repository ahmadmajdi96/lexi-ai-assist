import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DOCUMENT_SYSTEM_PROMPT = `You are an expert legal document generator for LexCounsel, a professional legal services platform. Your role is to generate high-quality, professional legal documents based on client intake information.

**Document Requirements:**
1. Generate formal, legally-sound documents appropriate for the requested service
2. Use clear, professional legal language
3. Include all necessary sections, clauses, and provisions
4. Adapt the document to the specific jurisdiction when provided
5. Include placeholder brackets [SPECIFIC DETAIL] for any information not provided
6. Format the document properly with headers, sections, and numbered clauses

**Document Structure Guidelines:**
- Title and document type
- Date and parties involved
- Recitals/Background (if applicable)
- Main clauses and provisions
- Signature blocks
- Witness/notary sections if required

**Important:**
- Be thorough but concise
- Use industry-standard legal terminology
- Consider the urgency level when drafting
- Incorporate any specific requirements from the description
- If feedback is provided, carefully incorporate those changes`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { purchaseId, serviceName, intakeData, feedback, previousDraft } = await req.json();

    console.log('Generating document for purchase:', purchaseId);
    console.log('Service:', serviceName);
    console.log('Intake data:', JSON.stringify(intakeData));

    // Build the user prompt with intake data
    let userPrompt = `Generate a professional legal document for the following service: **${serviceName}**\n\n`;

    // Add client information
    if (intakeData?.clientType) {
      userPrompt += `**Client Type:** ${intakeData.clientType === 'individual' ? 'Individual' : 'Business'}\n\n`;
    }

    if (intakeData?.individualInfo) {
      userPrompt += `**Individual Information:**\n`;
      userPrompt += `- Name: ${intakeData.individualInfo.fullName}\n`;
      userPrompt += `- Email: ${intakeData.individualInfo.email}\n`;
      if (intakeData.individualInfo.phone) userPrompt += `- Phone: ${intakeData.individualInfo.phone}\n`;
      if (intakeData.individualInfo.address) userPrompt += `- Address: ${intakeData.individualInfo.address}\n`;
      userPrompt += '\n';
    }

    if (intakeData?.businessInfo) {
      userPrompt += `**Business Information:**\n`;
      userPrompt += `- Company Name: ${intakeData.businessInfo.companyName}\n`;
      if (intakeData.businessInfo.businessType) userPrompt += `- Business Type: ${intakeData.businessInfo.businessType}\n`;
      userPrompt += `- Contact Person: ${intakeData.businessInfo.contactPerson}\n`;
      userPrompt += `- Contact Email: ${intakeData.businessInfo.contactEmail}\n`;
      if (intakeData.businessInfo.contactPhone) userPrompt += `- Contact Phone: ${intakeData.businessInfo.contactPhone}\n`;
      if (intakeData.businessInfo.businessAddress) userPrompt += `- Business Address: ${intakeData.businessInfo.businessAddress}\n`;
      if (intakeData.businessInfo.registrationNumber) userPrompt += `- Registration Number: ${intakeData.businessInfo.registrationNumber}\n`;
      userPrompt += '\n';
    }

    if (intakeData?.legalMatter) {
      userPrompt += `**Legal Matter Details:**\n`;
      userPrompt += `- Jurisdiction: ${intakeData.legalMatter.jurisdiction}\n`;
      if (intakeData.legalMatter.urgencyLevel) userPrompt += `- Urgency: ${intakeData.legalMatter.urgencyLevel}\n`;
      userPrompt += `- Description: ${intakeData.legalMatter.description}\n`;
      if (intakeData.legalMatter.additionalNotes) userPrompt += `- Additional Notes: ${intakeData.legalMatter.additionalNotes}\n`;
      userPrompt += '\n';
    }

    // Handle revision requests
    if (feedback && previousDraft) {
      userPrompt += `\n**REVISION REQUEST:**\n`;
      userPrompt += `The following document was previously generated:\n\n---\n${previousDraft}\n---\n\n`;
      userPrompt += `Please revise the document based on this feedback: ${feedback}\n`;
    }

    userPrompt += `\nPlease generate a complete, professional legal document ready for review.`;

    console.log('User prompt:', userPrompt);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: DOCUMENT_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const document = data.choices?.[0]?.message?.content;

    if (!document) {
      throw new Error('No document generated');
    }

    console.log('Document generated successfully');

    return new Response(
      JSON.stringify({ document }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in generate-document function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate document';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
