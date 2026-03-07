import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ParsedJob {
  title: string;
  company: string;
  payRange: string;
  description: string;
  applyDate: string;
}

export interface CoverLetterRequest {
  jobTitle: string;
  company: string;
  jobDescription: string;
  resumeContent?: string;
  customInstructions?: string;
}

export async function parseJobPosting(jobText: string): Promise<ParsedJob> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a job posting parser. Extract the following information from the job posting text and return it as JSON:
- title: The job title
- company: The company name
- payRange: The salary/pay range if mentioned, otherwise "Not specified"
- description: A clean, formatted version of the job description as HTML (use <p> for paragraphs, <ul>/<li> for lists, <strong> for emphasis)
- applyDate: Today's date in YYYY-MM-DD format

Return ONLY valid JSON, no markdown or explanation.`,
      },
      {
        role: "user",
        content: jobText,
      },
    ],
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content || "{}";

  try {
    return JSON.parse(content.replace(/```json\n?|\n?```/g, ""));
  } catch {
    return {
      title: "",
      company: "",
      payRange: "Not specified",
      description: jobText,
      applyDate: new Date().toISOString().split("T")[0],
    };
  }
}

export async function generateCoverLetter(request: CoverLetterRequest): Promise<string> {
  // Get current date formatted
  const today = new Date();
  const currentDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let systemPrompt = request.resumeContent
    ? `You are a professional cover letter writer. Write a compelling, personalized cover letter based on the job details and the candidate's resume. The letter should:
- Start with the candidate's contact info header (name, address, phone, email from resume) formatted properly
- Include the date "${currentDate}" (use this exact date, do not use any other date or placeholder)
- Include the company name and "Hiring Manager" as recipient
- Be professional but personable
- Highlight relevant experience from the resume
- Show enthusiasm for the role
- Be 3-4 body paragraphs
- End with a professional closing (Sincerely, followed by the candidate's name)
- Return as clean HTML using <p> tags for paragraphs and <br> for line breaks in the header
- Do NOT wrap in markdown code blocks`
    : `You are a professional cover letter writer. Write a compelling cover letter template based on the job details. The letter should:
- Start with placeholder header: [Your Name], [Your Address], [Phone], [Email]
- Include the date "${currentDate}" (use this exact date, do not use any other date or placeholder)
- Include the company name and "Hiring Manager" as recipient
- Be professional but personable
- Be adaptable for various candidates
- Show enthusiasm for the role
- Be 3-4 body paragraphs
- End with a professional closing
- Return as clean HTML using <p> tags for paragraphs and <br> for line breaks in the header
- Do NOT wrap in markdown code blocks`;

  if (request.customInstructions) {
    systemPrompt += `\n\nAdditional instructions from the user:\n${request.customInstructions}`;
  }

  const userContent = request.resumeContent
    ? `Job Title: ${request.jobTitle}
Company: ${request.company}
Job Description: ${request.jobDescription}

Candidate Resume:
${request.resumeContent}`
    : `Job Title: ${request.jobTitle}
Company: ${request.company}
Job Description: ${request.jobDescription}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    temperature: 0.7,
  });

  let content = response.choices[0]?.message?.content || "Unable to generate cover letter.";
  // Strip markdown code blocks if present
  content = content.replace(/```html\n?/gi, '').replace(/```\n?/g, '').trim();
  return content;
}

export interface FitAnalysis {
  fitScore: string;
  tableHtml: string;
}

export async function generateFitAnalysis(request: CoverLetterRequest): Promise<FitAnalysis> {
  if (!request.resumeContent) {
    return {
      fitScore: "N/A",
      tableHtml: "<p>Please select a resume to generate fit analysis.</p>"
    };
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a job fit analyzer. Analyze how well the candidate's resume matches the job requirements.

Return a JSON object with:
- fitScore: An overall percentage score (e.g., "85%")
- tableHtml: An HTML table comparing key job requirements vs candidate qualifications. The table should have columns: "Requirement", "Your Qualification", "Match" (use ✓, ~, or ✗). Include 5-8 key requirements.

Return ONLY valid JSON, no markdown code blocks.`
      },
      {
        role: "user",
        content: `Job Title: ${request.jobTitle}
Company: ${request.company}
Job Description: ${request.jobDescription}

Candidate Resume:
${request.resumeContent}`
      }
    ],
    temperature: 0.5,
  });

  const content = response.choices[0]?.message?.content || "{}";
  try {
    const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      fitScore: "N/A",
      tableHtml: "<p>Unable to generate fit analysis.</p>"
    };
  }
}

export async function generateWhyCompanyAnswers(request: CoverLetterRequest): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are helping a job candidate prepare for the interview question "Why do you want to work for this company?"

Based on the job posting and company, generate compelling answers in three lengths:
1. A 1-sentence version (concise elevator pitch)
2. A 2-sentence version (brief but impactful)
3. A 3-sentence version (more detailed)

${request.resumeContent ? "Personalize the answers based on the candidate's resume." : ""}

Return as clean HTML with clear visual separation between each version. Format like this:
<div style="margin-bottom: 1.5rem;">
  <p><strong>1-sentence version:</strong></p>
  <p style="margin-left: 1rem;">[answer here]</p>
</div>
<div style="margin-bottom: 1.5rem;">
  <p><strong>2-sentence version:</strong></p>
  <p style="margin-left: 1rem;">[answer here]</p>
</div>
<div>
  <p><strong>3-sentence version:</strong></p>
  <p style="margin-left: 1rem;">[answer here]</p>
</div>

Do NOT wrap in markdown code blocks.`
      },
      {
        role: "user",
        content: `Job Title: ${request.jobTitle}
Company: ${request.company}
Job Description: ${request.jobDescription}
${request.resumeContent ? `\nCandidate Resume:\n${request.resumeContent}` : ''}`
      }
    ],
    temperature: 0.7,
  });

  let content = response.choices[0]?.message?.content || "Unable to generate answers.";
  content = content.replace(/```html\n?/gi, '').replace(/```\n?/g, '').trim();
  return content;
}
