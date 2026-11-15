/* Scenes of the video.
   `text`   : the voiceover, word for word. `|` only marks where one caption ends
              and the next begins (tools/verify.js checks the text against script/voiceover.txt).
   `visual` : storyboard note for the editor.
   `html`   : the motion graphics. `data-at="<word>"` starts an element's animation when that
              word is spoken (`word#2` = second occurrence, `w3` = 4th word of the scene,
              `start` / `end`, optional `+0.3` / `-0.2` seconds offset). */
(function (g) {
  const em = (e) => `<span class="em">${e}</span>`;
  const hex = (at, extra = '') =>
    `<svg class="hex a-pop ${extra}" data-at="${at}" viewBox="0 0 100 100"><polygon points="50,5 90,28 90,72 50,95 10,72 10,28"/></svg>`;
  const cubes = (n, at, step) =>
    Array.from({ length: n }, (_, i) =>
      `<i class="cube a-pop" data-at="${at}+${(i * step).toFixed(2)}" data-dur="0.35"></i>`).join('');
  const arrowDown = (at) =>
    `<svg class="arrow-v" viewBox="0 0 60 110"><path class="a-draw" data-at="${at}" data-dur="0.45" pathLength="1" d="M30 6 V96 M10 74 L30 98 L50 74"/></svg>`;
  const arrowLeft = (at) =>
    `<svg class="arrow-h" viewBox="0 0 110 60"><path class="a-draw" data-at="${at}" data-dur="0.45" pathLength="1" d="M104 30 H14 M36 10 L12 30 L36 50"/></svg>`;
  const who = (at, cls = '') =>
    `<div class="card who ${cls} a-rise" data-at="${at}">${em('🌍')}<b>منظمة الصحة العالمية</b></div>`;
  const liver =
    `<svg class="liver" viewBox="0 0 200 130"><path d="M18 42 C55 6 150 8 184 34 C202 50 192 82 160 92 C122 102 84 112 44 122 C14 128 4 72 18 42Z"/></svg>`;

  g.SCENES = [
    {
      id: 'hook', accent: 'lime',
      text: 'فدقيقة غادي تفهم | شنو هي الكربوهيدرات، | شنو كتدير فجسمكً | وشكون فيهم اللي خاصك تاكل | او لي تراكز عليه',
      visual: 'Stopwatch ring sweeps for the whole scene. Title slams in, then the three questions slide in one by one as they are spoken.',
      html: `
        <div class="vis">
          <div class="timer a-pop" data-at="start">
            <svg viewBox="0 0 200 200">
              <circle class="ring-bg" cx="100" cy="100" r="88"/>
              <circle class="ring a-draw" cx="100" cy="100" r="88" pathLength="1" transform="rotate(-90 100 100)"
                      data-at="start" data-until="end" data-ease="linear"/>
            </svg>
            <div class="timer-in">${em('⏱️')}<b>فدقيقة</b></div>
          </div>
          <div class="h1 a-rise" data-at="الكربوهيدرات-0.3">الكربوهيدرات</div>
          <div class="stack">
            <div class="q a-slide-r" data-at="شنو-0.1"><i>1</i><b>شنو هي</b></div>
            <div class="q a-slide-r" data-at="شنو#2-0.1"><i>2</i><b>شنو كتدير فجسمكً</b></div>
            <div class="q hot a-slide-r" data-at="وشكون-0.1"><i>3</i><b>وشكون فيهم اللي خاصك تاكل</b></div>
          </div>
        </div>`,
    },
    {
      id: 'what', accent: 'lime',
      text: 'الكربوهيدرات بي خلاصة هيا | خبز بطاطا روز | عدس ديسر سكر | هدو كاملين بنسبة جسم ديالك | راه كارب | حيت كاعما كيفرق بيناتهم مزيان',
      visual: 'Six food cards pop in on each word, all get the same outline, then merge under one big "كارب" badge.',
      html: `
        <div class="vis">
          <div class="kicker a-fade" data-at="start">الكربوهيدرات</div>
          <div class="grid3">
            <div class="food a-pop" data-at="خبز">${em('🍞')}<b>خبز</b><u class="a-fade" data-at="هدو"></u></div>
            <div class="food a-pop" data-at="بطاطا">${em('🥔')}<b>بطاطا</b><u class="a-fade" data-at="هدو+0.08"></u></div>
            <div class="food a-pop" data-at="روز">${em('🍚')}<b>روز</b><u class="a-fade" data-at="هدو+0.16"></u></div>
            <div class="food a-pop" data-at="عدس">${em('🥣')}<b>عدس</b><u class="a-fade" data-at="هدو+0.24"></u></div>
            <div class="food a-pop" data-at="ديسر">${em('🍰')}<b>ديسر</b><u class="a-fade" data-at="هدو+0.32"></u></div>
            <div class="food a-pop" data-at="سكر"><span class="cubes mini"><i class="cube"></i><i class="cube"></i><i class="cube"></i></span><b>سكر</b><u class="a-fade" data-at="هدو+0.4"></u></div>
          </div>
          ${arrowDown('راه-0.35')}
          <div class="badge-big a-pop" data-at="كارب-0.2">كارب</div>
        </div>`,
    },
    {
      id: 'glucose', accent: 'lime',
      text: 'ملي كتاكلها، | جسمك كيردها سكر صغير | سميتو الجلوكوز. | وهادا هو ليصانص ديالك | باش يخدم',
      visual: 'Food breaks down into small glucose hexagons; a fuel bar then fills up.',
      html: `
        <div class="vis">
          <div class="bigem a-pop" data-at="start">🍞</div>
          ${arrowDown('كيردها-0.1')}
          <div class="hexes">
            ${hex('سكر')}${hex('سكر+0.08')}${hex('سكر+0.16')}${hex('سكر+0.24')}${hex('سكر+0.32')}${hex('سكر+0.4')}
          </div>
          <div class="label-accent a-rise" data-at="الجلوكوز-0.15">الجلوكوز</div>
          <div class="card fuel a-rise" data-at="وهادا-0.15">
            ${em('⛽')}
            <div class="fuel-mid">
              <b>ليصانص</b>
              <div class="track"><i class="fill a-grow-x" data-at="ليصانص" data-dur="1.5"></i></div>
            </div>
            <span class="em a-pop" data-at="يخدم-0.1">⚡</span>
          </div>
        </div>`,
    },
    {
      id: 'storage', accent: 'lime',
      text: 'جسم كياخد منو شوية | والباقي كيتخبا | فالعضلاّت والكبدة',
      visual: 'A little glucose is used right away; the rest fills two storage tanks: muscles and liver.',
      html: `
        <div class="vis">
          <div class="hexes">
            ${hex('start')}${hex('start+0.06')}${hex('start+0.12')}${hex('start+0.18')}${hex('start+0.24')}
          </div>
          <div class="chip solo a-pop" data-at="شوية-0.2">${em('⚡')}<b>شوية</b></div>
          ${arrowDown('والباقي-0.1')}
          <div class="tanks">
            <div class="tank a-rise" data-at="والباقي">
              <i class="lvl a-grow-y" data-at="w6-0.1" data-dur="1.3"></i>
              ${em('💪')}<b>عضلات</b>
            </div>
            <div class="tank a-rise" data-at="والباقي+0.12">
              <i class="lvl a-grow-y" data-at="والكبدة-0.1" data-dur="1.3"></i>
              ${liver}<b>الكبدة</b>
            </div>
          </div>
        </div>`,
    },
    {
      id: 'gym', accent: 'lime',
      text: 'وهادك لي تخبا في عضلات | هو اللي كتخدم بيه فالصال | فاش كتبغي تهز تقل',
      visual: 'Lifter pumping with energy rings; the muscle store bar drains as it powers the lift.',
      html: `
        <div class="vis">
          <div class="lifter a-pop" data-at="start">
            <i class="pulse" style="--k:0"></i><i class="pulse" style="--k:.33"></i><i class="pulse" style="--k:.66"></i>
            <span class="em bob">🏋️</span>
          </div>
          <div class="card fuel a-rise" data-at="عضلات-0.3">
            ${em('💪')}
            <div class="fuel-mid">
              <b>عضلات</b>
              <div class="track"><i class="fill drain"></i></div>
            </div>
            <span class="em a-pop" data-at="كتخدم-0.1">⚡</span>
          </div>
        </div>`,
    },
    {
      id: 'recap', accent: 'lime',
      text: 'يعني كارب كان في لول | تحول غليكوز | عطانا طاقة',
      visual: 'Three-step chain builds top to bottom: carb → glucose → energy.',
      html: `
        <div class="vis chain">
          <div class="node a-pop" data-at="كارب-0.15">${em('🍞')}<b>كارب</b></div>
          ${arrowDown('تحول-0.15')}
          <div class="node a-pop" data-at="غليكوز-0.15"><svg class="hex still" viewBox="0 0 100 100"><polygon points="50,5 90,28 90,72 50,95 10,72 10,28"/></svg><b>غليكوز</b></div>
          ${arrowDown('عطانا-0.15')}
          <div class="node win a-pop" data-at="طاقة-0.15">${em('⚡')}<b>طاقة</b></div>
        </div>`,
    },
    {
      id: 'types', accent: 'lime',
      text: 'الأنواع | «كاينين جوج',
      visual: 'Chapter card. Title, then two colour-coded cards split apart (coral = fast, mint = slow).',
      html: `
        <div class="vis">
          <div class="h1 a-rise" data-at="start">الأنواع</div>
          <div class="duo">
            <div class="tcard fast a-slide-r" data-at="جوج-0.35">${em('🍩')}</div>
            <div class="tcard slow a-slide-l" data-at="جوج-0.2">${em('🌾')}</div>
          </div>
          <div class="badge-big a-pop" data-at="جوج-0.05">جوج</div>
        </div>`,
    },
    {
      id: 'fast', accent: 'coral',
      text: 'النوع السريع: | السكر، المونادا، | العصير، الحلويات. | هد نوع كيدخل للدم بالزربة | وكيخرج بالزربة | دغيا كيتقدا | وما كيشبعش',
      visual: 'Coral theme. Four fast-carb chips, then a blood-sugar curve that spikes and crashes; "doesn\'t fill you up" stamp.',
      html: `
        <div class="vis">
          <div class="h2 a-rise" data-at="start">النوع السريع</div>
          <div class="chips2">
            <div class="chip a-pop" data-at="السكر-0.1"><span class="cubes mini"><i class="cube"></i><i class="cube"></i></span><b>السكر</b></div>
            <div class="chip a-pop" data-at="المونادا-0.1">${em('🥤')}<b>المونادا</b></div>
            <div class="chip a-pop" data-at="العصير-0.1">${em('🧃')}<b>العصير</b></div>
            <div class="chip a-pop" data-at="الحلويات-0.1">${em('🍩')}<b>الحلويات</b></div>
          </div>
          <div class="card graph a-rise" data-at="هد-0.25">
            <span class="em gdrop">🩸</span>
            <svg viewBox="0 0 800 360">
              <path class="axis" d="M40 20 V330 H770"/>
              <path class="curve a-draw" pathLength="1" data-at="كيدخل" data-until="بالزربة+0.45" d="M40 318 C150 318 180 60 262 48"/>
              <path class="curve a-draw" pathLength="1" data-at="وكيخرج" data-until="كيتقدا+0.3" d="M262 48 C344 40 360 322 480 324 L760 324"/>
            </svg>
          </div>
          <div class="stamp a-pop" data-at="وما-0.05"><i>✕</i><b>ما كيشبعش</b></div>
        </div>`,
    },
    {
      id: 'slow', accent: 'mint',
      text: 'نوع تاني | البطيء: | خبز الشعير ولا القمح الكامل، | الرز، البطاطا، | العدس، اللوبيا، | الخضرة، الفواكه. | هادو فيهم الألياف، | كيعطيوك طاقة مدة طويلة | وكيشبعوك',
      visual: 'Mint theme. Eight slow-carb chips, a fibre badge, then a long gentle energy curve; "keeps you full" stamp.',
      html: `
        <div class="vis tight">
          <div class="kicker a-fade" data-at="start">نوع تاني</div>
          <div class="h2 a-rise" data-at="البطيء-0.2">البطيء</div>
          <div class="chips2 small">
            <div class="chip a-pop" data-at="خبز-0.1">${em('🍞')}<b>خبز الشعير</b></div>
            <div class="chip a-pop" data-at="القمح-0.1">${em('🌾')}<b>القمح الكامل</b></div>
            <div class="chip a-pop" data-at="الرز-0.1">${em('🍚')}<b>الرز</b></div>
            <div class="chip a-pop" data-at="البطاطا-0.1">${em('🥔')}<b>البطاطا</b></div>
            <div class="chip a-pop" data-at="العدس-0.1">${em('🥣')}<b>العدس</b></div>
            <div class="chip a-pop" data-at="اللوبيا-0.1">${em('🫘')}<b>اللوبيا</b></div>
            <div class="chip a-pop" data-at="الخضرة-0.1">${em('🥦')}<b>الخضرة</b></div>
            <div class="chip a-pop" data-at="الفواكه-0.1">${em('🍎')}<b>الفواكه</b></div>
          </div>
          <div class="card graph short a-rise" data-at="هادو-0.25">
            <div class="tag a-pop" data-at="الألياف-0.1">الألياف</div>
            <svg viewBox="0 0 800 280">
              <path class="axis" d="M40 16 V250 H770"/>
              <path class="curve a-draw" pathLength="1" data-at="كيعطيوك" data-until="طويلة+0.5" d="M40 240 C150 236 210 110 340 98 C480 86 640 96 760 150"/>
            </svg>
          </div>
          <div class="stamp ok a-pop" data-at="وكيشبعوك-0.05"><i>✓</i><b>كيشبعوك</b></div>
        </div>`,
    },
    {
      id: 'which', accent: 'mint',
      text: 'واخا شكون مزيان فيهم | واخا باين شكون لي صحي',
      visual: 'Fast vs slow side by side; the slow card grows and gets the "healthy" tick while the fast card fades back.',
      html: `
        <div class="vis">
          <div class="h2 plain a-rise" data-at="start">شكون مزيان فيهم</div>
          <div class="duo tall">
            <div class="a-dim" data-at="باين">
              <div class="tcard fast a-slide-r" data-at="start+0.1">${em('🍩')}<b>النوع السريع</b></div>
            </div>
            <div class="a-win" data-at="باين">
              <div class="tcard slow a-slide-l" data-at="start+0.25">${em('🌾')}<b>البطيء</b></div>
            </div>
          </div>
          <div class="stamp ok a-pop" data-at="صحي-0.15"><i>✓</i><b>صحي</b></div>
        </div>`,
    },
    {
      id: 'study', accent: 'lime',
      text: 'هد دراسة طلبتها | منظمة الصحة العالمية. | الباحثين جمعو الدراسات | اللي تدارت تقريباً 40 عام،',
      visual: 'WHO source card, a fan of study papers stacking up, then a big counter running to 40 years.',
      html: `
        <div class="vis">
          <div class="kicker a-fade" data-at="start">دراسة</div>
          ${who('منظمة-0.25')}
          <div class="papers">
            <i class="paper a-pop" style="--r:-16deg;--x:-190px" data-at="الدراسات-0.3"></i>
            <i class="paper a-pop" style="--r:-8deg;--x:-95px" data-at="الدراسات-0.2"></i>
            <i class="paper a-pop" style="--r:0deg;--x:0px" data-at="الدراسات-0.1"></i>
            <i class="paper a-pop" style="--r:8deg;--x:95px" data-at="الدراسات"></i>
            <i class="paper a-pop" style="--r:16deg;--x:190px" data-at="الدراسات+0.1"></i>
          </div>
          <div class="bignum a-pop" data-at="40-0.3"><span class="num" data-count="40" data-at="40-0.3" data-dur="1.3">0</span><small>عام</small></div>
        </div>`,
    },
    {
      id: 'result', accent: 'lime',
      text: 'وشافو الناس اللي كياكلو | بزاف ديال الألياف والحبوب الكاملة، | والناس اللي كياكلو قليل. | لقاو بلي اللي كياكلو أكثر، | عندهم خطر أقل | ديال بزاف ديال الأمراض | بحال القلب والسكري.',
      visual: 'Two groups compared; the high-fibre group lights up, then the heart and diabetes risk bars shrink.',
      html: `
        <div class="vis">
          <div class="grp a-slide-r" data-at="بزاف-0.25">${em('🌾')}<b>بزاف ديال الألياف والحبوب الكاملة</b><u class="a-fade" data-at="أكثر-0.2"></u></div>
          <div class="grp low a-slide-l" data-at="قليل-0.35">${em('🍽️')}<b>قليل</b></div>
          <div class="card risk a-rise" data-at="عندهم-0.25">
            <div class="risk-h"><b>خطر أقل</b><span class="down a-pop" data-at="أقل-0.1">↓</span></div>
            <div class="rrow a-fade" data-at="القلب-0.3">${em('❤️')}<b>القلب</b>
              <div class="track"><i class="fill shrink" data-at="القلب" data-dur="1.1"></i></div></div>
            <div class="rrow a-fade" data-at="والسكري-0.3">${em('🩸')}<b>السكري</b>
              <div class="track"><i class="fill shrink" data-at="والسكري" data-dur="1.1"></i></div></div>
          </div>
        </div>`,
    },
    {
      id: 'advice', accent: 'lime',
      text: 'والنصيحة ديالهم: | كل على الأقل 25 غرام | ديال الألياف فالنهار، | وبدل الخبز البيض | بالخبز الكامل.»',
      visual: 'Ring gauge counts up to 25 g of fibre a day, then white bread is crossed out and swapped for whole-grain bread.',
      html: `
        <div class="vis">
          <div class="kicker a-fade" data-at="start">النصيحة ديالهم</div>
          <div class="gauge a-pop" data-at="كل-0.25">
            <svg viewBox="0 0 400 400">
              <circle class="ring-bg" cx="200" cy="200" r="176"/>
              <circle class="ring a-draw" cx="200" cy="200" r="176" pathLength="1" transform="rotate(-90 200 200)" data-at="25-0.2" data-dur="1.4"/>
            </svg>
            <div class="gauge-in"><small>على الأقل</small><span class="num" data-count="25" data-at="25-0.2" data-dur="1.4">0</span><small>غرام</small></div>
          </div>
          <div class="label-accent a-rise" data-at="الألياف-0.2">الألياف فالنهار</div>
          <div class="swap a-rise" data-at="وبدل-0.25">
            <div class="sw off">${em('🥖')}<b>الخبز البيض</b><i class="strike a-grow-x" data-at="البيض+0.1" data-dur="0.4"></i></div>
            ${arrowLeft('بالخبز-0.3')}
            <div class="sw on a-pop" data-at="بالخبز-0.1">${em('🍞')}<b>الخبز الكامل</b></div>
          </div>
        </div>`,
    },
    {
      id: 'formula', accent: 'lime',
      text: 'ألياف + حبوب كاملة | = صحة أحسن',
      visual: 'Equation card assembles piece by piece; the result tile lands in the accent colour.',
      html: `
        <div class="vis formula">
          <div class="tile a-pop" data-at="w0-0.15">${em('🥦')}<b>ألياف</b></div>
          <div class="op a-pop" data-at="w1-0.1">+</div>
          <div class="tile a-pop" data-at="w2-0.15">${em('🌾')}<b>حبوب كاملة</b></div>
          <div class="op a-pop" data-at="w4-0.1">=</div>
          <div class="tile win a-pop" data-at="w5-0.15">${em('💚')}<b>صحة أحسن</b></div>
        </div>`,
    },
    {
      id: 'limit', accent: 'coral',
      text: 'منظمة الصحة العالمية كتقول: | السكر الزايد خاصو يكون | أقل من 10% | من الماكلة ديالك فالنهار.',
      visual: 'Coral theme. Donut chart of the day\'s food; a thin 10% slice is drawn for added sugar while the counter runs to 10%.',
      html: `
        <div class="vis">
          ${who('start', 'small')}
          <div class="gauge donut a-pop" data-at="السكر-0.3">
            <svg viewBox="0 0 400 400">
              <circle class="ring-bg" cx="200" cy="200" r="160"/>
              <circle class="ring a-draw" cx="200" cy="200" r="160" pathLength="10" transform="rotate(-90 200 200)" data-at="10%-0.2" data-dur="1.2"/>
            </svg>
            <div class="gauge-in"><small>أقل من</small><span class="num" data-count="10" data-suffix="%" data-at="10%-0.2" data-dur="1.2">0%</span></div>
          </div>
          <div class="legend">
            <div class="a-rise" data-at="الزايد-0.2"><i class="dot hot"></i><b>السكر الزايد</b></div>
            <div class="a-rise" data-at="الماكلة-0.2"><i class="dot"></i><b>الماكلة ديالك فالنهار</b></div>
          </div>
        </div>`,
    },
    {
      id: 'soda', accent: 'coral',
      text: 'وقرعة مونادا وحدة | فيها تقريباً 40 غرام | ديال السكر. | يعني قرعة ديال موندا صغير هذي | تقدر تقرب للحد | ديال النهار كامل',
      visual: 'One soda can, counter to 40 g, sugar cubes stack up, then the daily-limit bar fills almost to the line.',
      html: `
        <div class="vis">
          <div class="sodarow">
            <div class="can a-pop" data-at="start"><i></i></div>
            <div class="sodanum">
              <div class="bignum a-pop" data-at="40-0.3"><span class="num" data-count="40" data-at="40-0.3" data-dur="1.1">0</span><small>غرام</small></div>
              <b class="sub a-fade" data-at="السكر-0.3">ديال السكر</b>
            </div>
          </div>
          <div class="cubes row">${cubes(10, '40-0.2', 0.11)}</div>
          <div class="card limit a-rise" data-at="يعني-0.25">
            <b>الحد ديال النهار</b>
            <div class="track big"><i class="fill a-grow-x" data-at="تقدر-0.1" data-dur="1.6"></i><i class="mark"></i></div>
          </div>
        </div>`,
    },
    {
      id: 'swaps', accent: 'mint',
      text: 'يعني بلاصة الخبز البيض، | كل خبز الشعير. | بلاصة العصير، | كل الفاكية. | وزيد العدس ولا اللوبيا | مرة ولا جوج فالسيمانة.»',
      visual: 'Mint theme. Three action rows: white bread → barley bread, juice → fruit, plus lentils/beans with a week tracker lighting two days.',
      html: `
        <div class="vis">
          <div class="swap a-rise" data-at="بلاصة-0.25">
            <div class="sw off">${em('🥖')}<b>الخبز البيض</b><i class="strike a-grow-x" data-at="البيض+0.1" data-dur="0.4"></i></div>
            ${arrowLeft('كل-0.3')}
            <div class="sw on a-pop" data-at="كل-0.1">${em('🍞')}<b>خبز الشعير</b></div>
          </div>
          <div class="swap a-rise" data-at="بلاصة#2-0.25">
            <div class="sw off">${em('🧃')}<b>العصير</b><i class="strike a-grow-x" data-at="العصير+0.1" data-dur="0.4"></i></div>
            ${arrowLeft('كل#2-0.3')}
            <div class="sw on a-pop" data-at="كل#2-0.1">${em('🍎')}<b>الفاكية</b></div>
          </div>
          <div class="card plus a-rise" data-at="وزيد-0.25">
            <div class="plus-row">
              <span class="plus-sign">+</span>
              <div class="chip a-pop" data-at="العدس-0.1">${em('🥣')}<b>العدس</b></div>
              <div class="chip a-pop" data-at="اللوبيا-0.1">${em('🫘')}<b>اللوبيا</b></div>
            </div>
            <div class="week a-fade" data-at="مرة-0.3">
              <i class="a-lit" data-at="مرة-0.05"></i><i></i><i></i><i class="a-lit" data-at="جوج-0.05"></i><i></i><i></i><i></i>
              <b>فالسيمانة</b>
            </div>
          </div>
        </div>`,
    },
    {
      id: 'outro', accent: 'lime', hold: 1.2,
      text: 'الكربوهيدرات مهيمن صحة ديالنا | غير خاصك تختار | نوع صحي ليك',
      visual: 'Closing card. Healthy foods orbit the title; the final line lands as an accent badge and holds.',
      html: `
        <div class="vis">
          <div class="orbit a-fade" data-at="start">
            <span class="em" style="--i:0">🍞</span><span class="em" style="--i:1">🌾</span><span class="em" style="--i:2">🥣</span>
            <span class="em" style="--i:3">🍎</span><span class="em" style="--i:4">🥦</span><span class="em" style="--i:5">🍚</span>
            <div class="h1 a-rise" data-at="start">الكربوهيدرات</div>
          </div>
          <div class="stamp ok big a-pop" data-at="نوع-0.2"><i>✓</i><b>نوع صحي ليك</b></div>
        </div>`,
    },
  ];
})(typeof window !== 'undefined' ? window : globalThis);
