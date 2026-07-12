import './style.css'

const START = new Date('2026-07-13T00:00:00')
const END = new Date('2026-08-29T00:00:00')
const KEY = 'shiguang-study-v1'
const blessings = [
  '愿今日的每一笔，都在未来发出安静的光。',
  '把心放在当下，答案会从纸页深处慢慢浮起。',
  '愿你在微小的坚持里，遇见更辽阔的自己。',
  '风会记得每一次认真，时间也会。',
  '今日宜沉静，宜专注，宜把梦想写得清清楚楚。',
  '愿你所学皆有回响，所行皆有方向。',
  '慢一点也无妨，向前就是抵达。',
  '把难题拆成星星，一颗一颗点亮。',
  '愿清醒的晨光，替你守住心中的秩序。',
  '纸上有路，笔下有风，今天也会如愿生长。',
  '愿你不惧反复，所有熟练都来自温柔的坚持。',
  '每一个完成，都是写给未来的一封信。',
  '愿你在知识的森林里，拾得自己的月亮。',
  '今日的专注，是明日自由的底气。',
  '不必急着发光，先让自己成为一盏稳定的灯。',
  '愿你落笔有声，收笔有安。',
  '那些看似普通的日子，正悄悄替你积攒奇迹。',
  '晨光越过书页，也越过昨日未解的迷雾。',
  '愿你把耐心种进题目，等一场豁然开朗。',
  '窗外云行得慢，你也可以从容抵达。',
  '今日写下的答案，会成为明日笃定的回声。',
  '愿每一次停顿，都只是为了看清更远的路。',
  '把纷乱交给风，把清醒留在笔尖。',
  '愿你在一页一页之间，听见成长拔节的声音。',
  '星光不问赶路人，纸页却记得你的认真。',
  '今日所解的不只是题，也是心里的结。',
  '愿你的思绪如清泉，穿过每一道曲折。',
  '让安静成为力量，让专注成为方向。',
  '每一次重写，都是离准确更近的一次抵达。',
  '愿你眼里有题，心中有光，脚下有路。',
  '午后的风翻过一页，也替你翻开新的可能。',
  '不慌不忙地认真，便是今天最好的节奏。',
  '愿难题最终温柔，让答案如约而来。',
  '把今天写得充实，夜色便会格外安宁。',
  '愿你守住这一刻，像灯火守住漫长的夜。',
  '知识落在心上，便会长成看世界的眼睛。',
  '今日的每一寸进步，都值得被时间珍藏。',
  '愿你与清醒相伴，也与从容并肩。',
  '风从窗边经过，留下一个适合专心的下午。',
  '把不会的写下来，就是会了的第一行。',
  '愿你不被一时的难困住，始终相信下一步。',
  '页角微卷，墨迹渐深，你正在靠近答案。',
  '今日宜把心收拢，在细小处完成辽阔。',
  '愿努力不必喧哗，也能被未来一一听见。',
  '每一道想通的题，都为心里开了一扇窗。',
  '愿你携一身清澈，走过今日的文字与数字。',
  '合上书以前，愿你比清晨更相信自己。',
  '山高自有行路人，题深自有静心的答案。'
]

const state = {
  date: clampDate(new Date()),
  view: 'day',
  toolbar: false,
  data: load(),
  flip: ''
}

function iso(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` }
function parse(s) { return new Date(`${s}T00:00:00`) }
function clampDate(date) { return new Date(Math.min(END.getTime(), Math.max(START.getTime(), date.getTime()))) }
function addDays(date, n) { const d = new Date(date); d.setDate(d.getDate() + n); return clampDate(d) }
function shiftDays(date, n) { const d = new Date(date); d.setDate(d.getDate() + n); return d }
function dayIndex(date) { return (date.getDay() + 6) % 7 }
function cnDay(date) { return ['一', '二', '三', '四', '五', '六', '日'][date.getDay() === 0 ? 6 : date.getDay() - 1] }
function fmt(date) { return `${date.getMonth() + 1}月${date.getDate()}日` }
function within(date) { return date >= START && date <= END }
function weekStart(date) { return shiftDays(new Date(date.getFullYear(), date.getMonth(), date.getDate()), -dayIndex(date)) }

function defaultItems(date) {
  const weekday = date.getDay()
  if (weekday === 6) return []
  if (weekday === 0) return []
  const stem = [1, 3, 5].includes(weekday) ? ['语文点线面', '化学错题/知识点收集整理', '化学错题深研'] : ['英语教材深研', '数学错题/知识点收集整理', '数学错题深研']
  return [
    { text: stem[0], editable: false, done: false, waived: false },
    { text: stem[1], editable: false, done: false, waived: false },
    { text: stem[2], editable: false, done: false, waived: false },
    { text: '', prefix: '生物', editable: true, placeholder: '补充内容', done: false, waived: false },
    { text: '物理错题/知识点收集整理', editable: false, done: false, waived: false },
    { text: '', editable: true, placeholder: '', done: false, waived: false },
    { text: '', prefix: '生物课本', suffix: '阅读研习', editable: true, placeholder: '', done: false, waived: false },
    { text: '物理错题深研', editable: false, done: false, waived: false }
  ]
}

function normalizeItems(date, items = []) {
  return defaultItems(date).map((template, index) => {
    const old = items[index] || {}
    return {
      ...template,
      text: template.editable ? String(old.text || '') : template.text,
      done: Boolean(old.done),
      flagged: Boolean(old.flagged),
      waived: Boolean(old.waived)
    }
  })
}

function entryFor(date) {
  const key = iso(date)
  if (!state.data.entries[key]) {
    state.data.entries[key] = { items: defaultItems(date), journal: '', saturdayItems: [{ text: '', done: false, waived: false }], spin: { used: false, extra: 0 }, blessingLiked: false }
    save()
  }
  const entry = state.data.entries[key]
  if (date.getDay() >= 1 && date.getDay() <= 5 && (!entry.templateVersion || entry.templateVersion < 2)) {
    entry.items = normalizeItems(date, entry.items)
    entry.templateVersion = 2
    save()
  }
  if (!entry.spin) entry.spin = { used: false, extra: 0 }
  if (!entry.spin.history) entry.spin.history = []
  if (!entry.saturdayItems) entry.saturdayItems = entry.goal ? entry.goal.split('\n').map(text => ({ text: text.replace(/^\s*\d+[.、]\s*/, ''), done: false, waived: false })) : [{ text: '', done: false, waived: false }]
  return entry
}
function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return { entries: {}, favorites: [], createdAt: '2026-07-08' }
}
function save() { localStorage.setItem(KEY, JSON.stringify(state.data)) }
function blessing(date) { return blessings[Math.floor((date - START) / 86400000) % blessings.length] }

function dateLabel(date) { return `${date.getFullYear()} · ${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}` }
function titleFor(date) {
  if (date.getDay() === 6) return '今日总目标'
  if (date.getDay() === 0) return '本周回望'
  return `周${cnDay(date)} · ${fmt(date)}`
}

function render() {
  const root = document.querySelector('#app')
  const pageMotion = state.flip
  state.flip = ''
  root.innerHTML = `<div class="app-shell ${state.view === 'day' ? 'is-day' : ''}">
    ${renderHeader()}
    <main class="main-content ${pageMotion}">${renderView()}</main>
    ${state.view === 'day' ? renderFooter() : ''}
    ${state.toolbar ? renderToolbar() : ''}
    <div id="toast" class="toast" aria-live="polite"></div>
  </div>`
  bind()
}

function turnToDate(target, direction) {
  const nextDate = clampDate(target)
  if (iso(nextDate) === iso(state.date)) return
  const currentPage = document.querySelector('.main-content')
  if (currentPage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const rect = currentPage.getBoundingClientRect()
    const ghost = currentPage.cloneNode(true)
    ghost.className = `page-turn-ghost turn-${direction}`
    ghost.setAttribute('aria-hidden', 'true')
    Object.assign(ghost.style, {
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`
    })
    document.body.appendChild(ghost)
    requestAnimationFrame(() => ghost.classList.add('is-turning'))
    setTimeout(() => ghost.remove(), 720)
  }
  state.date = nextDate
  state.view = 'day'
  state.flip = `page-enter-${direction}`
  render()
}

function renderHeader() {
  const date = state.date
  const isDay = state.view === 'day'
  return `<header class="topbar">
    <button class="icon-btn menu-btn" data-action="toolbar" aria-label="打开工具栏">☰</button>
    <div class="brand-mark"><span class="brand-dot"></span><span>拾光清单</span></div>
    <div class="top-actions">
      ${isDay ? `<button class="icon-btn" data-action="prev" aria-label="前一天">‹</button><button class="date-chip" data-action="pick-date">${dateLabel(date)} <small>周${cnDay(date)}</small></button><button class="icon-btn" data-action="next" aria-label="后一天">›</button>` : `<span class="view-kicker">${viewName()}</span>`}
    </div>
    <button class="icon-btn" data-action="spin-open" aria-label="摸鱼大转盘" title="摸鱼大转盘">◎</button>
  </header>`
}

function viewName() { return { week: '周视图', month: '月视图', weeklyStats: '本周统计', allStats: '总统计', favorites: '赠语收藏' }[state.view] || '日视图' }

function renderView() {
  if (state.view === 'day') return renderDay()
  if (state.view === 'week') return renderWeek()
  if (state.view === 'month') return renderMonth()
  if (state.view === 'weeklyStats') return renderWeeklyStats(weekStart(state.date))
  if (state.view === 'allStats') return renderAllStats()
  return renderFavorites()
}

function renderDay() {
  const date = state.date
  const entry = entryFor(date)
  if (date.getDay() === 0) return renderWeeklyStats(weekStart(date))
  if (date.getDay() === 6) return `<section class="day-page saturday-page"><div class="blessing-row">${renderBlessing(date)}</div><div class="day-heading"><span class="eyebrow">${dateLabel(date)} · 周六</span><h1>今日总目标</h1><button class="text-btn" data-action="week-stats">本周统计 ↗</button></div>${entry.waivedSaturday ? '<div class="waiver-banner">✦ 今日已由转盘免单，安心休息</div>' : ''}<div class="goal-sheet"><div class="saturday-list">${entry.saturdayItems.map((item, i) => renderSaturdayTask(item, i)).join('')}</div><div class="goal-rule"></div><div class="sheet-hint">每一次落笔，都是向前一步</div></div>${renderDailyActions(entry)}</section>`
  return `<section class="day-page"><div class="blessing-row">${renderBlessing(date)}</div><div class="day-heading"><span class="eyebrow">${dateLabel(date)} · 周${cnDay(date)}</span><h1>${titleFor(date)}</h1><button class="text-btn" data-action="week-stats">本周统计 ↗</button></div><div class="task-list">${entry.items.map((item, i) => renderTask(item, i)).join('')}</div>${renderDailyActions(entry)}<section class="journal"><div class="section-label"><span>日结 / 日记</span><span class="line"></span><span class="muted" data-journal-count>${countChars(entry.journal)} 字</span></div><textarea data-journal placeholder="把今天留在这里……">${escape(entry.journal)}</textarea></section></section>`
}

function renderDailyActions(entry) {
  const claimed = Boolean(entry.paperRewardClaimed)
  const exhausted = (state.data.paperRewards || 0) >= 3
  return `<div class="daily-actions"><button class="outline-btn" data-action="spin-open">◌ 今日转盘</button><button class="outline-btn" data-action="complete-paper" ${claimed || exhausted ? 'disabled' : ''}>${claimed ? '✓ 今日试卷奖励已领取' : exhausted ? '✓ 假期奖励已领满' : '✦ 完成试卷 · 额外抽奖'}</button></div>`
}

function claimPaperReward() {
  const entry = entryFor(state.date)
  if (entry.paperRewardClaimed) return toast('同一天只能领取一次试卷奖励')
  if ((state.data.paperRewards || 0) >= 3) return toast('整个假期最多额外 3 次')
  entry.paperRewardClaimed = true
  state.data.paperRewards = (state.data.paperRewards || 0) + 1
  entry.spin.extra++
  save()
  toast(`已获得额外抽奖机会 · 假期 ${state.data.paperRewards}/3`)
  return true
}

function renderBlessing(date) {
  const liked = entryFor(date).blessingLiked
  return `<div class="blessing"><button class="blessing-copy" data-action="copy-blessing" data-blessing-date="${iso(date)}" title="点击复制">“${blessing(date)}”</button><button class="heart-btn ${liked ? 'liked' : ''}" data-action="like-blessing" data-blessing-date="${iso(date)}" aria-label="收藏赠语">${liked ? '♥' : '♡'}</button></div>`
}

function renderTask(item, index, date) {
  const disabled = !item.editable
  const status = item.waived ? 'waived' : item.done ? 'done' : item.flagged ? 'flagged' : ''
  const content = disabled
    ? `<span class="task-text">${escape(item.text)}</span>`
    : `<span class="task-composite ${item.prefix ? 'has-prefix' : ''} ${item.suffix ? 'has-suffix' : ''}">${item.prefix ? `<span>${escape(item.prefix)}</span>` : ''}<input class="task-input" data-task-input value="${escape(item.text)}" placeholder="${escape(item.placeholder || '')}" aria-label="第 ${index + 1} 项补充内容" />${item.suffix ? `<span>${escape(item.suffix)}</span>` : ''}</span>`
  return `<div class="task-row ${status}" data-index="${index}"><button class="check-btn" data-action="toggle-task" aria-label="${item.done ? '标记未完成' : '标记完成'}">${item.waived ? '✦' : item.done ? '✓' : item.flagged ? '!' : '○'}</button><span class="task-no">${index + 1}.</span>${content}<span class="task-tail"></span></div>`
}

function renderSaturdayTask(item, index) {
  const status = item.waived ? 'waived' : item.done ? 'done' : item.flagged ? 'flagged' : ''
  return `<div class="task-row saturday-task ${status}" data-saturday-index="${index}"><button class="check-btn" data-action="toggle-saturday" aria-label="切换完成状态">${item.done ? '✓' : item.waived ? '✦' : item.flagged ? '!' : '○'}</button><span class="task-no">${index + 1}.</span><input class="task-input" data-saturday-input value="${escape(item.text)}" placeholder="写下目标" /><button class="remove-task" data-action="remove-saturday" aria-label="删除本项">×</button></div>`
}

function renderFooter() { return `<footer class="page-footer"><span>2026.07.13 — 08.29</span></footer>` }

function renderToolbar() {
  return `<aside class="toolbar"><div class="toolbar-head"><span>工具栏</span><button class="icon-btn" data-action="toolbar">×</button></div><button data-action="day-view">▣ <span>日视图</span></button><button data-action="week-view">▤ <span>周视图</span></button><button data-action="month-view">▦ <span>月视图</span></button><button data-action="week-stats">◒ <span>本周统计</span></button><button data-action="all-stats">◌ <span>总统计</span></button><button data-action="favorites">♡ <span>赠语收藏</span></button><div class="toolbar-note">已保存 · ${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</div></aside>`
}

function renderWeek() {
  const start = weekStart(state.date)
  const end = new Date(Math.min(END, shiftDays(start, 6)))
  return `<section class="overview-page"><div class="overview-head"><div><span class="eyebrow">${dateLabel(start)} — ${fmt(end)}</span><h1>一周 · 轻轻展开</h1></div><button class="text-btn" data-action="day-view">回到今日 ↗</button></div><div class="week-grid">${Array.from({ length: 7 }, (_, i) => renderMiniDay(shiftDays(start, i))).join('')}</div></section>`
}

function renderMiniDay(date) {
  if (!within(date)) return `<article class="mini-day out-of-range" aria-hidden="true"><div class="mini-top"><span>周${cnDay(date)}</span><b>${date.getDate()}</b></div><div class="mini-items"><div class="muted">不在计划期</div></div></article>`
  const entry = entryFor(date)
  const items = date.getDay() === 0 ? [] : date.getDay() === 6 ? entry.saturdayItems.filter(x => x.text.trim()).slice(0, 3).map(x => x.text) : entry.items.map(taskDisplayText).filter(Boolean).slice(0, 4)
  const done = date.getDay() === 6 ? entry.saturdayItems.filter(x => x.text.trim() && (x.done || x.waived || entry.waivedSaturday)).length : entry.items.filter(x => taskDisplayText(x) && (x.done || x.waived)).length
  return `<article class="mini-day ${date.getDay() === 0 ? 'sunday' : ''} ${iso(date) === iso(state.date) ? 'selected' : ''}" data-date="${iso(date)}"><div class="mini-top"><span>周${cnDay(date)}</span><b>${date.getDate()}</b></div><div class="mini-blessing">${date.getDay() === 0 ? '回望与整理' : blessing(date)}</div><div class="mini-items">${items.length ? items.map(t => `<div>— ${escape(t)}</div>`).join('') : '<div class="muted">留白</div>'}</div><div class="mini-progress">${date.getDay() !== 0 ? `${done} 项完成` : '查看统计'}</div></article>`
}

function renderMonth() {
  const year = state.date.getFullYear(); const month = state.date.getMonth(); const first = new Date(year, month, 1); const days = new Date(year, month + 1, 0).getDate(); const offset = (first.getDay() + 6) % 7
  const cells = Array.from({ length: offset + days }, (_, i) => { if (i < offset) return '<div class="month-cell empty"></div>'; const d = new Date(year, month, i - offset + 1); if (!within(d)) return `<div class="month-cell out-of-range"><span>${d.getDate()}</span><small>计划期外</small></div>`; const e = entryFor(d); const tasks = d.getDay() === 6 ? e.saturdayItems.filter(x => x.text.trim()) : e.items.filter(x => taskDisplayText(x)); const total = tasks.length; const done = tasks.filter(x => x.done || x.waived || (d.getDay() === 6 && e.waivedSaturday)).length; return `<button class="month-cell ${iso(d) === iso(state.date) ? 'selected' : ''} ${d.getDay() === 0 ? 'sunday' : ''}" data-date="${iso(d)}"><span>${d.getDate()}</span><i style="--p:${total ? done / total : 0}"></i><small>${d.getDay() === 0 ? '统计' : total ? `${done}/${total}` : '—'}</small></button>` })
  return `<section class="overview-page month-page"><div class="overview-head"><div><span class="eyebrow">${year} 年</span><h1>${month + 1} 月 · 留下痕迹</h1></div><button class="text-btn" data-action="day-view">回到今日 ↗</button></div><div class="weekday-head">${['一','二','三','四','五','六','日'].map(x => `<span>${x}</span>`).join('')}</div><div class="month-grid">${cells.join('')}</div></section>`
}

function taskDisplayText(item) { return `${item.prefix || ''}${item.text || ''}${item.suffix || ''}`.trim() }
function countChars(value) { return Array.from(String(value || '').replace(/\s/g, '')).length }
function weekDates(start) { return Array.from({ length: 6 }, (_, i) => shiftDays(start, i)).filter(within) }
function statsFor(start) {
  const dates = weekDates(start); let planned = 0; let done = 0; let words = 0; let journalWords = 0; const subjects = { 语文: 0, 英语: 0, 数学: 0, 化学: 0, 生物: 0, 物理: 0 }; const unfinished = []
  dates.forEach(d => { const e = entryFor(d); const saturday = d.getDay() === 6; const source = saturday ? e.saturdayItems : e.items; const textFor = saturday ? x => String(x.text || '').trim() : taskDisplayText; words += source.reduce((sum, x) => sum + countChars(textFor(x)), 0); journalWords += countChars(e.journal); source.forEach((x, i) => { const text = textFor(x); if (!text) return; planned++; if (x.done || x.waived || (saturday && e.waivedSaturday)) done++; else { unfinished.push({ date: d, text, index: i }); if (!saturday && i !== 5) { let subject = ''; if (i < 3) subject = [1, 3, 5].includes(d.getDay()) ? ['语文', '化学', '化学'][i] : ['英语', '数学', '数学'][i]; else if (i === 3 || i === 6) subject = '生物'; else if (i === 4 || i === 7) subject = '物理'; if (subject) subjects[subject]++ } } }) })
  return { planned, done, unfinished, words, journalWords, subjects }
}

function renderWeeklyStats(start) {
  const s = statsFor(start); const percent = s.planned ? Math.round(s.done / s.planned * 100) : 0
  const pageDate = within(shiftDays(start, 6)) ? shiftDays(start, 6) : END
  return `<section class="stats-page"><div class="stats-head"><div><span class="eyebrow">${dateLabel(start)} — ${fmt(new Date(Math.min(END.getTime(), shiftDays(start, 6).getTime())))}</span><h1>本周回望</h1></div><button class="text-btn" data-action="day-view">回到日视图 ↗</button></div><div class="blessing-row">${renderBlessing(pageDate)}</div><div class="stat-hero"><div class="ring" style="--p:${percent}%"><span>${percent}<small>%</small></span></div><div><div class="stat-caption">完成率</div><div class="stat-big">${s.done}<small> / ${s.planned} 项</small></div><div class="stat-sub">${s.unfinished.length ? `还有 ${s.unfinished.length} 项等待你` : '本周全部完成，漂亮。'}</div></div></div><div class="stat-cards"><div><span>计划字数</span><b>${s.words}</b></div><div><span>日结字数</span><b>${s.journalWords}</b></div><div><span>未完成</span><b class="danger">${s.unfinished.length}</b></div></div><div class="subject-board"><div class="section-label"><span>未完成分布</span><span class="line"></span><span class="muted">按学科</span></div><div class="subject-bars">${Object.entries(s.subjects).map(([k,v]) => `<div><span>${k}</span><i><em style="width:${s.planned ? Math.min(100, v / Math.max(1, s.planned) * 100 * 3) : 0}%"></em></i><b>${v}</b></div>`).join('')}</div></div><div class="unfinished-list"><div class="section-label"><span>仍在等待的事</span><span class="line"></span></div>${s.unfinished.length ? s.unfinished.map(x => `<div class="unfinished-item"><span>${fmt(x.date)}</span><b>${escape(x.text)}</b></div>`).join('') : '<div class="empty-state">这一周没有遗憾。</div>'}</div></section>`
}

function renderAllStats() {
  let total = { planned: 0, done: 0, words: 0, journalWords: 0, unfinished: 0 }, fullWeeks = 0, weeks = []; let cursor = new Date(START)
  while (cursor <= END) { const s = statsFor(cursor); total.planned += s.planned; total.done += s.done; total.words += s.words; total.journalWords += s.journalWords; total.unfinished += s.unfinished.length; if (s.unfinished.length === 0) fullWeeks++; weeks.push({ start: new Date(cursor), unfinished: s.unfinished.length, done: s.done }); cursor = new Date(cursor); cursor.setDate(cursor.getDate() + 7) }
  const prizes = state.data.prizes || []; const pct = total.planned ? Math.round(total.done / total.planned * 100) : 0; const lucky = Math.min(100, Math.round(pct * .72 + fullWeeks * 4 + prizes.length * 3)); const prizeKinds = prizes.reduce((a,p) => { a[p.kind] = (a[p.kind] || 0) + 1; return a }, {})
  return `<section class="stats-page all-stats"><div class="stats-head"><div><span class="eyebrow">2026.07.13 — 08.29</span><h1>总统计 · 这段时光</h1></div><button class="text-btn" data-action="day-view">回到日视图 ↗</button></div><div class="all-hero"><div class="stat-big">${pct}<small>% 完成率</small></div><div class="hero-note">${blessing(state.date)}</div></div><div class="stat-cards"><div><span>总计划字数</span><b>${total.words}</b></div><div><span>总日结字数</span><b>${total.journalWords}</b></div><div><span>满勤周数</span><b>${fullWeeks}<small> / ${weeks.length}</small></b></div></div><div class="lucky-panel"><div><span class="eyebrow">欧皇指数</span><b>${lucky}</b><small> / 100</small></div><p>以完成率、满勤周与中奖次数综合计算。愿好运落在认真之后。</p></div><div class="prize-summary"><div><span>中奖次数</span><b>${prizes.length}</b></div><div><span>中奖项目分布</span><p>${Object.keys(prizeKinds).length ? Object.entries(prizeKinds).map(([k,v]) => `${k} × ${v}`).join(' · ') : '尚未中奖'}</p></div></div><div class="week-bars"><div class="section-label"><span>按周分布</span><span class="line"></span><span class="muted">未完成项</span></div>${weeks.map((w,i) => `<div class="week-bar"><span>第 ${i + 1} 周</span><i><em style="width:${Math.min(100, w.unfinished * 14)}%"></em></i><b>${w.unfinished}</b></div>`).join('')}</div></section>`
}

function renderFavorites() {
  const favs = [...(state.data.favorites || [])].sort((a,b) => a.time - b.time)
  return `<section class="favorites-page"><div class="stats-head"><div><span class="eyebrow">愿你记得</span><h1>赠语收藏</h1></div><button class="text-btn" data-action="day-view">回到日视图 ↗</button></div><div class="favorites-list">${favs.length ? favs.map(f => `<article><span>${new Date(f.time).toLocaleDateString('zh-CN')}</span><p>“${escape(f.text)}”</p><button class="icon-btn" data-remove-favorite="${f.time}">×</button></article>`).join('') : '<div class="empty-state">还没有收藏的句子。<br/>遇见喜欢的赠语，就把它留下。</div>'}</div></section>`
}

function escape(value = '') { return String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])) }
function toast(text) { const el = document.querySelector('#toast'); if (!el) return; el.textContent = text; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 1800) }
function persistField(target, value) { const e = entryFor(state.date); if (target === 'journal') e.journal = value; if (target === 'goal') e.goal = value; save() }
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
  } catch (_) {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    textarea.remove()
  }
}

function spinWeights() {
  const weights = [90.999,1,1,1,1,1,1,1,1,.5,.1,.1,.1,.1,.1,.001]
  const nextWorkday = nextDateMatching(d => d.getDay() >= 1 && d.getDay() <= 5)
  if (nextWorkday && !entryFor(nextWorkday).items[5].text.trim() && confirm('下一个工作日的第 6 项为空。确认留空并将这 1% 平分给其余七项吗？\n取消则保留第 6 项的 1% 概率。')) {
    weights[6] = 0
    const share = 1 / 7
    ;[1, 2, 3, 4, 5, 7, 8].forEach(i => { weights[i] += share })
  }
  return weights
}

function spin() {
  const entry = entryFor(state.date)
  if (entry.spin.used && entry.spin.extra <= 0) return toast('今天的转盘已经转过啦，明天再来。')
  const wheel = document.querySelector('.wheel')
  const actionButton = document.querySelector('.spin-modal .primary-btn')
  if (!wheel) return
  const weights = spinWeights()
  wheel.classList.add('is-spinning')
  if (actionButton) actionButton.disabled = true
  setTimeout(() => resolveSpin(weights), 1250)
}

function resolveSpin(weights) {
  const e = entryFor(state.date); const available = !e.spin.used || e.spin.extra > 0
  if (!available) return toast('今天的转盘已经转过啦，明天再来。')
  if (e.spin.used) e.spin.extra--
  e.spin.used = true
  const outcomes = ['再接再厉', ...Array.from({ length: 8 }, (_, i) => `免下一个工作日任务 ${i + 1}`), '免周六努力', '免周一全天', '免周二全天', '免周三全天', '免周四全天', '免周五全天', '免下一周工作日']
  let r = Math.random() * weights.reduce((sum, weight) => sum + weight, 0); let result = outcomes[0]
  for (let i = 0; i < weights.length; i++) { r -= weights[i]; if (r <= 0) { result = outcomes[i]; break } }
  if (result !== '再接再厉') applyPrize(result)
  e.spin.history.push({ result, time: Date.now() })
  save()
  closeModal()
  render()
  showSpin()
}

function nextDateMatching(test) { let d = new Date(state.date); do { d.setDate(d.getDate() + 1) } while (d <= END && !test(d)); return d <= END ? d : null }
function recordPrize(kind, label, targets) { state.data.prizes ||= []; state.data.prizes.push({ kind, label, wonAt: iso(state.date), targets: targets.map(iso), time: Date.now() }) }
function confirmBlankSix(targets, label) {
  const blankDates = targets.filter(date => date.getDay() >= 1 && date.getDay() <= 5 && !entryFor(date).items[5].text.trim())
  if (!blankDates.length) return true
  return confirm(`${label}中有 ${blankDates.length} 天的第 6 项仍为空。确认保持空白，并免除其余已有任务吗？`)
}
function applyPrize(result) {
  const taskMatch = result.match(/任务 (\d)/)
  if (taskMatch) {
    let index = Number(taskMatch[1]) - 1
    const target = nextDateMatching(d => d.getDay() >= 1 && d.getDay() <= 5)
    if (!target) return
    const entry = entryFor(target)
    entry.items[index].waived = true; entry.items[index].done = false; recordPrize('单项免单', result, [target]); return
  }
  if (result === '免周六努力') { const target = nextDateMatching(d => d.getDay() === 6); if (!target) return; const entry = entryFor(target); entry.waivedSaturday = true; entry.saturdayItems.forEach(x => { x.waived = true; x.done = false }); recordPrize('周六免单', result, [target]); return }
  if (result === '免下一周工作日') { const monday = nextDateMatching(d => d.getDay() === 1); if (!monday) return; const targets = Array.from({ length: 5 }, (_, i) => shiftDays(monday, i)).filter(within); if (!confirmBlankSix(targets, '下一周工作日')) return; targets.forEach(d => entryFor(d).items.forEach(x => { x.waived = true; x.done = false })); recordPrize('整周免单', result, targets); return }
  const names = ['周日','周一','周二','周三','周四','周五','周六']; const name = result.slice(1,3); const wanted = names.indexOf(name); const target = nextDateMatching(d => d.getDay() === wanted)
  if (!target) return
  if (!confirmBlankSix([target], name)) return
  const entry = entryFor(target); entry.items.forEach(x => { x.waived = true; x.done = false }); recordPrize('全天免单', result, [target])
}

function showSpin() {
  const e = entryFor(state.date); const used = e.spin.used && e.spin.extra <= 0; const history = e.spin.history || []; const latest = history.at(-1); const legacyResult = used && !latest
  const resultCard = latest ? `<div class="spin-result"><span>今日第 ${history.length} 次</span><strong>${escape(latest.result)}</strong><time>${new Date(latest.time).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</time></div>` : legacyResult ? `<div class="spin-result legacy"><span>今日结果</span><strong>旧版本未保存</strong></div>` : ''
  const canSpin = !used
  const paperDisabled = e.paperRewardClaimed || (state.data.paperRewards || 0) >= 3
  const paperLabel = e.paperRewardClaimed ? '今日试卷奖励已领取' : (state.data.paperRewards || 0) >= 3 ? '假期试卷奖励已领满' : '完成试卷 · 额外抽一次'
  const modal = document.createElement('div'); modal.className = 'modal-backdrop'; modal.innerHTML = `<div class="spin-modal ${latest || legacyResult ? 'show-result' : ''}"><button class="modal-close" data-action="close-modal" aria-label="关闭转盘">×</button><div class="eyebrow">MOMENT OF LUCK</div><h2>摸鱼大转盘</h2><div class="wheel"><div class="wheel-pointer">▼</div><div class="wheel-core">◎</div></div>${resultCard}${canSpin && e.spin.extra ? `<p class="spin-availability">剩余 ${e.spin.extra} 次</p>` : ''}<button class="primary-btn" data-action="${canSpin ? 'spin' : 'close-modal'}">${canSpin ? latest ? '再转一次' : '开始转动' : latest ? '收下结果' : '关闭'}</button><button class="paper-claim" data-modal-paper ${paperDisabled ? 'disabled' : ''}>${paperLabel}</button></div>`
  document.body.appendChild(modal)
  modal.querySelectorAll('[data-action="close-modal"]').forEach(button => button.addEventListener('click', closeModal))
  modal.querySelector('[data-action="spin"]')?.addEventListener('click', spin)
  modal.querySelector('[data-modal-paper]')?.addEventListener('click', () => { if (claimPaperReward()) { closeModal(); render(); showSpin() } })
  modal.addEventListener('click', e => { if (e.target === modal) closeModal() })
}
function closeModal() { document.querySelector('.modal-backdrop')?.remove() }

function showDatePicker() {
  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `<form class="date-modal"><button type="button" class="modal-close" data-action="close-modal" aria-label="关闭日期选择">×</button><div class="eyebrow">SELECT A DAY</div><h2>去往某一天</h2><input type="date" name="date" min="${iso(START)}" max="${iso(END)}" value="${iso(state.date)}" /><button class="primary-btn" type="submit">翻到这一天</button></form>`
  document.body.appendChild(modal)
  modal.querySelector('[data-action="close-modal"]').addEventListener('click', closeModal)
  modal.addEventListener('click', event => { if (event.target === modal) closeModal() })
  modal.querySelector('form').addEventListener('submit', event => {
    event.preventDefault()
    const selected = parse(new FormData(event.currentTarget).get('date'))
    if (!within(selected)) return
    const direction = selected < state.date ? 'prev' : 'next'
    closeModal()
    turnToDate(selected, direction)
  })
}

function bind() {
  document.querySelectorAll('[data-action]').forEach(btn => btn.addEventListener('click', () => {
    const action = btn.dataset.action
    if (action === 'toolbar') state.toolbar = !state.toolbar
    else if (action === 'prev') return turnToDate(addDays(state.date, -1), 'prev')
    else if (action === 'next') return turnToDate(addDays(state.date, 1), 'next')
    else if (action === 'pick-date') return showDatePicker()
    else if (action === 'toggle-task') { const row = btn.closest('.task-row'); const item = entryFor(state.date).items[Number(row.dataset.index)]; if (!item.waived) { if (item.done) { item.done = false; item.flagged = true } else { item.done = true; item.flagged = false } } save() }
    else if (action === 'toggle-saturday') { const row = btn.closest('.saturday-task'); const item = entryFor(state.date).saturdayItems[Number(row.dataset.saturdayIndex)]; if (!item.waived) { if (item.done) { item.done = false; item.flagged = true } else { item.done = true; item.flagged = false } } save() }
    else if (action === 'remove-saturday') { const e = entryFor(state.date); const index = Number(btn.closest('.saturday-task').dataset.saturdayIndex); if (e.saturdayItems.length > 1) e.saturdayItems.splice(index, 1); else e.saturdayItems[0] = { text: '', done: false, waived: false }; save() }
    else if (action === 'like-blessing') { const blessingDate = parse(btn.dataset.blessingDate || iso(state.date)); const e = entryFor(blessingDate); e.blessingLiked = !e.blessingLiked; state.data.favorites = (state.data.favorites || []).filter(x => x.date !== iso(blessingDate)); if (e.blessingLiked) state.data.favorites.push({ date: iso(blessingDate), text: blessing(blessingDate), time: Date.now() }); save() }
    else if (action === 'copy-blessing') { const blessingDate = parse(btn.dataset.blessingDate || iso(state.date)); copyText(blessing(blessingDate)); toast('已复制') }
    else if (action === 'week-stats') { state.view = 'weeklyStats'; state.toolbar = false }
    else if (action === 'all-stats') { state.view = 'allStats'; state.toolbar = false }
    else if (action === 'favorites') { state.view = 'favorites'; state.toolbar = false }
    else if (action === 'day-view') { state.view = 'day'; state.toolbar = false }
    else if (action === 'week-view') { state.view = 'week'; state.toolbar = false }
    else if (action === 'month-view') { state.view = 'month'; state.toolbar = false }
    else if (action === 'spin-open') return showSpin()
    else if (action === 'spin') return spin()
    else if (action === 'close-modal') return closeModal()
    else if (action === 'complete-paper') claimPaperReward()
    render()
  }))
  document.querySelectorAll('[data-task-input]').forEach(input => input.addEventListener('input', () => { const row = input.closest('.task-row'); entryFor(state.date).items[Number(row.dataset.index)].text = input.value; save() }))
  document.querySelectorAll('[data-saturday-input]').forEach(input => {
    input.addEventListener('input', () => { const row = input.closest('.saturday-task'); entryFor(state.date).saturdayItems[Number(row.dataset.saturdayIndex)].text = input.value; save() })
    input.addEventListener('keydown', event => { if (event.key !== 'Enter') return; event.preventDefault(); const e = entryFor(state.date); const index = Number(input.closest('.saturday-task').dataset.saturdayIndex); e.saturdayItems.splice(index + 1, 0, { text: '', done: false, waived: false }); save(); render(); document.querySelector(`[data-saturday-index="${index + 1}"] [data-saturday-input]`)?.focus() })
  })
  document.querySelector('[data-journal]')?.addEventListener('input', e => { persistField('journal', e.target.value); const count = document.querySelector('[data-journal-count]'); if (count) count.textContent = `${countChars(e.target.value)} 字` })
  document.querySelector('[data-goal]')?.addEventListener('input', e => persistField('goal', e.target.value))
  document.querySelectorAll('[data-date]').forEach(el => el.addEventListener('click', () => { const selected = parse(el.dataset.date); if (!within(selected)) return; turnToDate(selected, selected < state.date ? 'prev' : 'next') }))
  document.querySelectorAll('[data-remove-favorite]').forEach(el => el.addEventListener('click', () => { state.data.favorites = state.data.favorites.filter(x => x.time !== Number(el.dataset.removeFavorite)); save(); render() }))
  const surface = document.querySelector('.main-content')
  if (surface) {
    let startX = 0; let startY = 0; let pinchStart = 0
    surface.addEventListener('touchstart', e => {
      if (e.touches.length === 1) { startX = e.touches[0].clientX; startY = e.touches[0].clientY }
      if (e.touches.length === 2) pinchStart = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY)
    }, { passive: true })
    surface.addEventListener('touchend', e => {
      if (e.changedTouches.length !== 1) return
      const dx = e.changedTouches[0].clientX - startX; const dy = e.changedTouches[0].clientY - startY
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) && state.view === 'day') turnToDate(addDays(state.date, dx < 0 ? 1 : -1), dx < 0 ? 'next' : 'prev')
    }, { passive: true })
    surface.addEventListener('touchmove', e => {
      if (e.touches.length !== 2 || !pinchStart) return
      e.preventDefault()
      const distance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY)
      if (pinchStart - distance > 85) {
        if (state.view === 'day') state.view = 'week'
        else if (state.view === 'week') state.view = 'month'
        else return
        pinchStart = 0; render()
      } else if (distance - pinchStart > 85) {
        if (state.view === 'month') state.view = 'week'
        else if (state.view === 'week') state.view = 'day'
        else return
        pinchStart = 0; render()
      }
    }, { passive: false })
  }
}

// Safari exposes a separate gesture event path for native pinch zoom.
// Cancelling it keeps the two-finger gesture reserved for app view changes.
document.addEventListener('gesturestart', event => event.preventDefault(), { passive: false })
document.addEventListener('gesturechange', event => event.preventDefault(), { passive: false })

render()

// Keep the active daily page aligned with midnight when the app remains open.
let activeDayKey = iso(new Date())
setInterval(() => {
  const currentDayKey = iso(new Date())
  if (currentDayKey === activeDayKey) return
  const previousDayKey = activeDayKey
  activeDayKey = currentDayKey
  if (state.view === 'day' && iso(state.date) === previousDayKey && within(new Date())) {
    turnToDate(new Date(), 'next')
  }
}, 60000)
