import { useId } from "react";
import robotPoses from "../../assets/images/robot-garden-poses.png";

export default function RobotGarden({ theme, locale = "en" }: { theme: "light" | "dark"; locale?: "en" | "th" }) {
  const id = useId();
  return (
    <figure className="garden-figure">
      <div className="garden-scene">
        <svg viewBox="0 0 600 540" role="img" aria-labelledby={`${id}-title`}>
          <title id={`${id}-title`}>{locale === "th"
            ? theme === "light" ? "หุ่นยนต์ตัวน้อยรดน้ำต้นไม้ใต้แสงอาทิตย์" : "หุ่นยนต์ตัวน้อยนอนหลับในสวนใต้แสงจันทร์และดวงดาว"
            : theme === "light"
            ? "A little robot waters its garden under a glowing sun."
            : "A little robot sleeps beside its garden under the moon and stars."}</title>
          <defs>
            <radialGradient id={`${id}-sun-glow`}>
              <stop stopColor="#ffdf85" stopOpacity=".45" />
              <stop offset="1" stopColor="#ffdf85" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`${id}-moon-glow`}>
              <stop stopColor="#c6dffa" stopOpacity=".18" />
              <stop offset="1" stopColor="#c6dffa" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g className="garden-stars" fill="#e5edce">
            {[[74, 95], [192, 69], [287, 137], [358, 61], [529, 191], [94, 234], [490, 275]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={i % 2 ? 2 : 3} style={{ animationDelay: `${i * -.6}s` }} />
            ))}
            <path d="M251 220v12m-6-6h12M531 78v12m-6-6h12" stroke="currentColor" strokeWidth="2" />
          </g>
          <g className="garden-sun">
            <circle cx="448" cy="116" r="102" fill={`url(#${id}-sun-glow)`} />
            <g className="sun-rays" stroke="#e4b355" strokeWidth="2" strokeLinecap="round">
              {Array.from({ length: 12 }, (_, i) => <path key={i} d="M448 58v-8" transform={`rotate(${i * 30} 448 116)`} />)}
            </g>
            <circle cx="448" cy="116" r="39" fill="#f2c868" />
            <circle cx="436" cy="104" r="25" fill="#f8d882" opacity=".6" />
          </g>
          <g className="garden-moon">
            <circle cx="448" cy="116" r="110" fill={`url(#${id}-moon-glow)`} />
            <g className="moon-float">
              <path d="M469 78a42 42 0 1 0 20 65A39 39 0 0 1 469 78Z" fill="#e9ebcb" />
              <circle cx="426" cy="124" r="5" fill="#ccd4b7" opacity=".65" />
              <circle cx="439" cy="145" r="3" fill="#ccd4b7" opacity=".6" />
            </g>
          </g>
          <g className="garden-clouds" fill="currentColor">
            <path d="M73 158h100a14 14 0 0 0-16-15 25 25 0 0 0-48-6 18 18 0 0 0-36 21Z" />
            <path d="M274 205h66a10 10 0 0 0-12-11 18 18 0 0 0-33-6 14 14 0 0 0-21 17Z" opacity=".6" />
          </g>
          <path className="garden-distant-hill" d="M0 396Q109 358 226 397T600 378V540H0Z" />
          <path className="garden-ground" d="M0 429Q144 413 286 424T600 451V540H0Z" />
          <path className="garden-ground-line" d="M0 429Q144 413 286 424T600 451" fill="none" strokeWidth="2" />
          <ellipse className="robot-shadow" cx="233" cy="426" rx="75" ry="9" />
          <g className="garden-plant plant-large">
            <path d="M413 430Q407 378 426 323" fill="none" stroke="var(--stem)" strokeWidth="5" strokeLinecap="round" />
            <path d="M416 378Q373 379 374 339Q414 337 416 378Z" fill="var(--leaf-dark)" />
            <path d="M417 361Q419 318 460 319Q465 354 417 361Z" fill="var(--leaf)" />
            <path d="M426 335Q400 320 412 294Q440 301 426 335Z" fill="var(--leaf-light)" />
            <path d="M412 403Q443 367 472 391Q451 422 412 403Z" fill="var(--leaf-dark)" />
            <path d="M406 423h20" stroke="var(--stem)" strokeWidth="3" strokeLinecap="round" />
          </g>
          <g className="garden-plant plant-small">
            <path d="M357 429v-31" stroke="var(--stem)" strokeWidth="3" strokeLinecap="round" />
            <path d="M357 413Q336 415 336 394Q357 392 357 413Z" fill="var(--leaf-dark)" />
            <path d="M357 405Q358 382 378 385Q380 405 357 405Z" fill="var(--leaf-light)" />
          </g>
          <g className="robot-day">
            <g className="robot-watering">
              <svg x="132" y="210" width="225" height="216" viewBox="90 160 750 720">
                <image href={robotPoses} width="1536" height="1024" />
              </svg>
            </g>
            <g className="water-drops" stroke="#6bbbc9" strokeWidth="3" strokeLinecap="round">
              {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${342 + (i % 3) * 5} 366l2 5`} style={{ animationDelay: `${i * -.19}s` }} />)}
            </g>
          </g>
          <g className="robot-night">
            <g className="robot-breathing">
              <svg x="163" y="264" width="149" height="165" viewBox="985 360 465 530">
                <image href={robotPoses} width="1536" height="1024" />
              </svg>
            </g>
            <g className="sleep-letters" fill="#a4c9cb" fontFamily="monospace" fontWeight="bold">
              {[0, 1, 2].map(i => <text key={i} x="291" y="280" fontSize="18" style={{ animationDelay: `${i * -1.4}s` }}>z</text>)}
            </g>
          </g>
          <g stroke="var(--stem)" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".55">
            <path d="M74 451v-9m0 9-6-6m6 6 6-7M486 455v-9m0 9-6-6m6 6 6-7M319 478v-7m0 7 5-5" />
          </g>
          <g fill="var(--stem)" opacity=".22"><ellipse cx="127" cy="477" rx="4" ry="2" /><ellipse cx="446" cy="484" rx="5" ry="2" /><ellipse cx="541" cy="471" rx="3" ry="2" /></g>
        </svg>
      </div>
    </figure>
  );
}
