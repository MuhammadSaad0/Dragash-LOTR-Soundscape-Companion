"""Build private reader data from locally owned SRTs; Python 3.10+, no dependencies."""
import argparse
import json
import re
from pathlib import Path


def seconds(value):
    h, m, s = value.replace(',', '.').split(':')
    return int(h) * 3600 + int(m) * 60 + float(s)


def cues_from_srt(path):
    text = path.read_text(encoding='utf-8-sig').replace('\r\n', '\n')
    pattern = r'(\d{2}:\d{2}:\d{2}[,.]\d+)\s*-->\s*(\d{2}:\d{2}:\d{2}[,.]\d+)[^\n]*\n(.*?)(?=\n\s*\n|\Z)'
    cues = [{'start': seconds(a), 'end': seconds(b), 'text': ' '.join(t.split())}
            for a, b, t in re.findall(pattern, text, flags=re.S)]
    if not cues:
        raise ValueError(f'No timed captions in {path}')
    return sorted(cues, key=lambda c: c['start'])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('transcripts', type=Path, help='Folder with Part1, Part2, Part3 SRTs or chapter subfolders')
    parser.add_argument('--output', type=Path, default=Path(__file__).parent / 'transcript-data.js')
    args = parser.parse_args()
    chapters = json.loads((Path(__file__).parent / 'chapter-catalog.json').read_text(encoding='utf-8'))
    for chapter in chapters:
        folder = args.transcripts / chapter['audioDir']
        prefix = f"{chapter['number']:02d} - "
        matches = [p for p in folder.rglob('*.srt')
                   if p.name.startswith(prefix) or p.parent.name.startswith(prefix)]
        if len(matches) != 1:
            raise ValueError(f"Expected one SRT for {chapter['audioDir']}/{prefix}; found {len(matches)}")
        chapter['cues'] = cues_from_srt(matches[0])
    # This file contains private copyrighted text and is excluded by .gitignore.
    args.output.write_text('window.POC_CHAPTERS = '+json.dumps(chapters, ensure_ascii=False)+';\n', encoding='utf-8')
    print(f'Imported {len(chapters)} chapters to {args.output}')


if __name__ == '__main__':
    main()
