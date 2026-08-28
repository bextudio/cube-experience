import { useCallback, useEffect, useRef, useState } from "react";
import { PageFlip } from "page-flip";
import {
  FiArrowDown,
  FiArrowUp,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiClock,
  FiBookOpen,
  FiFileText,
  FiExternalLink,
  FiLoader,
  FiMonitor,
  FiPause,
  FiPlay,
  FiRotateCcw,
  FiVolume2,
  FiVolumeX,
  FiX,
} from "react-icons/fi";
import { FaInstagram, FaLinkedinIn, FaTelegramPlane } from "react-icons/fa";
import catalogs from "virtual:catalogs";

const steps = [
  {
    id: "origin",
    number: "۰۱",
    label: "آغاز تجربه",
    title: "مکعب، نقطه‌ی شروع جهان ماست",
    description: "برای ورود به تجربه، به پایین اسکرول کنید.",
    idle: "/assets/motions/01-origin-loop.mp4",
    forward: "/assets/motions/02-enter-forward.mp4",
    reverse: null,
  },
  {
    id: "entrance",
    number: "۰۲",
    label: "ورود",
    title: "از سطح عبور کنید",
    description: "حرکت بعدی، شما را از بیرون مکعب به جهان درون آن می‌برد.",
    idle: "/assets/motions/03-city-loop.mp4",
    idleHandoff: "cut",
    forward: "/assets/motions/04-city-to-monitor-forward.mp4",
    reverse: "/assets/motions/02-enter-reverse.mp4",
  },
  {
    id: "intelligence",
    number: "۰۳",
    label: "روایت هوشمند",
    title: "روایت، شکل تازه‌ای می‌گیرد",
    description: "هر حرکت، فصل بعدی تجربه را آشکار می‌کند.",
    idle: null,
    forward: "/assets/motions/06-monitor-two-to-three-forward.mp4",
    reverse: "/assets/motions/04-city-to-monitor-reverse.mp4",
  },
  {
    id: "transmedia",
    number: "۰۴",
    label: "جهان بینارسانه‌ای",
    title: "یک جهان؛ چند نقطه‌ی تماس",
    description: "مسیر را با اسکرول ادامه دهید یا به فصل قبل بازگردید.",
    idle: null,
    forward: "/assets/motions/07-monitor-three-to-social-forward.mp4",
    reverse: "/assets/motions/06-monitor-two-to-three-reverse.mp4",
  },
  {
    id: "phygital",
    number: "۰۵",
    label: "تجربه‌ی فیجیتال",
    title: "واقعیت و دیجیتال به هم می‌رسند",
    description: "تعامل، مرز میان دو جهان را از میان برمی‌دارد.",
    idle: null,
    forward: "/assets/motions/08-social-to-outro-forward.mp4",
    reverse: "/assets/motions/07-monitor-three-to-social-reverse.mp4",
  },
  {
    id: "continuation",
    number: "۰۶",
    label: "ادامه‌ی تجربه",
    title: "این پایان مسیر نیست",
    description: "جهان بکستودیو را در وب‌سایت و اپلیکیشن ادامه دهید.",
    idle: null,
    forward: null,
    reverse: "/assets/motions/08-social-to-outro-reverse.mp4",
  },
];

const ENTRANCE_UNLOCK_TIME = 12.5;
const TV_POWER_ON_MS = 620;
const TV_POWER_OFF_MS = 500;

const socialLinks = [
  { label: "اینستاگرام", href: "https://www.instagram.com/bextudio/", icon: FaInstagram },
  { label: "لینکدین", href: "https://www.linkedin.com/company/bextudio/", icon: FaLinkedinIn },
  { label: "تلگرام", href: "https://t.me/bextudio", icon: FaTelegramPlane },
];

const experienceChannels = [
  { id: "ai", label: "AI Video Experience", eyebrow: "ویدیوی هوشمند", src: "/assets/monitors/ai-video.mp4" },
  { id: "transmedia", label: "Transmedia Campaign", eyebrow: "کمپین بینارسانه‌ای", src: "/assets/monitors/transmedia.mp4" },
  { id: "phygital", label: "Phygital Experience", eyebrow: "تجربه‌ی فیجیتال", src: "/assets/monitors/phygital.mp4" },
];

const monitorChapters = {
  4: {
    eyebrow: "تجربه‌ی فیجیتال",
    title: "مرز فیزیکی و دیجیتال محو می‌شود",
    description: "نمونه‌ی کامل تجربه‌ی فیجیتال، درون مانیتور تعاملی اجرا می‌شود.",
    type: "motion",
    items: [{ id: "phygital", label: "Phygital", src: "/assets/monitors/phygital.mp4" }],
  },
};

function waitForPlayable(video) {
  if (video.readyState >= 3) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      cleanup();
      reject(new Error("media-timeout"));
    }, 8000);
    const cleanup = () => {
      window.clearTimeout(timeoutId);
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("error", onError);
    };
    const onReady = () => { cleanup(); resolve(); };
    const onError = () => { cleanup(); reject(new Error("media-error")); };
    video.addEventListener("canplay", onReady, { once: true });
    video.addEventListener("error", onError, { once: true });
  });
}

function waitForPresentedFrame(video) {
  if (typeof video.requestVideoFrameCallback !== "function") {
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }
  return new Promise((resolve) => {
    const timeoutId = window.setTimeout(resolve, 700);
    video.requestVideoFrameCallback(() => {
      window.clearTimeout(timeoutId);
      resolve();
    });
  });
}

function seekTo(video, time) {
  const target = Math.min(Math.max(time, 0), Math.max(0, video.duration - 0.04));
  if (Math.abs(video.currentTime - target) < 0.04) return Promise.resolve();
  return new Promise((resolve) => {
    const timeoutId = window.setTimeout(resolve, 900);
    video.addEventListener("seeked", () => {
      window.clearTimeout(timeoutId);
      resolve();
    }, { once: true });
    video.currentTime = target;
  });
}

function CatalogReader({ catalog, muted, onClose }) {
  const [pageIndex, setPageIndex] = useState(0);
  const bookRef = useRef(null);
  const pageFlipRef = useRef(null);
  const soundRef = useRef(null);
  const mutedRef = useRef(muted);
  const hasPages = Boolean(catalog.pagesBase && catalog.pageCount);

  useEffect(() => { mutedRef.current = muted; }, [muted]);

  useEffect(() => {
    if (!hasPages || !bookRef.current) return undefined;
    const pageFlip = new PageFlip(bookRef.current, {
      width: 1280,
      height: 720,
      size: "stretch",
      minWidth: 280,
      maxWidth: 1280,
      minHeight: 158,
      maxHeight: 720,
      showCover: false,
      usePortrait: false,
      autoSize: true,
      drawShadow: true,
      maxShadowOpacity: 0.24,
      flippingTime: 880,
      showPageCorners: true,
      disableFlipByClick: true,
      useMouseEvents: true,
      swipeDistance: 18,
      mobileScrollSupport: false,
    });
    pageFlip.loadFromHTML(bookRef.current.querySelectorAll(".page-flip-page"));
    pageFlip.on("flip", (event) => {
      setPageIndex(event.data);
      if (mutedRef.current || !soundRef.current) return;
      soundRef.current.currentTime = 0;
      soundRef.current.volume = 0.025;
      soundRef.current.play().catch(() => undefined);
    });
    pageFlipRef.current = pageFlip;
    return () => {
      pageFlipRef.current = null;
      pageFlip.destroy();
    };
  }, [catalog.id, hasPages]);

  const visibleStart = Math.min(catalog.pageCount, pageIndex + 1);
  const visibleEnd = Math.min(catalog.pageCount, pageIndex + 2);

  return (
    <div className="catalog-reader">
      <header>
        <div><FiBookOpen aria-hidden="true" /><span>{catalog.title}</span><small>{hasPages ? `${visibleStart}–${visibleEnd} / ${catalog.pageCount}` : "PDF"}</small></div>
        <button type="button" onClick={onClose} aria-label="بازگشت به فهرست کاتالوگ‌ها"><FiX aria-hidden="true" /></button>
      </header>
      {hasPages ? (
        <div
          className="book-stage"
          dir="ltr"
          tabIndex="0"
          aria-label="ورق‌زدن کتاب از چپ به راست"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") pageFlipRef.current?.flipPrev();
            if (event.key === "ArrowRight") pageFlipRef.current?.flipNext();
          }}
        >
          <button className="book-turn previous" type="button" disabled={pageIndex <= 0} onClick={() => pageFlipRef.current?.flipPrev()} aria-label="دو صفحه قبل"><FiChevronLeft aria-hidden="true" /></button>
          <div className="book-paper-bed">
            <div ref={bookRef} className="page-flip-book" aria-label={`صفحات ${visibleStart} و ${visibleEnd}؛ گوشهٔ صفحه را بگیرید و بکشید`}>
              {Array.from({ length: catalog.pageCount }, (_, index) => (
                <div className="page-flip-page" data-density="soft" key={index + 1}>
                  <img src={`${catalog.pagesBase}/${index + 1}.jpg`} alt={`صفحه ${index + 1}`} loading={index < 4 ? "eager" : "lazy"} decoding="async" draggable="false" />
                </div>
              ))}
            </div>
          </div>
          <div className="book-gesture-hint" aria-hidden="true"><span />گوشهٔ صفحه را بگیرید و آرام بکشید</div>
          <button className="book-turn next" type="button" disabled={pageIndex >= catalog.pageCount - 2} onClick={() => pageFlipRef.current?.flipNext()} aria-label="دو صفحه بعد"><FiChevronRight aria-hidden="true" /></button>
          <audio ref={soundRef} src="/assets/audio/page-turn.mp3" preload="auto" />
        </div>
      ) : <iframe title={`کاتالوگ ${catalog.title}`} src={`${catalog.url}#view=FitH&toolbar=0&navpanes=0`} />}
    </div>
  );
}

export function App() {
  const [stepIndex, setStepIndex] = useState(0);
  const [frontSlot, setFrontSlot] = useState("a");
  const [outgoingSlot, setOutgoingSlot] = useState(null);
  const [hardCutSlot, setHardCutSlot] = useState(null);
  const [direction, setDirection] = useState("idle");
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [monitorOpen, setMonitorOpen] = useState(false);
  const [monitorSelection, setMonitorSelection] = useState(0);
  const [monitorPaused, setMonitorPaused] = useState(false);
  const [movementNotice, setMovementNotice] = useState(null);
  const [movementNoticeContext, setMovementNoticeContext] = useState("cycle");
  const [queueProgress, setQueueProgress] = useState(0);
  const [autoMonitorPhase, setAutoMonitorPhase] = useState("idle");
  const [secondaryMonitorPhase, setSecondaryMonitorPhase] = useState("off");
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [entranceForwardUnlocked, setEntranceForwardUnlocked] = useState(false);
  const videoARef = useRef(null);
  const videoBRef = useRef(null);
  const frontSlotRef = useRef("a");
  const transitionRef = useRef(null);
  const pendingNavigationRef = useRef(null);
  const postTransitionNavigationRef = useRef(null);
  const touchStartRef = useRef(null);
  const wheelAccumulatorRef = useRef(0);
  const wheelResetRef = useRef(null);
  const settleTimerRef = useRef(null);
  const noticeTimerRef = useRef(null);
  const monitorVideoRef = useRef(null);
  const firstMonitorVideoRef = useRef(null);
  const firstMonitorCompletedRef = useRef(false);
  const autoMonitorTimerRef = useRef(null);
  const secondaryMonitorTimerRef = useRef(null);
  const reverseSwapRef = useRef(false);
  const step = steps[stepIndex];
  const monitorChapter = monitorChapters[stepIndex] ?? null;
  const monitorItem = monitorChapter?.items[monitorSelection] ?? null;
  const isAutoMonitorBusy = stepIndex === 2 && ["powering", "powering-off", "catalog-powering", "catalog-powering-off", "transitioning"].includes(autoMonitorPhase);
  const isSecondaryMonitorBusy = [3, 4].includes(stepIndex) && secondaryMonitorPhase !== "active";
  const isTransitioning = direction !== "idle" || isAutoMonitorBusy || isSecondaryMonitorBusy;
  const renderedTransition = transitionRef.current;
  const isEntranceTransition = direction === "forward"
    && renderedTransition?.targetIndex === 1
    && renderedTransition?.movement === "forward";
  const canReverseActiveMotion = Boolean(
    direction === "forward"
    && renderedTransition?.movement === "forward"
    && (renderedTransition?.reverseSrc || steps[renderedTransition.targetIndex]?.reverse),
  );
  const canExitFirstMonitor = stepIndex === 2 && autoMonitorPhase === "playing";

  const getVideo = useCallback((slot) => slot === "a" ? videoARef.current : videoBRef.current, []);

  const setFront = useCallback((slot) => {
    frontSlotRef.current = slot;
    setFrontSlot(slot);
  }, []);

  const startClip = useCallback(async ({ src, reverseSrc = null, targetIndex, movement, loop = false }) => {
    if (transitionRef.current || !src) return;

    const outgoingSlot = frontSlotRef.current;
    const incomingSlot = outgoingSlot === "a" ? "b" : "a";
    const outgoingVideo = getVideo(outgoingSlot);
    const incomingVideo = getVideo(incomingSlot);
    if (!incomingVideo) return;

    transitionRef.current = { incomingSlot, outgoingSlot, targetIndex, movement, reverseSrc };
    setDirection(movement);
    setLoading(true);
    setPaused(false);

    incomingVideo.pause();
    incomingVideo.loop = loop;
    incomingVideo.muted = muted;
    if (incomingVideo.getAttribute("src") !== src) {
      incomingVideo.setAttribute("src", src);
      incomingVideo.load();
    }
    incomingVideo.currentTime = 0;

    if (movement === "forward" && (reverseSrc || steps[targetIndex]?.reverse)) {
      fetch(reverseSrc || steps[targetIndex].reverse, { cache: "force-cache" }).catch(() => undefined);
    }

    try {
      await waitForPlayable(incomingVideo);
      await incomingVideo.play();
      await waitForPresentedFrame(incomingVideo);
      setLoading(false);
      setOutgoingSlot(outgoingSlot);
      setFront(incomingSlot);
      settleTimerRef.current = window.setTimeout(() => {
        outgoingVideo?.pause();
        setOutgoingSlot(null);
        if (loop) {
          setStepIndex(targetIndex);
          transitionRef.current = null;
          setDirection("idle");
        }
      }, 460);
    } catch {
      transitionRef.current = null;
      setLoading(false);
      setDirection("idle");
      setMovementNotice(null);
    }
  }, [getVideo, muted, setFront]);

  const executeNavigation = useCallback((movement) => {
    if (movement === "forward" && stepIndex < steps.length - 1) {
      startClip({ src: steps[stepIndex].forward, targetIndex: stepIndex + 1, movement });
    }
    if (movement === "forward" && stepIndex === steps.length - 1) {
      startClip({ src: steps[0].idle, targetIndex: 0, movement, loop: true });
    }
    if (movement === "reverse" && stepIndex > 0) {
      startClip({ src: steps[stepIndex].reverse, targetIndex: stepIndex - 1, movement });
    }
  }, [startClip, stepIndex]);

  const exitFirstMonitor = useCallback((movement = "forward") => {
    if (autoMonitorPhase !== "playing" || transitionRef.current) return;
    firstMonitorVideoRef.current?.pause();
    setAutoMonitorPhase("powering-off");
    window.clearTimeout(autoMonitorTimerRef.current);
    autoMonitorTimerRef.current = window.setTimeout(() => {
      firstMonitorCompletedRef.current = movement === "forward";
      setAutoMonitorPhase("transitioning");
      startClip({
        src: movement === "forward" ? "/assets/motions/05-monitor-one-to-two-forward.mp4" : steps[2].reverse,
        reverseSrc: movement === "forward" ? "/assets/motions/05-monitor-one-to-two-reverse.mp4" : null,
        targetIndex: movement === "forward" ? 2 : 1,
        movement,
      });
    }, TV_POWER_OFF_MS);
  }, [autoMonitorPhase, startClip]);

  const handleFirstMonitorEnded = useCallback(() => {
    exitFirstMonitor("forward");
  }, [exitFirstMonitor]);

  const skipEntranceForward = useCallback(async (activeTransition) => {
    if (!activeTransition || transitionRef.current !== activeTransition) return;

    const transitionSlot = activeTransition.incomingSlot;
    const nextSlot = transitionSlot === "a" ? "b" : "a";
    const transitionVideo = getVideo(transitionSlot);
    const nextVideo = getVideo(nextSlot);
    if (!nextVideo) return;

    setLoading(true);
    nextVideo.pause();
    nextVideo.loop = false;
    nextVideo.muted = muted;
    if (nextVideo.getAttribute("src") !== steps[1].forward) {
      nextVideo.setAttribute("src", steps[1].forward);
      nextVideo.load();
    }
    nextVideo.currentTime = 0;

    try {
      await waitForPlayable(nextVideo);
      await nextVideo.play();
      await waitForPresentedFrame(nextVideo);
      if (transitionRef.current !== activeTransition) return;

      transitionRef.current = {
        incomingSlot: nextSlot,
        outgoingSlot: transitionSlot,
        targetIndex: 2,
        movement: "forward",
      };
      setOutgoingSlot(transitionSlot);
      setFront(nextSlot);
      setLoading(false);
      window.clearTimeout(noticeTimerRef.current);
      setMovementNotice(null);
      settleTimerRef.current = window.setTimeout(() => {
        transitionVideo?.pause();
        setOutgoingSlot(null);
      }, 460);
    } catch {
      setLoading(false);
      transitionVideo?.play().catch(() => undefined);
    }
  }, [getVideo, muted, setFront]);

  const reverseActiveTransition = useCallback(async (activeTransition) => {
    if (!activeTransition || activeTransition.movement !== "forward" || reverseSwapRef.current) return;
    const reverseSrc = activeTransition.reverseSrc || steps[activeTransition.targetIndex]?.reverse;
    if (!reverseSrc || activeTransition.targetIndex <= 0) return;

    reverseSwapRef.current = true;
    const forwardSlot = activeTransition.incomingSlot;
    const reverseSlot = forwardSlot === "a" ? "b" : "a";
    const forwardVideo = getVideo(forwardSlot);
    const reverseVideo = getVideo(reverseSlot);
    if (!forwardVideo || !reverseVideo) {
      reverseSwapRef.current = false;
      return;
    }

    const progress = forwardVideo.duration
      ? Math.min(1, Math.max(0, forwardVideo.currentTime / forwardVideo.duration))
      : 0;
    setLoading(true);
    setPaused(false);
    setEntranceForwardUnlocked(false);

    reverseVideo.pause();
    reverseVideo.loop = false;
    reverseVideo.muted = muted;
    if (reverseVideo.getAttribute("src") !== reverseSrc) {
      reverseVideo.setAttribute("src", reverseSrc);
      reverseVideo.load();
    }

    try {
      await waitForPlayable(reverseVideo);
      await seekTo(reverseVideo, reverseVideo.duration * (1 - progress));
      await reverseVideo.play();
      await waitForPresentedFrame(reverseVideo);
      if (transitionRef.current !== activeTransition) {
        setLoading(false);
        return;
      }

      transitionRef.current = {
        incomingSlot: reverseSlot,
        outgoingSlot: forwardSlot,
        targetIndex: activeTransition.targetIndex - 1,
        movement: "reverse",
      };
      pendingNavigationRef.current = null;
      postTransitionNavigationRef.current = null;
      setDirection("reverse");
      setOutgoingSlot(forwardSlot);
      setFront(reverseSlot);
      setLoading(false);
      setMovementNoticeContext("instant-reverse");
      setMovementNotice("started");
      window.clearTimeout(noticeTimerRef.current);
      noticeTimerRef.current = window.setTimeout(() => setMovementNotice(null), 1200);
      settleTimerRef.current = window.setTimeout(() => {
        forwardVideo.pause();
        setOutgoingSlot(null);
      }, 360);
    } catch {
      setLoading(false);
    } finally {
      reverseSwapRef.current = false;
    }
  }, [getVideo, muted, setFront]);

  const navigate = useCallback((movement) => {
    const activeVideo = getVideo(frontSlotRef.current);
    const activeTransition = transitionRef.current;
    if (stepIndex === 2 && autoMonitorPhase === "playing" && !activeTransition) {
      exitFirstMonitor(movement);
      return;
    }
    if (stepIndex === 2 && autoMonitorPhase === "catalog" && !activeTransition) {
      setAutoMonitorPhase("catalog-powering-off");
      window.clearTimeout(autoMonitorTimerRef.current);
      autoMonitorTimerRef.current = window.setTimeout(() => {
        setAutoMonitorPhase("transitioning");
        executeNavigation(movement);
      }, TV_POWER_OFF_MS);
      return;
    }
    if ([3, 4].includes(stepIndex) && secondaryMonitorPhase === "active" && !activeTransition) {
      setSecondaryMonitorPhase("powering-off");
      window.clearTimeout(secondaryMonitorTimerRef.current);
      secondaryMonitorTimerRef.current = window.setTimeout(() => executeNavigation(movement), TV_POWER_OFF_MS);
      return;
    }
    if (monitorOpen || selectedCatalog || isAutoMonitorBusy || isSecondaryMonitorBusy) return;

    if (activeTransition) {
      if (movement === "reverse" && activeTransition.movement === "forward") {
        reverseActiveTransition(activeTransition);
        return;
      }
      const isFullEntrance = activeTransition.targetIndex === 1
        && activeTransition.movement === "forward"
        && activeVideo?.getAttribute("src") === steps[0].forward;

      if (!isFullEntrance || movement !== "forward") return;

      window.clearTimeout(noticeTimerRef.current);
      if (activeVideo.currentTime < ENTRANCE_UNLOCK_TIME) {
        setMovementNoticeContext("unlock");
        setMovementNotice("locked");
        setQueueProgress(Math.min(activeVideo.currentTime / ENTRANCE_UNLOCK_TIME, 1));
        noticeTimerRef.current = window.setTimeout(() => setMovementNotice(null), 1800);
        return;
      }

      skipEntranceForward(activeTransition);
      return;
    }

    if (pendingNavigationRef.current) return;

    if (stepIndex === 1 && activeVideo?.loop) {
      setMovementNoticeContext("city-instant");
      setMovementNotice("started");
      setQueueProgress(1);
      window.clearTimeout(noticeTimerRef.current);
      noticeTimerRef.current = window.setTimeout(() => setMovementNotice(null), 1400);
      executeNavigation(movement);
      return;
    }

    if (steps[stepIndex].idle && activeVideo?.loop) {
      pendingNavigationRef.current = movement;
      activeVideo.loop = false;
      setDirection(movement);
      setMovementNoticeContext("cycle");
      setMovementNotice("queued");
      setQueueProgress(activeVideo.duration ? activeVideo.currentTime / activeVideo.duration : 0);
      setPaused(false);
      activeVideo.play().catch(() => undefined);
      return;
    }

    executeNavigation(movement);
  }, [autoMonitorPhase, executeNavigation, exitFirstMonitor, getVideo, isAutoMonitorBusy, isSecondaryMonitorBusy, monitorOpen, reverseActiveTransition, secondaryMonitorPhase, selectedCatalog, skipEntranceForward, stepIndex]);

  const settleIdleLoop = useCallback(async (targetIndex, transitionSlot) => {
    const idleSrc = steps[targetIndex].idle;
    if (!idleSrc) return;
    const loopSlot = transitionSlot === "a" ? "b" : "a";
    const loopVideo = getVideo(loopSlot);
    const transitionVideo = getVideo(transitionSlot);
    if (!loopVideo) return;

    loopVideo.pause();
    loopVideo.loop = true;
    loopVideo.muted = muted;
    if (loopVideo.getAttribute("src") !== idleSrc) {
      loopVideo.setAttribute("src", idleSrc);
      loopVideo.load();
    }
    loopVideo.currentTime = 0;

    try {
      await waitForPlayable(loopVideo);
      await loopVideo.play();
      await waitForPresentedFrame(loopVideo);

      if (steps[targetIndex].idleHandoff === "cut") {
        const queuedAfterEntrance = postTransitionNavigationRef.current;
        postTransitionNavigationRef.current = null;
        setHardCutSlot(loopSlot);
        setFront(loopSlot);
        transitionVideo?.pause();
        setOutgoingSlot(null);
        transitionRef.current = null;
        setDirection("idle");
        requestAnimationFrame(() => requestAnimationFrame(() => setHardCutSlot(null)));
        if (["forward", "reverse"].includes(queuedAfterEntrance)) {
          window.clearTimeout(noticeTimerRef.current);
          setMovementNotice(null);
          requestAnimationFrame(() => {
            if (queuedAfterEntrance === "forward") {
              startClip({
                src: steps[targetIndex].forward,
                targetIndex: targetIndex + 1,
                movement: "forward",
              });
            } else {
              startClip({
                src: steps[targetIndex].reverse,
                targetIndex: targetIndex - 1,
                movement: "reverse",
              });
            }
          });
        }
        return;
      }

      setOutgoingSlot(transitionSlot);
      setFront(loopSlot);
      window.setTimeout(() => {
        transitionVideo?.pause();
        setOutgoingSlot(null);
        transitionRef.current = null;
        setDirection("idle");
      }, 460);
    } catch {
      transitionRef.current = null;
      setDirection("idle");
    }
  }, [getVideo, muted, setFront, startClip]);

  const onClipEnded = useCallback((slot) => {
    const activeTransition = transitionRef.current;
    if (reverseSwapRef.current && activeTransition?.movement === "forward") return;
    if (!activeTransition) {
      if (slot !== frontSlotRef.current || !pendingNavigationRef.current) return;
      const queuedMovement = pendingNavigationRef.current;
      pendingNavigationRef.current = null;
      window.clearTimeout(noticeTimerRef.current);
      setMovementNotice(null);
      executeNavigation(queuedMovement);
      return;
    }
    if (activeTransition.incomingSlot !== slot) return;

    if (activeTransition.movement === "forward" && activeTransition.targetIndex === steps.length - 1) {
      setStepIndex(activeTransition.targetIndex);
      transitionRef.current = null;
      setDirection("idle");
      requestAnimationFrame(() => startClip({
        src: steps[0].idle,
        targetIndex: 0,
        movement: "forward",
        loop: true,
      }));
      return;
    }

    setStepIndex(activeTransition.targetIndex);
    setEntranceForwardUnlocked(false);
    if (steps[activeTransition.targetIndex].idle) {
      settleIdleLoop(activeTransition.targetIndex, slot);
      return;
    }

    transitionRef.current = null;
    setDirection("idle");
  }, [executeNavigation, settleIdleLoop, startClip]);

  useEffect(() => {
    const firstVideo = videoARef.current;
    if (!firstVideo) return;
    firstVideo.loop = true;
    firstVideo.muted = muted;
    firstVideo.play().catch(() => undefined);
  }, []);

  useEffect(() => {
    [videoARef.current, videoBRef.current].forEach((video) => {
      if (video) video.muted = muted;
    });
  }, [muted]);

  useEffect(() => {
    const activeVideo = getVideo(frontSlotRef.current);
    if (!activeVideo) return;
    if (paused) activeVideo.pause();
    else activeVideo.play().catch(() => undefined);
  }, [getVideo, paused]);

  useEffect(() => {
    if (!isEntranceTransition) {
      setEntranceForwardUnlocked(false);
      return undefined;
    }
    let frameId;
    const trackUnlock = () => {
      const activeVideo = getVideo(frontSlotRef.current);
      setEntranceForwardUnlocked(Boolean(activeVideo && activeVideo.currentTime >= ENTRANCE_UNLOCK_TIME));
      frameId = requestAnimationFrame(trackUnlock);
    };
    frameId = requestAnimationFrame(trackUnlock);
    return () => cancelAnimationFrame(frameId);
  }, [frontSlot, getVideo, isEntranceTransition]);

  useEffect(() => {
    const firstMonitorVideo = firstMonitorVideoRef.current;
    if (!firstMonitorVideo || autoMonitorPhase !== "playing") return;
    if (paused) firstMonitorVideo.pause();
    else firstMonitorVideo.play().catch(() => undefined);
  }, [autoMonitorPhase, paused]);

  useEffect(() => {
    const onWheel = (event) => {
      event.preventDefault();
      wheelAccumulatorRef.current += event.deltaY;
      window.clearTimeout(wheelResetRef.current);
      wheelResetRef.current = window.setTimeout(() => { wheelAccumulatorRef.current = 0; }, 180);
      if (Math.abs(wheelAccumulatorRef.current) < 46) return;
      const movement = wheelAccumulatorRef.current > 0 ? "forward" : "reverse";
      wheelAccumulatorRef.current = 0;
      navigate(movement);
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape" && monitorOpen) {
        event.preventDefault();
        setMonitorOpen(false);
        return;
      }
      if (["ArrowDown", "PageDown"].includes(event.key)) {
        event.preventDefault();
        navigate("forward");
      }
      if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        navigate("reverse");
      }
      if (event.key.toLowerCase() === "m") setMuted((value) => !value);
      if (event.key.toLowerCase() === "p") setPaused((value) => !value);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(wheelResetRef.current);
    };
  }, [monitorOpen, navigate]);

  useEffect(() => () => window.clearTimeout(settleTimerRef.current), []);
  useEffect(() => () => window.clearTimeout(autoMonitorTimerRef.current), []);
  useEffect(() => () => window.clearTimeout(secondaryMonitorTimerRef.current), []);

  useEffect(() => {
    if (!["queued", "locked"].includes(movementNotice)) return undefined;
    let frameId;
    const updateProgress = () => {
      const activeVideo = getVideo(frontSlotRef.current);
      const progressDuration = movementNoticeContext === "unlock" ? ENTRANCE_UNLOCK_TIME : activeVideo?.duration;
      if (progressDuration) setQueueProgress(Math.min(activeVideo.currentTime / progressDuration, 1));
      frameId = requestAnimationFrame(updateProgress);
    };
    frameId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(frameId);
  }, [getVideo, movementNotice, movementNoticeContext]);

  useEffect(() => () => window.clearTimeout(noticeTimerRef.current), []);

  useEffect(() => {
    const adjacentSources = [
      stepIndex < steps.length - 1 ? steps[stepIndex].forward : steps[0].idle,
      stepIndex > 0 ? steps[stepIndex].reverse : null,
      stepIndex < steps.length - 1 ? steps[stepIndex + 1].reverse : null,
      steps[stepIndex].idle,
      stepIndex === 0 ? steps[1].idle : null,
      stepIndex === 0 ? steps[1].forward : null,
    ].filter(Boolean);
    const controller = new AbortController();
    const warmCache = window.setTimeout(() => {
      adjacentSources.forEach((src) => {
        fetch(src, { cache: "force-cache", signal: controller.signal }).catch(() => undefined);
      });
    }, 700);

    return () => {
      window.clearTimeout(warmCache);
      controller.abort();
    };
  }, [stepIndex]);

  useEffect(() => {
    setMonitorOpen(false);
    setMonitorSelection(0);
    setMonitorPaused(false);
    setSelectedExperience(null);
  }, [stepIndex]);

  useEffect(() => {
    window.clearTimeout(autoMonitorTimerRef.current);

    if (stepIndex < 2) firstMonitorCompletedRef.current = false;
    if (stepIndex !== 2) {
      setAutoMonitorPhase("idle");
      setSelectedCatalog(null);
      return undefined;
    }
    if (direction !== "idle" || transitionRef.current) return undefined;

    if (firstMonitorCompletedRef.current) {
      setAutoMonitorPhase("catalog-powering");
      autoMonitorTimerRef.current = window.setTimeout(() => setAutoMonitorPhase("catalog"), TV_POWER_ON_MS);
      return () => window.clearTimeout(autoMonitorTimerRef.current);
    }

    setAutoMonitorPhase("powering");
    autoMonitorTimerRef.current = window.setTimeout(() => setAutoMonitorPhase("playing"), TV_POWER_ON_MS);
    return () => window.clearTimeout(autoMonitorTimerRef.current);
  }, [direction, stepIndex]);

  useEffect(() => {
    window.clearTimeout(secondaryMonitorTimerRef.current);
    if (![3, 4].includes(stepIndex) || direction !== "idle" || transitionRef.current) {
      setSecondaryMonitorPhase("off");
      return undefined;
    }
    setSecondaryMonitorPhase("powering");
    secondaryMonitorTimerRef.current = window.setTimeout(() => setSecondaryMonitorPhase("active"), TV_POWER_ON_MS);
    return () => window.clearTimeout(secondaryMonitorTimerRef.current);
  }, [direction, stepIndex]);

  useEffect(() => {
    const monitorVideo = monitorVideoRef.current;
    if (!monitorVideo || !monitorOpen) return;
    if (monitorPaused) monitorVideo.pause();
    else monitorVideo.play().catch(() => undefined);
  }, [monitorItem?.id, monitorOpen, monitorPaused]);

  const onPointerDown = (event) => {
    if (event.pointerType === "touch") touchStartRef.current = event.clientY;
  };

  const onPointerUp = (event) => {
    if (event.pointerType !== "touch" || touchStartRef.current === null) return;
    const distance = touchStartRef.current - event.clientY;
    touchStartRef.current = null;
    if (Math.abs(distance) < 54) return;
    navigate(distance > 0 ? "forward" : "reverse");
  };

  const cycleMonitor = (offset) => {
    if (!monitorChapter) return;
    setMonitorSelection((current) => (current + offset + monitorChapter.items.length) % monitorChapter.items.length);
    setMonitorPaused(false);
  };

  return (
    <main
      className={`experience is-${direction}${loading ? " is-loading" : ""}${monitorOpen ? " is-monitor-open" : ""}${[2, 3, 4].includes(stepIndex) && direction === "idle" ? " is-spatial-monitor" : ""}`}
      dir="rtl"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <a className="skip-link" href="#chapter-content">پرش به محتوای فصل</a>

      <div className="scene-stage" aria-hidden="true">
        <video
          ref={videoARef}
          className={`scene-slot${frontSlot === "a" ? " is-front" : ""}${outgoingSlot === "a" ? " is-outgoing" : ""}${hardCutSlot === "a" ? " is-hard-cut" : ""}`}
          src="/assets/motions/01-origin-loop.mp4"
          muted
          playsInline
          autoPlay
          preload="auto"
          onEnded={() => onClipEnded("a")}
        />
        <video
          ref={videoBRef}
          className={`scene-slot${frontSlot === "b" ? " is-front" : ""}${outgoingSlot === "b" ? " is-outgoing" : ""}${hardCutSlot === "b" ? " is-hard-cut" : ""}`}
          muted
          playsInline
          preload="auto"
          onEnded={() => onClipEnded("b")}
        />
        <div className="scene-wash" />
      </div>

      {stepIndex === 2 && direction === "idle" && ["powering", "playing", "powering-off", "catalog-powering", "catalog", "catalog-powering-off"].includes(autoMonitorPhase) ? (
        <section className="spatial-tv-layer" aria-label={autoMonitorPhase.startsWith("catalog") ? "مانیتور کاتالوگ‌های تجربه برند" : "مانیتور BEX"}>
          <div className="spatial-tv-canvas">
            <div className={`spatial-tv-screen monitor-power-surface ${autoMonitorPhase === "catalog-powering" ? "is-powering" : autoMonitorPhase === "catalog-powering-off" ? "is-powering-off" : `is-${autoMonitorPhase}`}`}>
              {["powering", "playing", "powering-off"].includes(autoMonitorPhase) ? (
                <video
                  ref={firstMonitorVideoRef}
                  src="/assets/monitors/bex.mp4"
                  autoPlay={autoMonitorPhase === "playing"}
                  muted={muted}
                  playsInline
                  preload="auto"
                  onEnded={handleFirstMonitorEnded}
                />
              ) : null}

              {["catalog-powering", "catalog", "catalog-powering-off"].includes(autoMonitorPhase) ? (
                <div className="catalog-home">
                  {selectedCatalog ? (
                    <CatalogReader catalog={selectedCatalog} muted={muted} onClose={() => setSelectedCatalog(null)} />
                  ) : (
                    <>
                      <div className="catalog-heading">
                        <span>کتاب تجربه‌ی پویای برند</span>
                        <h2>یک تجربه را برای ورق‌زدن انتخاب کنید</h2>
                        <p>Dynamic Brand Experience Book</p>
                      </div>
                      <div className="catalog-grid">
                        {catalogs.map((catalog) => (
                          <button key={catalog.id} type="button" onClick={() => setSelectedCatalog(catalog)} aria-label={`بازکردن کاتالوگ ${catalog.title}`}>
                            <span className="catalog-cover">
                              {catalog.cover ? <img src={catalog.cover} alt="" /> : <FiFileText aria-hidden="true" />}
                            </span>
                            <strong>{catalog.title}</strong>
                            <small>مشاهده کاتالوگ</small>
                          </button>
                        ))}
                      </div>
                      {catalogs.length === 0 ? <p className="catalog-empty">فایل PDF را در پوشهٔ کاتالوگ‌ها قرار دهید.</p> : null}
                    </>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {stepIndex === 3 && direction === "idle" && secondaryMonitorPhase !== "off" ? (
        <section className="spatial-tv-layer spatial-channel-layer" aria-label="مانیتور تجربه‌های یکپارچه">
          <div className="spatial-tv-canvas">
            <div className={`spatial-tv-screen channel-screen monitor-power-surface is-${secondaryMonitorPhase}`}>
              {selectedExperience ? (
                <div className="channel-player">
                  <video key={selectedExperience.id} src={selectedExperience.src} autoPlay loop muted={muted} playsInline preload="auto" />
                  <button type="button" onClick={() => setSelectedExperience(null)}><FiChevronRight aria-hidden="true" /> بازگشت به انتخاب‌ها</button>
                  <span>{selectedExperience.eyebrow}</span>
                </div>
              ) : (
                <div className="channel-home">
                  <div><span>تجربه‌های یکپارچه‌ی بکستودیو</span><h2>مسیر تجربه را انتخاب کنید</h2><p>Integrated Experience Formats</p></div>
                  <div className="channel-grid">
                    {experienceChannels.map((item, index) => (
                      <button key={item.id} type="button" onClick={() => setSelectedExperience(item)}>
                        <small>۰{index + 1}</small><strong>{item.label}</strong><span>{item.eyebrow}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {stepIndex === 4 && direction === "idle" && secondaryMonitorPhase !== "off" ? (
        <section className={`spatial-tv-layer spatial-social-layer is-${secondaryMonitorPhase}`} aria-label="مانیتور شبکه‌های اجتماعی بکستودیو">
          <div className="spatial-tv-canvas">
            <div className="social-device">
              <div className={`social-device-screen monitor-power-surface is-${secondaryMonitorPhase}`}>
                <video
                  src="/assets/monitors/social-media.mp4"
                  autoPlay
                  loop
                  muted={muted}
                  playsInline
                  preload="auto"
                  aria-label="روایت شبکه‌های اجتماعی بکستودیو"
                />
              </div>
              <div className="social-hit-zones" aria-label="شبکه‌های اجتماعی">
                <a href="https://www.linkedin.com/company/bextudio/" target="_blank" rel="noreferrer" aria-label="لینکدین بکستودیو" />
                <a href="https://www.instagram.com/bextudio/" target="_blank" rel="noreferrer" aria-label="اینستاگرام بکستودیو" />
                <a href="https://t.me/bextudio" target="_blank" rel="noreferrer" aria-label="تلگرام بکستودیو" />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <header className="edge-header">
        <a className="brand" href="https://bextudio.com" target="_blank" rel="noreferrer" aria-label="وب‌سایت بکستودیو">
          <img src="/assets/brand/bextudio-logo.png" alt="Bextudio — Powered by Kanoon Iran Novin" />
        </a>
        <nav className="global-links" aria-label="پیوندهای بکستودیو">
          <div className="social-links">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}><Icon aria-hidden="true" /></a>
            ))}
          </div>
          <span className="link-divider" aria-hidden="true" />
          <a href="https://bextudio.com" target="_blank" rel="noreferrer">bextudio.com</a>
          <a className="app-link" href="https://app.bextudio.com" target="_blank" rel="noreferrer">ورود به اپ <FiExternalLink aria-hidden="true" /></a>
        </nav>
      </header>

      <section className="narrative" id="chapter-content" aria-live="polite">
        <div className="chapter-kicker"><span>{step.label}</span><span>{step.number} / ۰۶</span></div>
        <h1>{step.title}</h1>
        <p>{step.description}</p>
        {monitorChapter ? (
          <button className="monitor-launch" type="button" onClick={() => { setMonitorPaused(false); setMonitorOpen(true); }} disabled={isTransitioning}>
            <FiMonitor aria-hidden="true" /><span>بازکردن مانیتور این فصل</span>
          </button>
        ) : null}
      </section>

      <ol className="chapter-rail" aria-label="مسیر تجربه">
        {steps.map((item, index) => (
          <li key={item.id} className={index === stepIndex ? "is-current" : index < stepIndex ? "is-passed" : ""}>
            <span className="rail-number">{item.number}</span>
            <span className="rail-dot" aria-hidden="true" />
            <span className="rail-label">{item.label}</span>
          </li>
        ))}
      </ol>

      <div className="chapter-navigation" aria-label="حرکت در تجربه">
        <button
          type="button"
          disabled={!(canExitFirstMonitor || canReverseActiveMotion || (stepIndex > 0 && !isTransitioning))}
          onClick={() => navigate("reverse")}
          aria-label={canReverseActiveMotion ? "معکوس‌کردن حرکت از همین لحظه" : "حرکت به فصل قبل"}
        >
          <FiArrowUp aria-hidden="true" /><span>حرکت معکوس</span>
        </button>
        <button
          className={`continue-cue${isEntranceTransition && entranceForwardUnlocked ? " is-unlocked" : ""}`}
          type="button"
          disabled={isEntranceTransition ? !entranceForwardUnlocked : (isTransitioning && !canExitFirstMonitor)}
          onClick={() => navigate("forward")}
          aria-label={stepIndex === steps.length - 1 ? "بازگشت به آغاز تجربه" : isEntranceTransition ? entranceForwardUnlocked ? "ادامه با ظاهرشدن چراغ آبی فعال است" : "ادامه با ظاهرشدن چراغ آبی فعال می‌شود" : "حرکت به فصل بعد"}
        >
          <span>{stepIndex === steps.length - 1 ? "بازگشت به آغاز" : "ادامه‌ی تجربه"}</span>
          {stepIndex === steps.length - 1 ? <FiRotateCcw aria-hidden="true" /> : <FiArrowDown aria-hidden="true" />}
        </button>
      </div>

      <div className="experience-controls" aria-label="تنظیمات تجربه">
        <button type="button" aria-label={muted ? "فعال‌کردن صدا" : "قطع صدا"} title={muted ? "فعال‌کردن صدا" : "قطع صدا"} onClick={() => setMuted((value) => !value)}>
          {muted ? <FiVolumeX aria-hidden="true" /> : <FiVolume2 aria-hidden="true" />}
        </button>
        <button type="button" aria-label={paused ? "ادامه‌ی حرکت" : "توقف حرکت"} title={paused ? "ادامه‌ی حرکت" : "توقف حرکت"} onClick={() => setPaused((value) => !value)}>
          {paused ? <FiPlay aria-hidden="true" /> : <FiPause aria-hidden="true" />}
        </button>
      </div>

      <div className="interaction-hint" aria-hidden="true">
        {loading ? <><FiLoader className="loading-icon" /><span>آماده‌سازی حرکت معکوس</span></> : <><FiArrowDown /><span>{isEntranceTransition ? entranceForwardUnlocked ? "ادامه فعال شد · اسکرول پایین: جلو · اسکرول بالا: معکوس" : "اسکرول بالا: معکوس · ادامه با روشن‌شدن چراغ آبی فعال می‌شود" : canExitFirstMonitor ? "اسکرول برای خاموش‌کردن مانیتور و ادامهٔ مسیر" : stepIndex === steps.length - 1 ? "اسکرول پایین: بازگشت به آغاز" : "اسکرول پایین: ادامه · اسکرول بالا: بازگشت"}</span></>}
      </div>

      {movementNotice ? (
        <div className={`movement-notice is-${movementNotice}`} role="status" aria-live="polite">
          <span className="movement-notice-icon" aria-hidden="true">
            {movementNotice === "started" ? <FiCheckCircle /> : <FiClock />}
          </span>
          <span className="movement-notice-copy">
            <strong>{movementNotice === "locked" ? "ادامه کمی بعد فعال می‌شود" : movementNotice === "queued" ? "درخواست حرکت ثبت شد" : movementNoticeContext === "instant-reverse" ? "حرکت معکوس شد" : "حرکت آغاز شد"}</strong>
            <small>{movementNotice === "locked" ? "بازگشت از همین حالا فعال است؛ ادامه با روشن‌شدن چراغ آبی باز می‌شود" : movementNotice === "queued" && movementNoticeContext === "entrance" ? "این حرکت کامل می‌شود، سپس فصل بعد آغاز خواهد شد" : movementNotice === "queued" ? "با پایان این دور، فصل بعد آغاز می‌شود" : movementNoticeContext === "instant-reverse" ? "ادامهٔ مسیر از همین فریم در جهت عکس اجرا می‌شود" : ["entrance-forward", "city-instant"].includes(movementNoticeContext) ? "حرکت بعدی بدون انتظار آغاز شد" : "در حال ورود به فصل بعد"}</small>
          </span>
          {movementNotice !== "started" ? (
            <span className="movement-notice-progress" aria-hidden="true"><i style={{ transform: `scaleX(${queueProgress})` }} /></span>
          ) : null}
        </div>
      ) : null}

      {monitorOpen && monitorChapter && monitorItem ? (
        <div className="monitor-overlay" role="dialog" aria-modal="true" aria-labelledby="monitor-title" onClick={() => setMonitorOpen(false)}>
          <section className="monitor-shell" onClick={(event) => event.stopPropagation()}>
            <header className="monitor-header">
              <div>
                <span>{monitorChapter.eyebrow}</span>
                <strong>{monitorItem.label}</strong>
              </div>
              <button type="button" onClick={() => setMonitorOpen(false)} aria-label="بستن مانیتور"><FiX aria-hidden="true" /></button>
            </header>

            <div className={`monitor-screen is-${monitorChapter.type}`}>
              {monitorChapter.type === "motion" ? (
                <video
                  key={monitorItem.id}
                  ref={monitorVideoRef}
                  src={monitorItem.src}
                  autoPlay
                  loop
                  muted={muted}
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img key={monitorItem.id} src={monitorItem.src} alt={`پیش‌نمایش کتاب تجربه‌ی ${monitorItem.label}`} />
              )}

              {monitorChapter.type === "motion" ? (
                <button className="monitor-play" type="button" onClick={() => setMonitorPaused((value) => !value)} aria-label={monitorPaused ? "ادامه‌ی محتوای مانیتور" : "توقف محتوای مانیتور"}>
                  {monitorPaused ? <FiPlay aria-hidden="true" /> : <FiPause aria-hidden="true" />}
                </button>
              ) : null}

              {monitorChapter.items.length > 1 ? (
                <>
                  <button className="monitor-cycle previous" type="button" onClick={() => cycleMonitor(-1)} aria-label="نمونه‌ی قبلی"><FiChevronRight aria-hidden="true" /></button>
                  <button className="monitor-cycle next" type="button" onClick={() => cycleMonitor(1)} aria-label="نمونه‌ی بعدی"><FiChevronLeft aria-hidden="true" /></button>
                </>
              ) : null}
            </div>

            <div className="monitor-details">
              <div>
                <span>{monitorChapter.eyebrow}</span>
                <h2 id="monitor-title">{monitorChapter.title}</h2>
                <p>{monitorChapter.description}</p>
              </div>
              {monitorChapter.items.length > 1 ? (
                <div className="monitor-tabs" role="tablist" aria-label="انتخاب محتوای مانیتور">
                  {monitorChapter.items.map((item, index) => (
                    <button key={item.id} type="button" role="tab" aria-selected={index === monitorSelection} onClick={() => { setMonitorSelection(index); setMonitorPaused(false); }}>
                      <span>{String(index + 1).padStart(2, "0")}</span>{item.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        </div>
      ) : null}

      <p className="sr-status" role="status">{isTransitioning ? "حرکت میان فصل‌ها در حال اجراست" : `فصل ${step.number}: ${step.label}`}</p>
    </main>
  );
}
