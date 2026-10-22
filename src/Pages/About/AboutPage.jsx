import "./styles/index.css";
import { Box } from "@mui/material";

const STATUS = ["Available for Front-End roles", "EST/CST timezone", "Bilingual EN/ES"];
const STACK = ["React", "Next.js", "TypeScript", "Tailwind CSS", "GraphQL", "Python / FastAPI"];
const QUOTE = "Motivation is only the first step, discipline is the infinite ladder of life.";

const AboutPage = () => {
  return (
    <Box component="section" className="containerAbout" aria-labelledby="about-title">
      <Box component="p" className="aboutBadge">
        <span className="aboutBadgeDot" aria-hidden="true" />
        {STATUS.map((item, index) => (
          <span key={item}>
            {index > 0 && <span className="aboutBadgeSeparator" aria-hidden="true">·</span>}
            {item}
          </span>
        ))}
      </Box>

      <Box component="h1" id="about-title" className="aboutTitle">
        <span className="aboutTitleMain">I&apos;m Marco Bravo, a Front-End Developer</span>
        <span className="aboutTitleSub">
          building scalable, high-performance interfaces with React, Next.js &amp; TypeScript.
        </span>
      </Box>

      <Box component="p" className="aboutLead">
        I ship production UI that moves real metrics: secure SMB onboarding flows for Bank BCI that
        cut critical registration errors by <strong>30%</strong>, and real-time Mapbox GL monitoring
        at Agrosat that reduced manual crop-monitoring work by <strong>30%+</strong> for{" "}
        <strong>300+ daily users</strong>. When the job goes beyond the frontend, I own it end to
        end — I built <strong>Lockerpass</strong>, an encrypted password manager, with Next.js,
        TypeScript, Python/FastAPI and PostgreSQL.
      </Box>

      <Box component="ul" className="aboutStack" aria-label="Core tech stack">
        {STACK.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </Box>

      <Box component="figure" className="aboutQuote">
        <figcaption className="aboutQuoteContext">
          Based in Santiago, Chile. In Calgary, Canada, I worked physically demanding jobs in
          structural framing and hospitality while reaching professional English fluency and
          building Lockerpass on my own. That&apos;s where this became my rule:
        </figcaption>
        <blockquote className="aboutQuoteText">&ldquo;{QUOTE}&rdquo;</blockquote>
      </Box>
    </Box>
  );
};

export default AboutPage;
