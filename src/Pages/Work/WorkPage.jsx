import "./styles/index.css";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import OpenInNew from "@mui/icons-material/OpenInNew";
import useCursorEvents from "../../hooks/useCursorEvents";
import { DEFAULT_EXPERIENCE, experience } from "../../constants/experience";

const LAST = experience.length - 1;

// "**30%**" in the data becomes a highlighted metric
const renderEmphasis = (text) =>
  text.split("**").map((part, index) => (index % 2 ? <strong key={index}>{part}</strong> : part));

/* Experience as a horizontal timeline (tabs): pick a stop on the track to read its details below */
const WorkPage = () => {
  const [selectedId, setSelectedId] = useState(DEFAULT_EXPERIENCE);
  const { setOnHoverEvent, removeOnHoverEvent } = useCursorEvents();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const trackRef = useRef(null);
  const tabRefs = useRef({});

  const selectedIndex = experience.findIndex((item) => item.id === selectedId);
  const selected = experience[selectedIndex];

  // On phones the track scrolls sideways: keep the selected stop in the middle.
  // Scrolls only the track (scrollIntoView could also scroll the overflow-hidden frame)
  const centerTab = (id, behavior) => {
    const track = trackRef.current;
    const tab = tabRefs.current[id];
    if (!track || !tab || track.scrollWidth <= track.clientWidth) return;
    track.scrollTo({ left: tab.offsetLeft - (track.clientWidth - tab.offsetWidth) / 2, behavior });
  };

  useEffect(() => {
    centerTab(DEFAULT_EXPERIENCE, "auto");
  }, []);

  // The CTAs navigate away while hovered (no mouseleave): reset the custom cursor on unmount
  useEffect(() => removeOnHoverEvent, [removeOnHoverEvent]);

  const select = (index, focus = false) => {
    const { id } = experience[index];
    setSelectedId(id);
    if (focus) tabRefs.current[id]?.focus({ preventScroll: true });
    centerTab(id, reduceMotion ? "auto" : "smooth");
  };

  // Arrow keys / Home / End move along the track (WAI-ARIA tabs pattern)
  const handleKeyDown = (event) => {
    const next = {
      ArrowRight: Math.min(selectedIndex + 1, LAST),
      ArrowLeft: Math.max(selectedIndex - 1, 0),
      Home: 0,
      End: LAST,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next, true);
  };

  const hoverProps = {
    onMouseEnter: () => setOnHoverEvent(),
    onMouseLeave: () => removeOnHoverEvent(),
  };

  return (
    <Box component="section" className="workPage" aria-labelledby="work-title">
      <Box component="p" className="workBadge">
        <span className="workBadgeDot" aria-hidden="true" />
        Experience
        <span className="workBadgeSeparator" aria-hidden="true">·</span>
        2023 – Present
      </Box>

      <Box component="h1" id="work-title" className="workTitle">
        <span className="workTitleMain">Production front-end for fintech and agritech.</span>
        <span className="workTitleSub">
          React and TypeScript for real users, from real-time crop maps to bank onboarding.
        </span>
      </Box>

      <div className="workTrack" ref={trackRef}>
        <div
          role="tablist"
          aria-label="Career timeline"
          className="workTimeline"
          style={{ "--count": experience.length, "--progress": selectedIndex / LAST }}
          onKeyDown={handleKeyDown}
        >
          {experience.map((item, index) => {
            const isActive = item.id === selectedId;
            const classes = [
              "workNode",
              isActive && "active",
              index < selectedIndex && "past",
              item.current && "current",
            ].filter(Boolean);

            return (
              <button
                key={item.id}
                ref={(element) => (tabRefs.current[item.id] = element)}
                type="button"
                role="tab"
                id={`work-tab-${item.id}`}
                aria-selected={isActive}
                aria-controls="work-panel"
                tabIndex={isActive ? 0 : -1}
                className={classes.join(" ")}
                onClick={() => select(index)}
                {...hoverProps}
              >
                <span className="workNodeDot" aria-hidden="true" />
                <span className="workNodeDate">{item.node}</span>
                <span className="workNodeLabel">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Box
        component="article"
        key={selected.id}
        role="tabpanel"
        id="work-panel"
        aria-labelledby={`work-tab-${selected.id}`}
        className="workPanel"
      >
        <header className="workPanelHeader">
          <div>
            <h2 className="workRole">{selected.role}</h2>
            <p className="workOrg">
              {selected.org}
              {selected.client && <> · Client: {selected.client}</>} · {selected.location}
            </p>
          </div>
          <p className="workMeta">
            <span className="workTag">{selected.tag}</span>
            {selected.period}
            {selected.duration && ` · ${selected.duration}`}
          </p>
        </header>

        <ul className="workBullets">
          {selected.bullets.map((bullet) => (
            <li key={bullet}>{renderEmphasis(bullet)}</li>
          ))}
        </ul>

        {selected.stack.length > 0 && (
          <ul className="workStack" aria-label="Stack">
            {selected.stack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        )}

        {(selected.links || selected.current) && (
          <div className="workActions">
            {selected.current && (
              <>
                <Link className="workButton primary" to="/contact" {...hoverProps}>
                  Get in touch
                </Link>
                <Link className="workButton" to="/projects" {...hoverProps}>
                  See projects
                </Link>
              </>
            )}
            {selected.links?.map((link) => (
              <a
                key={link.href}
                className="workLink"
                href={link.href}
                target="_blank"
                rel="noreferrer"
                {...hoverProps}
              >
                {link.label}
                <OpenInNew fontSize="inherit" />
              </a>
            ))}
          </div>
        )}
      </Box>
    </Box>
  );
};

export default WorkPage;
