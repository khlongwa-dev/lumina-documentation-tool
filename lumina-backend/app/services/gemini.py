import time
import google.generativeai as genai
from app.core.config import settings

genai.configure(api_key=settings.gemini_api_key)

model = genai.GenerativeModel("gemini-3.1-flash-lite-preview")

SYSTEM_INSTRUCTIONS = {

    "readme": """You are a senior technical writer. Generate a professional README.md for the provided code or project description.
Structure it with: Project Title, Description, Tech Stack, Installation, Usage with code examples, API Reference if applicable, Contributing, and License.
Be concise but thorough. Use proper Markdown formatting throughout.""",

    "comment": """You are a senior software engineer performing a code review documentation pass.
For the provided code: add inline comments explaining the WHY not just the WHAT, add a docstring to every function/class describing parameters, return values, and purpose, and add a module-level comment summarizing what the file does.
Preserve all original logic exactly. Return the fully documented code.""",

    "docstring": """You are a technical documentation specialist. Generate only docstrings for the provided code.
Follow the Google docstring style: include Args, Returns, Raises, and an Example section for every function and class.
Return only the code with docstrings added, nothing else.""",

    "changelog": """You are a release manager writing developer-facing documentation.
Given code changes or a description of what changed, generate a structured CHANGELOG entry following Keep a Changelog format.
Include: version placeholder, date placeholder, and categorized changes under Added, Changed, Fixed, Removed as applicable.""",

    "review": """You are a senior engineer doing a documentation audit.
Analyze the provided code and return a structured report covering: missing documentation, unclear variable or function names, undocumented parameters, missing error handling documentation, and suggested improvements.
Format the report clearly with sections and bullet points.""",
}


def call_gemini(command: str, user_input: str) -> dict:
    """
    Calls Gemini with the appropriate system instruction for the given command.
    Returns output, tokens used, generation time, status, and auto-generated title.
    """
    system_instruction = SYSTEM_INSTRUCTIONS.get(command)

    if not system_instruction:
        return {
            "output": None,
            "tokens_used": None,
            "gen_time_ms": None,
            "status": "failed",
            "title": None,
        }

    start_time = time.time()

    try:
        full_prompt = f"{system_instruction}\n\n{user_input}"
        response = model.generate_content(full_prompt)

        gen_time_ms = int((time.time() - start_time) * 1000)
        output = response.text
        tokens_used = response.usage_metadata.total_token_count if response.usage_metadata else None
        title = generate_title(command, user_input)

        return {
            "output": output,
            "tokens_used": tokens_used,
            "gen_time_ms": gen_time_ms,
            "status": "success",
            "title": title,
        }

    except Exception as e:
        gen_time_ms = int((time.time() - start_time) * 1000)
        return {
            "output": None,
            "tokens_used": None,
            "gen_time_ms": gen_time_ms,
            "status": "failed",
            "title": None,
        }


def generate_title(command: str, user_input: str) -> str:
    """
    Asks Gemini to generate a short meaningful title for the transaction.
    Similar to how Claude names conversations automatically.
    """
    try:
        prompt = (
            f"Generate a short 5-7 word title for this task: "
            f"the user ran a '{command}' command on this input: "
            f"{user_input[:200]}. Return only the title, nothing else. "
            f"No punctuation at the end."
        )
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception:
        return f"{command} transaction"