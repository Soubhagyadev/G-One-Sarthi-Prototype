"""Small Gemini API smoke test for local development."""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


DEFAULT_MODEL = "gemini-3.5-flash-lite"


def load_dotenv_file(path: Path = Path(".env")) -> None:
    """Load simple KEY=VALUE entries without printing or exposing secrets."""
    if not path.is_file():
        return

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        name, value = line.split("=", 1)
        name = name.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(name, value)


def test_gemini(model: str = DEFAULT_MODEL) -> str:
    """Send a minimal prompt and return Gemini's text response.

    Raises RuntimeError with a safe diagnostic if the request cannot succeed.
    """
    load_dotenv_file()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not set in the environment or .env")

    endpoint = (
        f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
        f"?key={api_key}"
    )
    payload = {
        "contents": [{"parts": [{"text": "Reply with exactly: Gemini API is responding."}]}]
    }
    request = Request(
        endpoint,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urlopen(request, timeout=30) as response:
            body = json.loads(response.read().decode("utf-8"))
    except HTTPError as error:
        raise RuntimeError(
            f"Gemini request failed with HTTP {error.code}. Check the model name and API key."
        ) from error
    except URLError as error:
        raise RuntimeError(f"Could not reach Gemini: {error.reason}") from error

    try:
        return body["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError, TypeError) as error:
        raise RuntimeError("Gemini returned an unexpected response shape.") from error


if __name__ == "__main__":
    selected_model = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_MODEL
    try:
        print(test_gemini(selected_model))
    except RuntimeError as error:
        print(f"Gemini test failed: {error}", file=sys.stderr)
        raise SystemExit(1) from error