import functools
import importlib.util
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from http.server import ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def module(name):
    spec = importlib.util.spec_from_file_location(name.replace('-', '_'), ROOT / (name + '.py'))
    value = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(value)
    return value


class LocalReaderTests(unittest.TestCase):
    def test_speaker_metadata_is_not_reading_text(self):
        importer = module('import-transcripts')
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / 'voices.srt'
            path.write_text('1\n00:00:00,900 --> 00:00:03,320\n[SPEAKER_0] A voice speaks.\n[SPEAKER_12] Another answers.\n\n2\n00:00:04,000 --> 00:00:05,500\n[music] The word speaker stays.\n', encoding='utf-8')
            self.assertEqual(importer.cues_from_srt(path), [
                {'start': 0.9, 'end': 3.32, 'text': 'A voice speaks. Another answers.'},
                {'start': 4.0, 'end': 5.5, 'text': '[music] The word speaker stays.'},
            ])

    def test_srt(self):
        importer = module('import-transcripts')
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / 'test.srt'
            path.write_text('1\n00:00:01,250 --> 00:00:03,000\nAn original\nexample sentence.\n\n2\n00:00:04,000 --> 00:00:05,000\nAnother sentence.\n', encoding='utf-8')
            cues = importer.cues_from_srt(path)
            self.assertEqual(len(cues), 2)
            self.assertEqual(cues[0]['start'], 1.25)
            self.assertEqual(cues[0]['text'], 'An original example sentence.')

    def test_audio_ranges_and_traversal(self):
        server_module = module('local-server')
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            audio = root / 'audio'
            audio.mkdir()
            (audio / 'sample.mp3').write_bytes(b'0123456789')
            (root / 'private.txt').write_text('must not escape audio mount')
            site = root / 'site'
            site.mkdir()
            server_module.RangeRequestHandler.audio_directory = str(audio)
            handler = functools.partial(server_module.RangeRequestHandler, directory=str(site))
            server = ThreadingHTTPServer(('127.0.0.1', 0), handler)
            worker = threading.Thread(target=server.serve_forever, daemon=True)
            worker.start()
            try:
                base = f'http://127.0.0.1:{server.server_port}'
                request = urllib.request.Request(base+'/LOTR-Audiobook/sample.mp3', headers={'Range':'bytes=2-5'})
                with urllib.request.urlopen(request) as response:
                    self.assertEqual(response.status, 206)
                    self.assertEqual(response.headers['Content-Range'], 'bytes 2-5/10')
                    self.assertEqual(response.read(), b'2345')
                with self.assertRaises(urllib.error.HTTPError) as error:
                    urllib.request.urlopen(base+'/LOTR-Audiobook/%2e%2e/private.txt')
                self.assertEqual(error.exception.code, 404)
            finally:
                server.shutdown()
                server.server_close()
                worker.join()


if __name__ == '__main__':
    unittest.main()
