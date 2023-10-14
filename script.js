/** DOM elements which prevent you from clicking on a Youtube video */
const IDENTIFIERS = ["tp-yt-iron-overlay-backdrop", "ytd-popup-container"];

/** Has the popup appeared? If this is true, then it means the popup has been removed at some point */
let hasRemoved = false;

/** Has the video been auto-resumed after the inital pause? */
let hasResumedVideo = false;

/**
    Retrieves the primary Youtube video
    @returns {HTMLVideoElement | null} The video
*/
const getPrimaryVideo = () => document.querySelector("video.html5-main-video");

/**
    Removes the popup from the DOM and resumes the video (the popup trigger pauses it).
*/
const removePopup = () => {
  if (hasRemoved) {
    return;
  }

  /** Has the popup been removed within this check? */
  let didRemoveThisTime = false;

  for (const identifier of IDENTIFIERS) {
    const element = document.querySelector(identifier);

    if (element) {
      element.remove();
      didRemoveThisTime = true;
    }
  }

  // Mark the popup as having been removed, so we don't try again
  hasRemoved = didRemoveThisTime;
};

/** Resumes the primary video after the initial pause */
const resumeVideoOnce = () => {
  if (hasResumedVideo) {
    return;
  }

  const video = getPrimaryVideo();
  if (video?.paused) {
    video.play();
    hasResumedVideo = true;
  }
};

const observer = new MutationObserver(() => {
  // Potentially remove the popup blocker and resume the video after the page loads
  removePopup();
  resumeVideoOnce();
});

if (window.location.hostname === "www.youtube.com") {
  observer.observe(document.body, { childList: true, subtree: true });
  // Don't worry about disconnecting
}
