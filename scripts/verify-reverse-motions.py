from pathlib import Path

import cv2


ROOT = Path(__file__).resolve().parents[1] / "public/assets/motions"
PAIRS = [
    ("02-enter-forward.mp4", "02-enter-reverse.mp4"),
    ("04-city-to-monitor-forward.mp4", "04-city-to-monitor-reverse.mp4"),
    ("05-monitor-one-to-two-forward.mp4", "05-monitor-one-to-two-reverse.mp4"),
    ("06-monitor-two-to-three-forward.mp4", "06-monitor-two-to-three-reverse.mp4"),
    ("07-monitor-three-to-social-forward.mp4", "07-monitor-three-to-social-reverse.mp4"),
    ("08-social-to-outro-forward.mp4", "08-social-to-outro-reverse.mp4"),
]


def read_frame(capture, index):
    capture.set(cv2.CAP_PROP_POS_FRAMES, index)
    ok, frame = capture.read()
    if not ok:
        raise RuntimeError(f"Could not read frame {index}")
    return frame


for forward_name, reverse_name in PAIRS:
    forward = cv2.VideoCapture(str(ROOT / forward_name))
    reverse = cv2.VideoCapture(str(ROOT / reverse_name))
    forward_frames = int(forward.get(cv2.CAP_PROP_FRAME_COUNT))
    reverse_frames = int(reverse.get(cv2.CAP_PROP_FRAME_COUNT))
    forward_fps = forward.get(cv2.CAP_PROP_FPS)
    reverse_fps = reverse.get(cv2.CAP_PROP_FPS)
    start_psnr = cv2.PSNR(read_frame(forward, forward_frames - 1), read_frame(reverse, 0))
    end_psnr = cv2.PSNR(read_frame(forward, 0), read_frame(reverse, reverse_frames - 1))
    assert forward_frames == reverse_frames, (forward_name, forward_frames, reverse_frames)
    assert abs(forward_fps - reverse_fps) < 0.001, (forward_name, forward_fps, reverse_fps)
    assert min(start_psnr, end_psnr) >= 49.5, (forward_name, start_psnr, end_psnr)
    print(
        f"{forward_name}: frames={forward_frames}, fps={forward_fps:.3f}, "
        f"edge-psnr={start_psnr:.2f}/{end_psnr:.2f} dB"
    )
