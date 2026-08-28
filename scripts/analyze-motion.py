from pathlib import Path

import cv2
import numpy as np


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/assets/motions/02-enter-forward.mp4"
OUTPUT = ROOT / "reference/audit-2026-08-27"


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    capture = cv2.VideoCapture(str(SOURCE))
    fps = capture.get(cv2.CAP_PROP_FPS)
    frame_count = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = frame_count / fps

    timestamps = np.arange(0, duration, 2.0)
    tiles = []
    for timestamp in timestamps:
        capture.set(cv2.CAP_PROP_POS_MSEC, timestamp * 1000)
        ok, frame = capture.read()
        if not ok:
            continue
        frame = cv2.resize(frame, (480, 270), interpolation=cv2.INTER_AREA)
        cv2.rectangle(frame, (0, 0), (125, 31), (0, 0, 0), -1)
        cv2.putText(frame, f"{timestamp:04.1f}s", (10, 23), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2)
        tiles.append(frame)

    cols = 4
    rows = (len(tiles) + cols - 1) // cols
    sheet = np.full((rows * 270, cols * 480, 3), 245, np.uint8)
    for index, tile in enumerate(tiles):
        row, col = divmod(index, cols)
        sheet[row * 270:(row + 1) * 270, col * 480:(col + 1) * 480] = tile
    cv2.imwrite(str(OUTPUT / "02-enter-forward-contact-sheet.jpg"), sheet, [cv2.IMWRITE_JPEG_QUALITY, 94])

    # A fine-grained strip around the historical 15-second unlock point.
    fine_tiles = []
    for timestamp in np.arange(10, 24.01, 0.5):
        capture.set(cv2.CAP_PROP_POS_MSEC, timestamp * 1000)
        ok, frame = capture.read()
        if not ok:
            continue
        frame = cv2.resize(frame, (384, 216), interpolation=cv2.INTER_AREA)
        cv2.rectangle(frame, (0, 0), (105, 27), (0, 0, 0), -1)
        cv2.putText(frame, f"{timestamp:04.1f}s", (8, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.56, (255, 255, 255), 2)
        fine_tiles.append(frame)
    cols = 5
    rows = (len(fine_tiles) + cols - 1) // cols
    fine_sheet = np.full((rows * 216, cols * 384, 3), 245, np.uint8)
    for index, tile in enumerate(fine_tiles):
        row, col = divmod(index, cols)
        fine_sheet[row * 216:(row + 1) * 216, col * 384:(col + 1) * 384] = tile
    cv2.imwrite(str(OUTPUT / "02-enter-forward-unlock-strip.jpg"), fine_sheet, [cv2.IMWRITE_JPEG_QUALITY, 95])

    capture.set(cv2.CAP_PROP_POS_FRAMES, 0)
    samples = []
    frame_index = 0
    while True:
        ok, frame = capture.read()
        if not ok:
            break
        if frame_index % 6 == 0:
            height, width = frame.shape[:2]
            region = frame[int(height * 0.48):, :int(width * 0.30)].astype(np.float32)
            blue = region[:, :, 0]
            green = region[:, :, 1]
            red = region[:, :, 2]
            dominance = np.maximum(0, blue - (red + green) / 2)
            samples.append((frame_index / fps, float(dominance.mean())))
        frame_index += 1
    ranked = sorted(samples, key=lambda item: item[1], reverse=True)[:16]
    print("strongest-left-blue=" + ", ".join(f"{time:.2f}s:{score:.2f}" for time, score in ranked))
    print("left-blue-window=" + ", ".join(
        f"{time:.2f}s:{score:.2f}" for time, score in samples if 7.5 <= time <= 16 and abs((time * 2) - round(time * 2)) < 0.01
    ))

    print(f"fps={fps:.3f} frames={frame_count} duration={duration:.3f}")


if __name__ == "__main__":
    main()
