from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
REFERENCE = Path(r"C:\Users\BF3EC~1.MOH\AppData\Local\Temp\codex-clipboard-970bd147-49ff-478d-a5c7-cbfb4439f918.png")
IMPLEMENTATION = ROOT / "reference" / "second-monitor-catalog.png"
OUTPUT = ROOT / "reference" / "catalog-monitor-qa-comparison.png"

panel_size = (1024, 576)
label_height = 44
canvas = Image.new("RGB", (panel_size[0] * 2, panel_size[1] + label_height), "white")
draw = ImageDraw.Draw(canvas)
font = ImageFont.load_default(size=22)

for index, (path, label) in enumerate(((REFERENCE, "SOURCE REFERENCE"), (IMPLEMENTATION, "IMPLEMENTATION"))):
    with Image.open(path).convert("RGB") as source:
        panel = ImageOps.fit(source, panel_size, method=Image.Resampling.LANCZOS)
    x = index * panel_size[0]
    canvas.paste(panel, (x, label_height))
    draw.text((x + 18, 10), label, fill=(14, 14, 20), font=font)

canvas.save(OUTPUT, optimize=True)
