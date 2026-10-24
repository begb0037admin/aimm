import json
import plistlib
from pathlib import Path
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
SCANNER = ROOT / ".build" / "debug" / "aimm-scan"


class ScannerIntegrationTests(unittest.TestCase):
    def make_bundle(self, root, relative, metadata):
        bundle = root / relative
        contents = bundle / "Contents"
        contents.mkdir(parents=True)
        with (contents / "Info.plist").open("wb") as stream:
            plistlib.dump(metadata, stream)
        return bundle

    def test_formats_metadata_aax_exclusion_and_symlinks(self):
        with tempfile.TemporaryDirectory(prefix="aimm-scanner-test-") as temp:
            root = Path(temp)
            synth = self.make_bundle(root, "Components/Synth.component", {
                "CFBundleIdentifier": "com.example.synth",
                "CFBundleDisplayName": "Synth",
                "CFBundleShortVersionString": "2.1",
            })
            self.make_bundle(root, "VST/Compressor.vst", {
                "CFBundleName": "Compressor", "CFBundleVersion": "9"
            })
            self.make_bundle(root, "VST3/Delay.vst3", {
                "CFBundleName": "Delay", "CFBundleVersion": "1.4"
            })
            clap = root / "CLAP" / "Noise.clap"
            clap.parent.mkdir()
            clap.write_bytes(b"not executable plug-in metadata")
            (root / "AAX" / "Excluded.aaxplugin").mkdir(parents=True)
            (root / "AAX" / "Excluded.aaxplugin" / "payload.bin").write_bytes(b"ignore")
            alias = root / "Aliases" / "Alias.component"
            alias.parent.mkdir()
            alias.symlink_to(synth, target_is_directory=True)

            result = subprocess.run(
                [str(SCANNER), "--root", str(root), "--root", str(root / "Components")],
                check=True, capture_output=True, text=True
            )
            records = json.loads(result.stdout)
            self.assertEqual(len(records), 4)
            by_format = {record["format"]: record for record in records}
            self.assertEqual(set(by_format), {"AU", "VST2", "VST3", "CLAP"})
            self.assertEqual(by_format["AU"]["name"], "Synth")
            self.assertEqual(by_format["AU"]["bundleIdentifier"], "com.example.synth")
            self.assertEqual(by_format["AU"]["version"], "2.1")
            self.assertEqual(by_format["AU"]["metadataSource"], "infoPlist")
            self.assertEqual(by_format["CLAP"]["name"], "Noise")
            self.assertEqual(by_format["CLAP"]["metadataSource"], "filenameOnly")
            self.assertFalse(any("/AAX/" in record["localPath"] for record in records))
            self.assertEqual(sum(record["localPath"] == str(synth) for record in records), 1)

    def test_does_not_descend_into_found_bundles(self):
        with tempfile.TemporaryDirectory(prefix="aimm-scanner-test-") as temp:
            root = Path(temp)
            outer = self.make_bundle(root, "Outer.vst3", {"CFBundleName": "Outer"})
            self.make_bundle(outer, "Contents/PlugIns/Nested.component", {"CFBundleName": "Nested"})
            result = subprocess.run(
                [str(SCANNER), "--root", str(root)],
                check=True, capture_output=True, text=True
            )
            self.assertEqual([item["name"] for item in json.loads(result.stdout)], ["Outer"])

    def test_requires_explicit_roots_and_validates_directories(self):
        empty = subprocess.run([str(SCANNER)], capture_output=True, text=True)
        self.assertEqual(empty.returncode, 2)
        with tempfile.TemporaryDirectory(prefix="aimm-scanner-test-") as temp:
            file = Path(temp) / "file"
            file.write_text("x")
            invalid = subprocess.run(
                [str(SCANNER), "--root", str(file)],
                capture_output=True, text=True
            )
            self.assertEqual(invalid.returncode, 1)


if __name__ == "__main__":
    unittest.main()
