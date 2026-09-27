// A Git-style graph: every line starts at its recorded month and merges at
// its recorded end month. Rows expand around the cards, like a commit log.
const MONTHS_PER_YEAR = 12;
const PRESENT_DATE = "present";
const HISTORY_LAYOUT = {
    // Keep this breakpoint in sync with the history styles in index.css.
    mobileBreakpointPx: 767,
    rows: {
        firstY: 74,
        cardTopOffset: 10,
        minimumCardHeight: 108,
        cardGap: 42,
        yearHeight: 70,
        boundaryHeight: 58,
        bottomPadding: 12
    },
    lines: {
        mainStartY: 44,
        mainEndPadding: 28,
        maxCurvePx: 22,
        curveSpanFraction: 1 / 5,
        curveReachFactor: 2,
        activeEndOffset: 14
    },
    nodes: {
        milestoneRadius: 6,
        startRadius: 4,
        mergeRadius: 5,
        activeRadius: 6
    },
    // Positions are fractions of the graph column width. The extra work lane
    // keeps ABC Labs separate from the overlapping Blue Reply work.
    tracks: {
        desktop: { main: .5, lanes: { "-2": .14, "-1": .31, "1": .69, "2": .86 } },
        mobile: { main: .18, lanes: { "-2": .43, "-1": .58, "1": .73, "2": .88 } }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const timeline = document.getElementById("history-timeline");
    if (!timeline) return;

    const svg = timeline.querySelector(".history-lines");
    const years = timeline.querySelector(".history-years");
    const events = Array.from(timeline.querySelectorAll(".event"));
    const svgNamespace = "http://www.w3.org/2000/svg";
    const monthNumber = (value) => {
        const [year, month] = value.split("-").map(Number);
        return year * MONTHS_PER_YEAR + month - 1;
    };
    const currentMonth = () => {
        const now = new Date();
        return now.getFullYear() * MONTHS_PER_YEAR + now.getMonth();
    };
    const dateNumber = (value) => value === PRESENT_DATE ? currentMonth() : monthNumber(value);
    const draw = (tag, attributes, className) => {
        const element = document.createElementNS(svgNamespace, tag);
        Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
        element.setAttribute("class", className);
        svg.appendChild(element);
    };

    events.sort((a, b) => dateNumber(b.dataset.end) - dateNumber(a.dataset.end));
    events.forEach((event) => timeline.appendChild(event));
    timeline.classList.add("history-ready");

    let pending = false;
    function schedule() {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
            pending = false;
            render();
        });
    }

    function render() {
        const mobile = window.matchMedia(`(max-width: ${HISTORY_LAYOUT.mobileBreakpointPx}px)`).matches;
        const trackLayout = mobile ? HISTORY_LAYOUT.tracks.mobile : HISTORY_LAYOUT.tracks.desktop;
        const plotWidth = svg.getBoundingClientRect().width;
        const mainX = plotWidth * trackLayout.main;
        const laneX = Object.fromEntries(
            Object.entries(trackLayout.lanes).map(([lane, fraction]) => [lane, plotWidth * fraction])
        );
        const starts = events.map((event) => dateNumber(event.dataset.start));
        const ends = events.map((event) => dateNumber(event.dataset.end));
        const first = Math.max(...ends);
        const last = Math.min(...starts);
        const months = new Set([...starts, ...ends]);
        const yearStarts = new Set();
        for (let year = Math.floor(last / MONTHS_PER_YEAR); year <= Math.floor(first / MONTHS_PER_YEAR); year++) {
            const january = year * MONTHS_PER_YEAR;
            if (january > last && january < first) {
                months.add(january);
                yearStarts.add(january);
            }
        }

        const positions = new Map();
        let y = HISTORY_LAYOUT.rows.firstY;
        [...months].sort((a, b) => b - a).forEach((month) => {
            positions.set(month, y);
            const cards = events.filter((event) => dateNumber(event.dataset.end) === month);
            const cardHeight = Math.max(0, ...cards.map((event) => event.offsetHeight));
            y += cards.length
                ? Math.max(HISTORY_LAYOUT.rows.minimumCardHeight, cardHeight + HISTORY_LAYOUT.rows.cardGap)
                : yearStarts.has(month) ? HISTORY_LAYOUT.rows.yearHeight : HISTORY_LAYOUT.rows.boundaryHeight;
        });
        const height = y + HISTORY_LAYOUT.rows.bottomPadding;
        timeline.style.height = `${height}px`;
        svg.setAttribute("viewBox", `0 0 ${plotWidth} ${height}`);
        svg.setAttribute("height", height);
        svg.replaceChildren();
        years.replaceChildren();

        draw("path", {
            d: `M ${mainX} ${HISTORY_LAYOUT.lines.mainStartY} V ${positions.get(last) + HISTORY_LAYOUT.lines.mainEndPadding}`
        }, "history-main-line");

        for (const event of events) {
            const start = dateNumber(event.dataset.start);
            const end = dateNumber(event.dataset.end);
            const startY = positions.get(start);
            const endY = positions.get(end);
            const branchX = laneX[event.dataset.lane];
            const category = event.classList.contains("event--work") ? "work"
                : event.classList.contains("event--community") ? "community" : "education";
            event.style.top = `${endY - HISTORY_LAYOUT.rows.cardTopOffset}px`;

            if (start === end) {
                draw("circle", { cx: mainX, cy: endY, r: HISTORY_LAYOUT.nodes.milestoneRadius }, `history-node history-node--${category}`);
                continue;
            }

            const curve = Math.min(HISTORY_LAYOUT.lines.maxCurvePx, (startY - endY) * HISTORY_LAYOUT.lines.curveSpanFraction);
            const curveReach = curve * HISTORY_LAYOUT.lines.curveReachFactor;
            const path = event.dataset.end === PRESENT_DATE
                ? `M ${mainX} ${startY} C ${mainX} ${startY - curve} ${branchX} ${startY - curve} ${branchX} ${startY - curveReach} V ${endY + HISTORY_LAYOUT.lines.activeEndOffset}`
                : `M ${mainX} ${startY} C ${mainX} ${startY - curve} ${branchX} ${startY - curve} ${branchX} ${startY - curveReach} V ${endY + curveReach} C ${branchX} ${endY + curve} ${mainX} ${endY + curve} ${mainX} ${endY}`;
            draw("path", { d: path }, `history-branch history-branch--${category}`);
            draw("circle", { cx: mainX, cy: startY, r: HISTORY_LAYOUT.nodes.startRadius }, `history-node history-node--${category}`);
            if (event.dataset.end === PRESENT_DATE) {
                draw("circle", { cx: branchX, cy: endY + HISTORY_LAYOUT.lines.activeEndOffset, r: HISTORY_LAYOUT.nodes.activeRadius }, `history-node history-node--${category}`);
            } else {
                draw("circle", { cx: mainX, cy: endY, r: HISTORY_LAYOUT.nodes.mergeRadius }, `history-node history-node--${category}`);
            }
        }

        for (const january of yearStarts) {
            const label = document.createElement("span");
            label.className = "history-year";
            label.textContent = String(Math.floor(january / MONTHS_PER_YEAR));
            label.style.top = `${positions.get(january)}px`;
            years.appendChild(label);
        }
    }

    const observer = new ResizeObserver(schedule);
    events.forEach((event) => observer.observe(event));
    window.addEventListener("resize", schedule);
    document.addEventListener("localechange", schedule);
    schedule();
});
