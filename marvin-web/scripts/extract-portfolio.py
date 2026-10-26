"""Extract the six supplied photos without screenshotting or upscaling them."""
import argparse
import hashlib
import json
from pathlib import Path

from PIL import ImageOps
from pypdf import PdfReader

parser = argparse.ArgumentParser()
parser.add_argument("pdf", type=Path)
args = parser.parse_args()
project = Path(__file__).resolve().parents[1]
output = project.parent / "output" / "pdf" / "ape-photos"
runtime = project / "public" / "portfolio"
output.mkdir(parents=True, exist_ok=True)
runtime.mkdir(parents=True, exist_ok=True)
reader = PdfReader(args.pdf)
manifest = {"source": args.pdf.name, "sha256": hashlib.sha256(args.pdf.read_bytes()).hexdigest(), "photos": []}
for index, page in enumerate(reader.pages, 1):
    if len(page.images) != 1:
        raise ValueError(f"Page {index} must contain exactly one photo; inspect it before extracting.")
    original = page.images[0]
    photo = ImageOps.exif_transpose(original.image).convert("RGB")
    name = f"ape-portrait-{index}"
    photo.save(output / f"{name}.png", optimize=True)
    photo.save(runtime / f"{name}.webp", format="WEBP", lossless=True, method=6)
    manifest["photos"].append({"page": index, "src": f"portfolio/{name}.webp",
        "width": photo.width, "height": photo.height})
(output / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
print(json.dumps(manifest, indent=2))
