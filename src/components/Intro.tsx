type IntroProps = {
  /** True while the intro is dissolving after a manual skip. */
  leaving: boolean;
  onSkip: () => void;
};

/**
 * The camera intro. All of its look and timing lives in analog.css (`.intro`, `.camera-*`,
 * `.flash-frame` …) — no layout utilities here, so there is exactly one source of truth.
 */
export function Intro({ leaving, onSkip }: IntroProps) {
  return (
    <div className={leaving ? "intro intro-leaving" : "intro"} role="status" aria-label="Afterimage is loading">
      <button type="button" className="intro-skip" onClick={onSkip}>
        Skip intro
      </button>
      <div className="camera-stage">
        <div className="camera">
          <div className="camera-top">
            <span className="shutter-button" />
            <span className="exposure-dial">
              <i />
            </span>
            <span className="camera-flash" />
            <span className="camera-viewfinder">
              <i />
            </span>
            <span className="rangefinder-window" />
          </div>
          <div className="camera-body">
            <div className="camera-metal-band" />
            <div className="camera-grip">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <span className="camera-brand">
              AFTERIMAGE <small>LAND 01</small>
            </span>
            <div className="camera-lens">
              <div className="lens-markings">3.5 · 90MM · COATED</div>
              <span className="lens-glass" />
              <i className="lens-glint" />
            </div>
            <span className="camera-counter">01</span>
            <span className="camera-meter">
              <i />
            </span>
            <span className="camera-screw screw-left" />
            <span className="camera-screw screw-right" />
            <span className="camera-spec">AUTO EXPOSURE · 90MM</span>
          </div>
        </div>
      </div>
      <p className="intro-copy">Look into the lens</p>
      <div className="flash-frame" />
    </div>
  );
}
