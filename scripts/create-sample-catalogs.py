from pathlib import Path

from PIL import Image
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
COVERS = ROOT / "public" / "assets" / "catalogs" / "covers"
CATALOGS = COVERS.parent


def create_catalog(cover: Path) -> None:
    with Image.open(cover) as image:
        width, height = image.size
    output = CATALOGS / f"{cover.stem}.pdf"
    document = canvas.Canvas(str(output), pagesize=(width, height))
    document.drawImage(ImageReader(str(cover)), 0, 0, width=width, height=height)
    document.showPage()
    document.save()


for cover_path in sorted(COVERS.glob("*.png")):
    create_catalog(cover_path)
