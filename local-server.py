"""Small local server with byte-range support for the audiobook MP3s.

Python's basic development server serves a complete MP3 response, but browsers
need HTTP byte ranges to seek reliably through a large audio file. This keeps
the reader local while providing the range responses that the <audio> element
expects.
"""

from __future__ import annotations

import argparse
import os
import re
from pathlib import Path
from urllib.parse import unquote, urlsplit
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


RANGE_RE = re.compile(r"^bytes=(\d*)-(\d*)$")


class RangeRequestHandler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    audio_directory = None

    def translate_path(self, path):
        route = unquote(urlsplit(path).path)
        if self.audio_directory and route.startswith('/LOTR-Audiobook/'):
            root = Path(self.audio_directory).resolve()
            candidate = (root / route[len('/LOTR-Audiobook/'):]).resolve()
            if not candidate.is_relative_to(root):
                return str(root / '__invalid_path__')
            return str(candidate)
        return super().translate_path(path)

    def send_head(self):  # noqa: N802 - required by the stdlib handler API
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()

        try:
            size = os.path.getsize(path)
            file_handle = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        start = 0
        end = size - 1
        status = 200
        range_header = self.headers.get("Range")

        if range_header:
            match = RANGE_RE.match(range_header.strip())
            if not match or "," in range_header:
                file_handle.close()
                self.send_error(416, "Invalid range")
                return None

            start_text, end_text = match.groups()
            if not start_text and not end_text:
                file_handle.close()
                self.send_error(416, "Invalid range")
                return None

            if start_text:
                start = int(start_text)
                if start >= size:
                    file_handle.close()
                    self.send_response(416)
                    self.send_header("Content-Range", f"bytes */{size}")
                    self.send_header("Content-Length", "0")
                    self.end_headers()
                    return None
                if end_text:
                    end = min(int(end_text), size - 1)
            else:
                suffix_length = min(int(end_text), size)
                start = size - suffix_length

            status = 206

        length = max(0, end - start + 1)
        file_handle.seek(start)
        self.send_response(status)
        self.send_header("Content-type", self.guess_type(path))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Length", str(length))
        if status == 206:
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Last-Modified", self.date_time_string(os.path.getmtime(path)))
        self.end_headers()
        self.range_start = start
        self.range_length = length
        return file_handle

    def copyfile(self, source, outputfile):  # noqa: N802 - stdlib handler API
        remaining = getattr(self, "range_length", None)
        if remaining is None:
            return super().copyfile(source, outputfile)

        try:
            while remaining > 0:
                chunk = source.read(min(1024 * 1024, remaining))
                if not chunk:
                    break
                outputfile.write(chunk)
                remaining -= len(chunk)
        except (BrokenPipeError, ConnectionResetError):
            # Browsers commonly cancel an in-flight range request when the
            # user seeks again. That is normal playback behavior.
            pass
        finally:
            source.close()


def main():
    parser = argparse.ArgumentParser(description="Local range-capable reader server")
    parser.add_argument("--directory", default=str(Path(__file__).resolve().parent))
    parser.add_argument("--audio-directory", help="Folder containing Part1, Part2 and Part3 MP3s")
    parser.add_argument("--port", type=int, default=8765)
    args = parser.parse_args()
    RangeRequestHandler.audio_directory = args.audio_directory

    handler = lambda *handler_args, **handler_kwargs: RangeRequestHandler(  # noqa: E731
        *handler_args, directory=args.directory, **handler_kwargs
    )
    server = ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    print(f"Serving {os.path.abspath(args.directory)} at http://127.0.0.1:{args.port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
