let total = 600, remaining = 600, timer = null, running = false, pw = null;
let title = 'SUNDAY SERVICE', message = 'Welcome';

let endTime = 0;
let isTimeUp = false;

const $ = id => document.getElementById(id);

function fmt(s) {
    let m = Math.floor(s / 60), ss = s % 60;
    return String(m).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
}

/* =====================
   COLOR RULES (SAFE + CLEAN)
===================== */
function getState(seconds) {
    if (seconds <= 60 && seconds > 0) return "amber";
    if (seconds <= 120 && seconds > 60) return "yellow";
    return "normal";
}

/* =====================
   MAIN RENDER
===================== */
function render() {
    $('pTitle').textContent = title;
    $('pMsg').textContent = message;
    $('pTimer').textContent = fmt(remaining);
    $('status').textContent = running ? 'Running' : (isTimeUp ? 'TIME UP' : 'Stopped');

    // =====================
    // MAIN SCREEN COLORS
    // =====================
    const state = getState(remaining);

    if (!isTimeUp) {
        if (state === "yellow") {
            $('pTimer').style.color = "#FFD700";
        }
        else if (state === "amber") {
            $('pTimer').style.color =
                (Math.floor(Date.now() / 500) % 2 === 0)
                    ? '#ffbf00'
                    : '#ff6f00';
        }
        else {
            $('pTimer').style.color = '';
        }
    } else {
        $('pTimer').style.color = 'red';
    }

    // =====================
    // PROJECTOR SYNC
    // =====================
    if (pw && !pw.closed) {
        let d = pw.document;

        // TIME UP LOCK SCREEN
        if (isTimeUp) {
            d.body.className = 'up';
            d.getElementById('wrap').innerHTML =
                '<div class="uptext">TIME UP</div>';
            return;
        }

        d.body.className = '';

        d.getElementById('t').textContent = title;
        d.getElementById('tm').textContent = fmt(remaining);
        d.getElementById('m').textContent = message;

        // Projector colors
        const state2 = getState(remaining);
        let timerEl = d.getElementById('tm');

        if (state2 === "yellow") {
            timerEl.style.color = "#FFD700";
        }
        else if (state2 === "amber") {
            timerEl.style.color =
                (Math.floor(Date.now() / 500) % 2 === 0)
                    ? '#ffbf00'
                    : '#ff6f00';
        }
        else {
            timerEl.style.color = '#fff';
        }
    }
}

/* =====================
   TIMER ENGINE (NO DRIFT)
===================== */
function tick() {
    if (!running || isTimeUp) return;

    remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
    render();

    if (remaining === 0) {
        clearInterval(timer);
        running = false;
        isTimeUp = true;
        render();
    }
}

/* =====================
   LIVE SYNC LOOP
===================== */
setInterval(render, 250);

/* =====================
   START
===================== */
$('startBtn').onclick = () => {
    if (running || isTimeUp) return;

    running = true;
    endTime = Date.now() + remaining * 1000;

    timer = setInterval(tick, 250);
    render();
};

/* =====================
   PAUSE
===================== */
$('pauseBtn').onclick = () => {
    if (isTimeUp) return;

    clearInterval(timer);
    running = false;

    remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
    render();
};

/* =====================
   STOP
===================== */
$('stopBtn').onclick = () => {
    clearInterval(timer);
    running = false;
    remaining = total;
    render();
};

/* =====================
   RESET (FULL FIX)
===================== */
$('resetBtn').onclick = () => {
    clearInterval(timer);

    running = false;
    remaining = total;
    isTimeUp = false;

    if (pw && !pw.closed) {
        pw.document.body.className = '';
        pw.document.body.innerHTML = `
        <div id="wrap">
            <div id="t" class="title"></div>
            <div id="tm" class="timer"></div>
            <div id="m" class="msg"></div>
        </div>`;
    }

    render();
};

/* =====================
   TITLE (SAFE)
===================== */
$('titleBtn').onclick = () => {
    title = $('titleInput').value;
    render();
};

/* =====================
   MESSAGE (ALLOW BLANK)
===================== */
$('messageBtn').onclick = () => {
    message = $('messageInput').value;
    render();
};

/* =====================
   TIME SET
===================== */
$('timeBtn').onclick = () => {
    if (isTimeUp) return;

    let m = parseInt($('minutesInput').value);
    if (m > 0) {
        total = m * 60;
        remaining = total;
        render();
    }
};

/* =====================
   PROJECTOR OPEN
===================== */
$('projBtn').onclick = () => {
    if (!pw || pw.closed) {
        pw = window.open('', 'Projector');

        pw.document.write(`<!doctype html>
<html>
<head>
<style>
body{
    margin:0;
    background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color:#fff;
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
    font-family:Segoe UI;
}
#wrap{text-align:center;width:100%;backdrop-filter:blur(10px);padding:60px;border-radius:20px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2)}
.title{font-size:72px;font-weight:900;margin-bottom:30px;letter-spacing:2px}
.timer{font-size:220px;font-weight:900;margin:30px 0;font-variant-numeric:tabular-nums}
.msg{font-size:58px;color:#ffd54f;margin-top:30px;font-weight:600}

.up{background:#900;animation:f .5s infinite}
.uptext{font-size:180px;font-weight:900;animation:b .5s infinite}

@keyframes b{50%{opacity:.2}}
@keyframes f{50%{background:#d00}}
</style>
</head>
<body>
<div id="wrap">
    <div id="t" class="title"></div>
    <div id="tm" class="timer"></div>
    <div id="m" class="msg"></div>
</div>
</body>
</html>`);

        pw.document.close();
    }

    render();
};

/* =====================
   INIT
===================== */
render();