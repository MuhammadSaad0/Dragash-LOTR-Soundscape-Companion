"""Link downloaded audiobook chapters into the reader's local media library.

Only catalogued MP3 names are imported. ZIP members are streamed to a temporary
file, never extracted by their path; incomplete files never become audio tracks.
"""
import argparse
import json
import os
import shutil
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', nargs='?', type=Path, default=Path.home() / 'Downloads')
    parser.add_argument('--destination', type=Path, default=Path.home() / 'Documents' / 'LOTR-Audiobook')
    args = parser.parse_args()
    catalog = json.loads((ROOT / 'chapter-catalog.json').read_text(encoding='utf-8'))
    wanted = {entry['audio']: entry for entry in catalog}
    imported = []

    def target_for(name):
        entry = wanted[name]
        target = args.destination / entry['audioDir'] / name
        target.parent.mkdir(parents=True, exist_ok=True)
        return target

    # Existing library files are never replaced. Downloads remain untouched.
    for source in sorted(args.source.rglob('*.mp3')):
        if source.name not in wanted or source.stat().st_size == 0:
            continue
        target = target_for(source.name)
        if target.exists():
            continue
        try:
            os.link(source, target)
        except OSError:
            temporary = target.with_suffix('.importing')
            shutil.copyfile(source, temporary)
            temporary.replace(target)
        imported.append(source.name)

    for source in sorted(args.source.glob('Part[123]*.zip')):
        try:
            with zipfile.ZipFile(source) as archive:
                for member in archive.infolist():
                    name = member.filename.replace('\\', '/').rsplit('/', 1)[-1]
                    if name not in wanted or not member.file_size:
                        continue
                    target = target_for(name)
                    if target.exists():
                        continue
                    temporary = target.with_suffix('.importing')
                    try:
                        with archive.open(member) as incoming, temporary.open('wb') as outgoing:
                            shutil.copyfileobj(incoming, outgoing)
                        temporary.replace(target)
                        imported.append(name)
                    finally:
                        temporary.unlink(missing_ok=True)
        except (zipfile.BadZipFile, OSError) as error:
            print(f'Skipped {source.name}: {error}')

    missing = [entry for entry in catalog if not (args.destination / entry['audioDir'] / entry['audio']).is_file()]
    print(f'Imported {len(imported)} tracks; {len(catalog)-len(missing)}/{len(catalog)} available in {args.destination}')
    for entry in missing:
        print(f"Missing {entry['audioDir']}: {entry['audio']}")


if __name__ == '__main__':
    main()
