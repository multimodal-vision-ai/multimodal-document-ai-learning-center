"""Stage the pinned Our Solution assets from the complete release archive."""

import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
import zipfile


ROOT = Path(__file__).resolve().parents[2]
MANIFEST = Path(__file__).with_name("our_solution_release.json")
APP = ROOT / "docs/assets/projects/video-action/browser-inference"
CACHE = ROOT / ".test-work/our-solution-release"


def unique_object(pairs):
    result = {}
    for name, value in pairs:
        if name in result:
            raise ValueError("Duplicate manifest key: " + name)
        result[name] = value
    return result


def checked_sha(value, label):
    if not isinstance(value, str) or not re.fullmatch(r"[a-fA-F0-9]{64}", value):
        raise ValueError("Invalid SHA256 for " + label)
    return value.lower()


def load_manifest():
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"), object_pairs_hook=unique_object)
    if not isinstance(manifest, dict):
        raise ValueError("Release manifest must be an object")
    archive_sha = checked_sha(manifest.get("archive_sha256"), "archive")
    url = manifest.get("url")
    if not isinstance(url, str):
        raise ValueError("Release archive URL is missing")
    parsed = urllib.parse.urlsplit(url)
    if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password:
        raise ValueError("Release archive must use a public HTTPS URL")
    files = manifest.get("files")
    if not isinstance(files, dict) or not files:
        raise ValueError("Release asset whitelist is empty")
    checked = {}
    destinations = set()
    for name, spec in files.items():
        path = PurePosixPath(name)
        if (
            not name.startswith("our-solution-assets/")
            or path.as_posix() != name
            or path.is_absolute()
            or any(part in (".", "..") for part in path.parts)
            or "\\" in name
            or ":" in name
            or "\x00" in name
            or name.endswith("/")
        ):
            raise ValueError("Invalid asset path: " + name)
        if name.casefold() in destinations:
            raise ValueError("Duplicate asset destination: " + name)
        destinations.add(name.casefold())
        if not isinstance(spec, dict):
            raise ValueError("Invalid asset specification: " + name)
        size = spec.get("bytes")
        if type(size) is not int or size < 0:
            raise ValueError("Invalid asset size: " + name)
        checked[name] = {"sha256": checked_sha(spec.get("sha256"), name), "bytes": size}
    return url, archive_sha, checked


def file_sha(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def download_archive(url, expected_sha):
    CACHE.mkdir(parents=True, exist_ok=True)
    cached = CACHE / (expected_sha + ".zip")
    if cached.is_file() and file_sha(cached) == expected_sha:
        return cached
    request = urllib.request.Request(url, headers={"User-Agent": "MVAI-Our-Solution-Release"})
    for attempt in range(3):
        temporary = None
        try:
            with tempfile.NamedTemporaryFile(dir=CACHE, prefix="download-", suffix=".tmp", delete=False) as stream:
                temporary = Path(stream.name)
                digest = hashlib.sha256()
                with urllib.request.urlopen(request, timeout=60) as response:
                    while chunk := response.read(1024 * 1024):
                        stream.write(chunk)
                        digest.update(chunk)
                stream.flush()
                os.fsync(stream.fileno())
            if digest.hexdigest() != expected_sha:
                raise ValueError("Release archive SHA256 mismatch")
            os.replace(temporary, cached)
            return cached
        except (OSError, urllib.error.URLError):
            if attempt == 2:
                raise
            time.sleep(2 * (attempt + 1))
        finally:
            if temporary is not None:
                temporary.unlink(missing_ok=True)
    raise RuntimeError("Release archive download did not complete")


def verified_assets(archive_path, expected_sha, files):
    app = APP.resolve()
    assets = []
    with archive_path.open("rb") as stream:
        if hashlib.file_digest(stream, "sha256").hexdigest() != expected_sha:
            raise ValueError("Release archive SHA256 mismatch")
        stream.seek(0)
        with zipfile.ZipFile(stream) as archive:
            members = {}
            names = set()
            for item in archive.infolist():
                normalized = item.filename.casefold()
                if normalized in names:
                    raise ValueError("Duplicate archive member: " + item.filename)
                names.add(normalized)
                members[item.filename] = item
            for name, spec in files.items():
                item = members.get(name)
                if item is None or item.is_dir():
                    raise ValueError("Release asset missing: " + name)
                if item.file_size != spec["bytes"]:
                    raise ValueError("Release asset size mismatch: " + name)
                data = archive.read(item)
                if len(data) != spec["bytes"] or hashlib.sha256(data).hexdigest() != spec["sha256"]:
                    raise ValueError("Release asset SHA256 mismatch: " + name)
                destination = (app / name).resolve()
                if not destination.is_relative_to(app):
                    raise ValueError("Asset destination escapes the application: " + name)
                assets.append((destination, data))
    return assets


def stage_assets(assets):
    # All members are verified before changing any application file. An interrupted
    # run leaves only complete verified replacements and can safely be retried.
    for destination, data in assets:
        destination.parent.mkdir(parents=True, exist_ok=True)
        temporary = None
        try:
            with tempfile.NamedTemporaryFile(
                dir=destination.parent, prefix="." + destination.name + "-", suffix=".tmp", delete=False
            ) as stream:
                temporary = Path(stream.name)
                stream.write(data)
                stream.flush()
                os.fsync(stream.fileno())
            os.replace(temporary, destination)
        finally:
            if temporary is not None:
                temporary.unlink(missing_ok=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--archive", type=Path, help="Use a local release ZIP instead of downloading it")
    args = parser.parse_args()
    try:
        url, archive_sha, files = load_manifest()
        archive_path = args.archive if args.archive is not None else download_archive(url, archive_sha)
        assets = verified_assets(archive_path, archive_sha, files)
        stage_assets(assets)
    except (OSError, ValueError, zipfile.BadZipFile, RuntimeError) as error:
        parser.exit(1, "Our Solution asset staging failed: " + str(error) + "\n")
    print("Staged " + str(len(assets)) + " SHA256-verified Our Solution assets")


if __name__ == "__main__":
    main()
