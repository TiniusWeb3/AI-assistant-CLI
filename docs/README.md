# README for Prompt Refinement Script

## Overview
This Python script leverages OpenAI's API to analyze and improve user-provided prompts. It identifies limitations or ambiguities in the prompt, suggests specific improvements, and provides refined versions of the prompt for clarity and effectiveness. The script uses the `rich` library for enhanced terminal output and requires an OpenAI API key to function.

---

## Installation Instructions

### Prerequisites
- Python 3.6 or higher
- An OpenAI API key (set as an environment variable `OPENAI_API_KEY`)

### Dependencies
Install the required Python packages using `pip`:
```bash
pip install openai rich
```

### Environment Setup
Set your OpenAI API key as an environment variable. On Unix-based systems (Linux/macOS), you can add it to your shell configuration file (e.g., `.bashrc`, `.zshrc`):
```bash
export OPENAI_API_KEY='your-api-key-here'
```
On Windows, use the Command Prompt or PowerShell:
```cmd
set OPENAI_API_KEY=your-api-key-here
```
Ensure the environment variable is active in your current session.

---

## Usage Examples

### Basic Usage
Run the script with a prompt to analyze and improve:
```bash
python script.py "Write a script to send emails"
```
The script will:
1. Analyze the prompt for limitations or ambiguities.
2. Suggest specific improvements.
3. Provide two refined versions (simple and detailed).

Example output:
```
Processing prompt: Write a script to send emails

┌─────────────────── Prompt Analysis ───────────────────┐
│ **Limitations or Ambiguities:**                        │
│ 1. Lack of specificity regarding email protocol or     │
│    service (e.g., SMTP, Gmail API).                   │
│ 2. Unclear whether the script should include          │
│    authentication, attachments, or multiple recipients.│
│                                                        │
│ **Improvement Suggestions:**                           │
│ 1. Specify the email service or protocol to use.       │
│ 2. Define additional requirements such as attachments, │
│    recipient handling, or authentication details.      │
│                                                        │
│ **Refined Versions:**                                  │
│ *Simple Version:*                                      │
│ "Write a Python script to send emails using Gmail's    │
│ API, including authentication and support for multiple │
│ recipients."                                           │
│                                                        │
│ *Detailed Version:*                                    │
│ "Develop a Python script to send emails using SMTP,    │
│ supporting attachments, multiple recipients, and secure│
│ authentication. Include error handling and logging for │
│ failed attempts."                                      │
└────────────────────────────────────────────────────────┘
```

### Advanced Usage
Specify a different OpenAI model (default is `gpt-3.5-turbo`):
```bash
python script.py "Explain quantum computing" --model gpt-4
```

---

## Key Features and Benefits
- **Prompt Analysis**: Identifies limitations or ambiguities in user-provided prompts.
- **Improvement Suggestions**: Offers actionable suggestions to enhance prompt clarity.
- **Refined Outputs**: Provides both simple and detailed refined versions of the prompt.
- **Rich Formatting**: Uses the `rich` library for visually appealing terminal output.
- **Customizable**: Supports different OpenAI models via command-line arguments.
- **Error Handling**: Validates the presence of the OpenAI API key and handles API errors gracefully.

---

## Configuration and Setup
- Ensure the `OPENAI_API_KEY` environment variable is set before running the script.
- Optionally, modify the default OpenAI model in the script's argument parser if you frequently use a different model.
- The script uses a temperature of 0.7 for OpenAI API calls, which balances creativity and coherence. Adjust this value in the `analyze_prompt` function if needed.

---

## Contributing or Modifying the Script
To contribute or modify the script:
1. Clone the repository or download the script.
2. Make changes to the code, ensuring compatibility with the existing dependencies.
3. Test the script with various prompts to verify functionality.
4. Submit a pull request or share your modified version with the community.

Potential enhancements:
- Add support for saving analysis results to a file.
- Implement caching for frequently analyzed prompts.
- Extend the script to support additional LLM providers beyond OpenAI.

---

This README provides a comprehensive guide to using and understanding the prompt refinement script. For further assistance, refer to the inline documentation within the script or contact the maintainer.
