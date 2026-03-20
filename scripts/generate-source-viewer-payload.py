"""
Scan repository (excluding gitpagedocs/) and embed text files into source-viewer.html.
Run from repo root: python scripts/generate-source-viewer-payload.py
"""
from __future__ import annotations

import json
import os
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
EXCLUDE_DIRS = {
    "gitpagedocs",
    ".git",
    "node_modules",
    ".next",
    "dist",
    "coverage",
    ".turbo",
    "build",
    ".cursor",
    ".idea",
}
EXCLUDE_FILE_NAMES = {".env", ".env.local", ".env.production"}
SKIP_SUFFIXES = (
    ".pdf",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".ico",
    ".woff",
    ".woff2",
    ".ttf",
    ".eot",
    ".zip",
    ".tar",
    ".gz",
    ".7z",
    ".rar",
    ".exe",
    ".dll",
    ".so",
    ".dylib",
)
MAX_FILE_BYTES = 400_000
TRUNCATE_MSG = "\n\n/* --- [truncated: file exceeded max size in source viewer] --- */\n"

TEXT_EXTENSIONS = {
    "",
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
    ".json",
    ".md",
    ".yml",
    ".yaml",
    ".css",
    ".scss",
    ".html",
    ".htm",
    ".svg",
    ".prisma",
    ".sql",
    ".sh",
    ".bash",
    ".txt",
    ".env",
    ".example",
    ".gitignore",
    ".dockerignore",
    ".editorconfig",
    ".prettierrc",
    ".eslintrc",
    ".properties",
}


def should_skip_dir(name: str) -> bool:
    # Only skip known heavy/vendor dirs — do not skip all dot-dirs (keeps .github, etc.)
    return name in EXCLUDE_DIRS


def should_skip_path(rel: Path) -> bool:
    parts = rel.parts
    if "gitpagedocs" in parts:
        return True
    for p in parts:
        if should_skip_dir(p) and p != ".":
            return True
    return False


def is_probably_text(rel: Path) -> bool:
    name = rel.name
    if name in EXCLUDE_FILE_NAMES:
        return False
    suf = rel.suffix.lower()
    if name == "Dockerfile" or name.startswith("Dockerfile"):
        return True
    if name in ("LICENSE", "Makefile", "Makefile.in"):
        return True
    if suf in SKIP_SUFFIXES:
        return False
    if suf in TEXT_EXTENSIONS or suf == "":
        return True
    # unknown extension: try read as utf-8
    return True


def collect_files() -> dict[str, str]:
    files: dict[str, str] = {}
    for dirpath, dirnames, filenames in os.walk(REPO_ROOT):
        # prune dirs in-place
        dirnames[:] = [d for d in dirnames if not should_skip_dir(d)]
        rel_dir = Path(dirpath).relative_to(REPO_ROOT)
        if should_skip_path(rel_dir):
            continue
        for fn in filenames:
            full = Path(dirpath) / fn
            rel = full.relative_to(REPO_ROOT)
            if should_skip_path(rel):
                continue
            if not is_probably_text(rel):
                continue
            try:
                size = full.stat().st_size
            except OSError:
                continue
            if size > MAX_FILE_BYTES * 2:
                files[str(rel).replace("\\", "/")] = (
                    f"/* File too large ({size} bytes), omitted from embedded viewer */\n"
                )
                continue
            try:
                raw = full.read_bytes()
            except OSError:
                continue
            if b"\x00" in raw[:8192] and len(raw) > 0:
                continue
            try:
                text = raw.decode("utf-8")
            except UnicodeDecodeError:
                try:
                    text = raw.decode("latin-1")
                except Exception:
                    continue
            if len(text.encode("utf-8")) > MAX_FILE_BYTES:
                text = text.encode("utf-8")[:MAX_FILE_BYTES].decode("utf-8", errors="ignore") + TRUNCATE_MSG
            files[str(rel).replace("\\", "/")] = text
    return files


def build_payload() -> str:
    files = collect_files()
    data = {"files": files, "fileKeys": sorted(files.keys())}
    return json.dumps(data, ensure_ascii=False)


def patch_html(path: Path, json_payload: str) -> None:
    """
    Embed JSON in <template id="filesData">. Do not use regex on <script>…</script>:
    embedded file contents may contain the literal substring </script>, which would
    truncate the match and corrupt the HTML.
    """
    text = path.read_text(encoding="utf-8")
    new_block = f'<template id="filesData">{json_payload}</template>'
    start_tmpl = '<template id="filesData">'
    start_script = '<script type="application/json" id="filesData">'

    if start_tmpl in text:
        i = text.find(start_tmpl)
        content_start = i + len(start_tmpl)
        decoder = json.JSONDecoder()
        try:
            _obj, json_end = decoder.raw_decode(text, content_start)
        except json.JSONDecodeError as e:
            raise SystemExit(f"Could not parse template filesData JSON in {path}: {e}") from e
        k = json_end
        while k < len(text) and text[k] in " \t\n\r":
            k += 1
        close_tmpl = "</template>"
        if not text[k:].startswith(close_tmpl):
            raise SystemExit(f"Expected {close_tmpl!r} after JSON in {path}")
        text = text[:i] + new_block + text[k + len(close_tmpl) :]
    elif start_script in text:
        i = text.find(start_script)
        content_start = i + len(start_script)
        decoder = json.JSONDecoder()
        try:
            _obj, json_end = decoder.raw_decode(text, content_start)
        except json.JSONDecodeError as e:
            raise SystemExit(f"Could not parse existing filesData JSON in {path}: {e}") from e
        k = json_end
        while k < len(text) and text[k] in " \t\n\r":
            k += 1
        close = "</script>"
        if not text[k:].startswith(close):
            raise SystemExit(f"Expected {close!r} after JSON in {path}")
        text = text[:i] + new_block + text[k + len(close) :]
    else:
        raise SystemExit(f"Could not find filesData block in {path}")

    text = text.replace(
        "var files=data.files||{}, keys=data.fileKeys||[], treeData=data.tree||{};",
        "var files=data.files||{}, keys=data.fileKeys||Object.keys(files).sort(), treeData=data.tree||{};",
    )
    path.write_text(text, encoding="utf-8")


def main() -> None:
    payload = build_payload()
    for lang in ("en", "pt", "es"):
        html = (
            REPO_ROOT
            / "gitpagedocs"
            / "docs"
            / "versions"
            / "1.0.0"
            / lang
            / "source-viewer.html"
        )
        if html.exists():
            patch_html(html, payload)
            print("Patched", html, "payload chars:", len(payload))
        else:
            print("Missing", html)


if __name__ == "__main__":
    main()
