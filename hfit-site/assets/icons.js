/* H.FIT 기능 아이콘 세트 (B안): 이름 → [한글명, SVG 내용]. viewBox 0 0 40 40, 선 1.5 */
window.HFIT_ICONS = (function(){
  const A = 'M0 0'; // placeholder to keep editors calm
  const I = {
    "4-WAY STRETCH": ["4방향 신축", '<path d="M20 6v28M6 20h28"/><path d="M16 10l4-4 4 4M16 30l4 4 4-4M10 16l-4 4 4 4M30 16l4 4-4 4"/>'],
    "COMFORTABLE STRETCH": ["편안한 신축성", '<path d="M11 13c3 1.5 15 1.5 18 0v14c-3-1.5-15-1.5-18 0z"/><path d="M4 20h5M31 20h5M7 17l-3 3 3 3M33 17l3 3-3 3"/>'],
    "SYNTHETIC FABRIC": ["기능성 합성섬유", '<path d="M20 8l9 5v10l-9 5-9-5V13z"/><circle cx="20" cy="8" r="2"/><circle cx="29" cy="13" r="2"/><circle cx="29" cy="23" r="2"/><circle cx="20" cy="28" r="2"/><circle cx="11" cy="23" r="2"/><circle cx="11" cy="13" r="2"/><path d="M20 28v6M11 13l-5-3"/>'],
    "BREATHABLE": ["통기성", '<path d="M8 22h24"/><path d="M12 32c-2-3 2-5 0-8M20 32c-2-3 2-5 0-8M28 32c-2-3 2-5 0-8"/><path d="M12 18c-2-3 2-5 0-8M20 18c-2-3 2-5 0-8M28 18c-2-3 2-5 0-8"/><path d="M10 9l2-3 2 3M18 9l2-3 2 3M26 9l2-3 2 3"/>'],
    "BREATHABILITY": ["통기성", '<path d="M12 34c-3-4 3-7 0-11s3-7 0-11M20 34c-3-4 3-7 0-11s3-7 0-11M28 34c-3-4 3-7 0-11s3-7 0-11"/><path d="M10 9l2-3 2 3M18 9l2-3 2 3M26 9l2-3 2 3"/><path d="M5 23h30"/>'],
    "UV PROTECTION": ["자외선 차단", '<circle cx="16" cy="14" r="5"/><path d="M16 4v3M16 21v3M6 14h3M23 14h3M9 7l2 2M21 19l2 2M9 21l2-2M21 9l2-2"/><path d="M22 24l10-8M27 16h5v5"/><path d="M6 34h28"/><path d="M16 24v8" stroke-dasharray="2 2"/>'],
    "WRINKLE FREE": ["구김 방지", '<path d="M6 14c3-4 5 4 8 0s5 4 8 0 5 4 8 0 5 4 4 2"/><path d="M20 19v6M17 22l3 3 3-3"/><path d="M6 31h28"/>'],
    "COTTON": ["면 소재", '<path d="M20 22c-6 0-9-3-9-6 0-3 3-5 5-4 0-3 2-5 4-5s4 2 4 5c2-1 5 1 5 4 0 3-3 6-9 6z"/><path d="M20 22v13M20 29c-2-3-5-3-7-2M20 29c2-3 5-3 7-2"/>'],
    "SOFT TO THE TOUCH": ["부드러운 촉감", '<path d="M30 6c-9 2-14 9-15 18l-2 4"/><path d="M15 24c6 0 12-5 15-18"/><path d="M19 16l5 1M17 20l5 1"/><path d="M5 30c4-2 8 1 12 0s8-4 13-2c-2 4-7 6-12 6H8"/>'],
    "POCKETS FOR EASY CARE HANDLING": ["수납 포켓", '<path d="M9 8h22v15c0 3-1 5-4 7l-7 4-7-4c-3-2-4-4-4-7z"/><path d="M13 13h3M18.5 13h3M24 13h3"/><path d="M15 21l4 4 7-8"/>'],
    "WATER RESISTANT": ["방수", '<path d="M11 6c-2 4-4 6-4 8a4 4 0 008 0c0-2-2-4-4-8zM20 6c-2 4-4 6-4 8a4 4 0 008 0c0-2-2-4-4-8zM29 6c-2 4-4 6-4 8a4 4 0 008 0c0-2-2-4-4-8z"/><path d="M5 22h30M5 25h30"/><path d="M12 29c-1 2 1 3 0 5M20 29c-1 2 1 3 0 5M28 29c-1 2 1 3 0 5"/>'],
    "WINDPROOF": ["방풍", '<path d="M31 6v28M34 6v28"/><path d="M4 16h18c3 0 5-2 5-4s-2-4-4-4-3 1-4 2"/><path d="M4 24h18c3 0 5 2 5 4s-2 4-4 4-3-1-4-2"/><path d="M4 20h10"/>'],
    "MEMBRANE": ["멤브레인", '<path d="M8 5v8M16 5v8M24 5v8M32 5v8M6 11l2 2 2-2M14 11l2 2 2-2M22 11l2 2 2-2M30 11l2 2 2-2"/><path d="M5 18h30"/><circle cx="9" cy="23" r="1.6"/><circle cx="17" cy="23" r="1.6"/><circle cx="25" cy="23" r="1.6"/><circle cx="33" cy="23" r="1.6"/><circle cx="13" cy="30" r="1.6"/><circle cx="21" cy="30" r="1.6"/><circle cx="29" cy="30" r="1.6"/>'],
    "FEATHER FILLING": ["다운 충전", '<path d="M31 5C19 6 11 15 10 27"/><path d="M10 27c11 0 19-8 21-22"/><path d="M16 19l6 1M13 24l6 1M20 13l5 1"/><path d="M10 27l-4 8"/>'],
    "LESS WEIGHT": ["경량", '<path d="M13 15h14l4 17H9z"/><circle cx="20" cy="10" r="4"/><path d="M15 25h10"/>'],
    "HEAT RETENTION": ["보온", '<path d="M17 6a3 3 0 016 0v15a6 6 0 11-6 0z"/><circle cx="20" cy="26" r="3"/><path d="M20 23V11"/><path d="M29 16a12 12 0 01-1 17M30 33l-2 0 0-3"/><path d="M11 16a12 12 0 001 17"/>'],
    "HEAT": ["발열", '<path d="M20 4c2 6 10 9 10 18a10 10 0 01-20 0c0-5 3-8 5-10 0 4 2 6 3 6 0-6 0-9 2-14z"/><path d="M20 34a5 5 0 01-5-5c0-3 3-5 4-8 2 3 6 5 6 8a5 5 0 01-5 5z"/>'],
    "NON BREATHABLE": ["방풍 차단", '<path d="M30 6v28M34 6v28"/><path d="M5 12c4-3 8 3 12 0s8 3 12 0M5 20c4-3 8 3 12 0s8 3 12 0M5 28c4-3 8 3 12 0s8 3 12 0"/>'],
    "ANTI BACTERIAL": ["항균", '<circle cx="20" cy="20" r="14"/><path d="M10 10l20 20"/><ellipse cx="16" cy="17" rx="4" ry="2.5" transform="rotate(-30 16 17)"/><ellipse cx="24" cy="24" rx="4" ry="2.5" transform="rotate(-30 24 24)"/><path d="M13 13l-2-2M27 27l2 2M21 14l2-2"/>']
  };
  return { get(name){ const v = I[String(name).toUpperCase()]; return v ? { ko: v[0], svg: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${v[1]}</svg>` } : null; } };
})();
