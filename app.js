(() => {
  const KATEX_OPTS = {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true }
    ],
    throwOnError: false
  };

  function renderMath(el) {
    if (window.renderMathInElement) {
      window.renderMathInElement(el || document.body, KATEX_OPTS);
    }
  }

  /* ================= 1. Reading Progress & Sticky TOC ================= */
  const progressBar = document.getElementById("progressBar");
  const tocLinks = Array.from(document.querySelectorAll(".toc-link"));
  const sections = tocLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  function updateScrollUI() {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? Math.min(100, Math.max(0, (window.scrollY / docH) * 100)) : 0;
    progressBar.style.width = `${pct.toFixed(2)}%`;

    let activeIdx = 0;
    const offset = 120;
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= offset) {
        activeIdx = i;
      }
    }
    tocLinks.forEach((link, idx) => {
      link.classList.toggle("active", idx === activeIdx);
    });
  }

  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  // Mobile TOC drawer toggle
  const mobileTocBtn = document.getElementById("mobileTocBtn");
  const tocRail = document.getElementById("tocRail");
  if (mobileTocBtn && tocRail) {
    mobileTocBtn.addEventListener("click", () => {
      tocRail.classList.toggle("open");
    });
    tocLinks.forEach((link) => {
      link.addEventListener("click", () => {
        tocRail.classList.remove("open");
      });
    });
  }

  /* ================= 2. 9-Paper Atlas ================= */
  const PAPERS = [
    {
      id: "geo",
      fam: 379,
      num: "#1 · 引擎",
      core: true,
      cnTitle: "渐近张量谱中的欧氏几何",
      enTitle: "Euclidean geometry in the asymptotic spectrum of tensors",
      leanStatus: "partial",
      leanBadge: "有限维已形式化",
      claim: "在任意域 $k$ 和实 Hilbert 空间 $K$ 上构造相容谱价格 $H(T;x)$：两点共享 1 比特的导线价格等于欧氏距离 $\\|u-v\\|$；有限点集 $S$ 共享 1 比特的价格等于凸包归一化平均宽度 $W(S)\\log_2 q$（三角形即为半周长）。",
      mechanism: "通过张量局部收缩与外代数证明价格在区间插值下的凸性，推导出非正曲率（Alexandrov / CAT(0)）四点不等式；再假设存在最大维度平坦子空间并利用带标签置换网络压缩导出对角线矛盾，迫使任意有限维欧氏平坦子空间必然存在。",
      bridge: "只需把张量理解成“在不同空间站点之间接线的电路图”，把平均宽度理解成“随机投影长度的平均值”。",
      leanScope: "已形式化：在有限维 CAT(0) 凸欧氏局部图与联合凸对角价格假设下，证明共享比特价格等于归一化平均宽度（SpectralFlatLaw.lean）。未形式化：向无穷维不可数实 Hilbert 空间的延拓。"
    },
    {
      id: "mm",
      fam: 379,
      num: "#6 · 焦点",
      core: true,
      cnTitle: "矩阵乘法指数精确等于 9/4",
      enTitle: "The matrix multiplication exponent is nine fourths",
      leanStatus: "partial",
      leanBadge: "指数公式已形式化",
      claim: "任意域 $F$ 上方阵乘法指数精确为 $\\omega_F = 9/4$，对偶指数 $\\alpha_F = 1/2$，长方形公式 $\\omega(F;a,b,c) = x+y+\\frac{[\\max(0,(x+y)z-xy)]^2}{4xyz}$；任意形式算术电路对每个 $n\\ge 2$ 至少需要 $\\lceil n^{9/4}/2\\rceil$ 个乘除门。",
      mechanism: "利用局部环归约到有限域；假设 $\\omega_k < 9/4$ 会排除 3 臂三叉戟（费率 $8/3$）并锁死球面张量价格，从而借由批量稳定排序与比特汇聚反复压缩网络规模，最终在“多组独立列表元素互异性检验 $D_w^{\\otimes t}$”上击穿体积下界，导出矛盾。",
      bridge: "接续 Strassen 7 次乘法的张量秩，从“平面三角形比值=2”跨一步到“三叉戟比值=9/4”。",
      leanScope: "已形式化：任意域上无除法形式电路的 $\\omega=9/4$、$\\alpha=1/2$ 与长方形精确公式（ExactExponent.lean），以及允许除法不改变方阵指数。未形式化：每个具体尺寸 $n\\ge 2$ 的 $\\lceil n^{9/4}/2\\rceil$ 非标量门数下界。"
    },
    {
      id: "valiant",
      fam: 379,
      num: "#2",
      cnTitle: "路径、树与网格分离 Valiant 层级",
      enTitle: "Paths, trees and grids separate Valiant's hierarchy",
      leanStatus: "partial",
      leanBadge: "严格分离已形式化",
      claim: "在任意域 $F$ 上严格分离四层代数复杂度类：$\\mathsf{VF} \\subsetneq \\mathsf{VBP} \\subsetneq \\mathsf{VP} \\subsetneq \\mathsf{VNP}$（在度分量边界复杂度意义下成立）。",
      mechanism: "以图的状态和多项式 $Z_{G,q}(X)$ 为统一见证：将每条边的两端放到各自独立坐标轴的正负单位向量上。低秩分解对应在割处移动中继点以节省欧氏运输费；网格/二叉树/路径的割边性质分别迫使小电路/小 ABP/小公式失效。",
      bridge: "公式、分支程序、一般电路、NP 求和类，对应“套娃括号、分层状态图、可复用 DAG、指数求和”。",
      leanScope: "已形式化：精确类 $\\mathsf{VF} \\subsetneq \\mathsf{VBP} \\subsetneq \\mathsf{VP} \\subsetneq \\mathsf{VNP}$ 的严格分离，以及对网格族排除多项式规模度分量边界电路。未形式化：网格显式下界 $n^{\\Omega((\\log n)^{1/12})}$。"
    },
    {
      id: "perm",
      fam: 379,
      num: "#3",
      cnTitle: "哈密顿回路与积和式的电路下界",
      enTitle: "Circuit lower bounds for Hamiltonian cycle and the permanent",
      leanStatus: "partial",
      leanBadge: "超多项式已形式化",
      claim: "任意域上有向哈密顿回路多项式 $\\operatorname{HC}_N$，以及特征 $\\ne 2$ 域上的积和式 $\\operatorname{Per}_N$，其度分量边界算术电路规模至少为 $\\exp(c(\\log N)^2/(\\log\\log N)^2)$。",
      mechanism: "按特征的导线度量空间是否满足非线性 Poincaré 不等式（能否承载有界度扩展图端口）分两种情况：能承载则用自举计数对角线法得 $2^{N^\\varepsilon}$ 下界；不能则利用随机游走熵不等式摆放行点，让外代数子式张量击败小电路。",
      bridge: "行列式有正负号可高斯消元（多项式时间），积和式去掉负号后就成了算术电路的绝对禁区。",
      leanScope: "已形式化：对每个固定指数 $C$ 与特征 $q$，存在一致阈值使精确算术门数超过 $N^C$（且特征 $\\ne 2$ 时适用于 $\\operatorname{Per}_N$）。未形式化：仅逼近 $N$ 次项系数的更强 $\\exp(c(\\log N)^2/(\\log\\log N)^2)$ 边界下界。"
    },
    {
      id: "fft",
      fam: 379,
      num: "#4",
      cnTitle: "有限傅里叶变换的对数指数（1/2）",
      enTitle: "The logarithmic exponent of finite Fourier transforms",
      leanStatus: "partial",
      leanBadge: "FFT 上下界均已形式化",
      claim: "有限阿贝尔群傅里叶变换（含复数 DFT、Walsh–Hadamard 变换）与形式多项式卷积的最优二元线性门数为 $\\Theta_{\\text{log}}(N\\sqrt{\\log N})$（下界 $\\Omega(JN\\sqrt{\\log N})$，上界 $O_\\varepsilon(JN(1+\\log N)^{1/2+\\varepsilon})$）。",
      mechanism: "下界把输入输出放在宽 $1$ 高 $L$ 的矩形四角，特征表价格 $(L+\\sqrt{1+L^2})\\log N$ 与置换 $(L+1)\\log N$ 在 $L\\sim 1/\\sqrt{\\log N}$ 时分离。上界靠对多批输入做符号移位，利用二项集中性在 $O(\\sqrt{m\\log m})$ 宽度内用多项式预测奇偶性并低成本修复例外。",
      bridge: "突破教科书 Cooley–Tukey FFT $O(N\\log N)$ 的“门数极限”（注意不是传统硬件访存时间）。",
      leanScope: "已形式化：单次与批量有限阿贝尔群正逆傅里叶变换的 $\\Omega(JN\\sqrt{\\log N})$ 下界（含反馈状态与低秩稀疏误差）和 $O_\\varepsilon$ 上界，以及多项式卷积上界。未形式化：多项式卷积的 $\\Omega(Jn\\sqrt{\\log n})$ 下界。"
    },
    {
      id: "intmul",
      fam: 379,
      num: "#5",
      cnTitle: "多带图灵机大整数乘法的对数指数",
      enTitle: "The logarithmic exponent of integer multiplication on tapes",
      leanStatus: "partial",
      leanBadge: "乘法上下界已形式化",
      claim: "单台确定性多带图灵机可在 $n(1+\\log n)^{1/2+o(1)}$ 最坏时间与 $O(n)$ 空间内完成 $n$ 比特整数乘法；在变量数 Weak ETH 下，存在匹配的 $\\Omega(n\\sqrt{\\log n})$ 条件时间下界。",
      mechanism: "上界用中国剩余定理把卷积拆进互素短因子并用矩形重排分摊磁头移动，调用 FFT 论文的省门预测结构；下界把 Harvey–van der Hoeven 的整数乘法归约矩阵转置，再用欧氏张量几何给磁带时空段网络（Epoch graph）定价并与 Weak ETH 挂钩。",
      bridge: "相比于 $O(n\\log n)$ 的传统整数乘法，把“算术+磁带移动”一起压缩到 $\\sqrt{\\log n}$ 倍。",
      leanScope: "已形式化：固定确定性多带图灵机的 $n(\\log n)^{1/2+o(1)}$ 时间线性空间上界，及 Weak ETH 下的 $\\Omega(n\\sqrt{\\log_2 n})$ 下界（含随机与非确定性版本）。未形式化：精确整数除法与平方根的对应界。"
    },
    {
      id: "sunflower",
      fam: 379,
      num: "#7",
      cnTitle: "向日葵猜想的指数上界",
      enTitle: "An exponential bound for sunflowers",
      leanStatus: "partial",
      leanBadge: "固定基 $C_r^k$ 已形式化",
      claim: "证明 Erdős–Rado 固定花瓣向日葵猜想：任何大小 $\\le k$ 且不含 $r$-向日葵的集合族最多有 $B_r^k$ 个集合，其中 $\\log_2 B_r = O((\\log r)^4 (\\log\\log(2r))^{5/2})$。",
      mechanism: "先随机染色把集合转为 $k$ 个不交类里的长度为 $k$ 的词；将 $r$ 组独立词置于欧氏空间站点群，逐列施加淘汰“部分重复”的张量操作，迫使 $r$ 个独立单词标签坍缩为 1 个全局共享标签，利用凸包平均宽度差距 $\\rho\\log_2 N \\le kf$ 封死家族规模。",
      bridge: "只用中学集合交集概念就能看懂的组合大猜想，竟靠高维空间投影宽度给出显式指数界。",
      leanScope: "已形式化：对每个 $r\\ge 3$ 存在仅依赖 $r$ 的常数 $C_r \\ge 1$ 使得无 $r$-向日葵的 $k$-集族规模 $\\le C_r^k$。未形式化：$\\log B_r = O((\\log r)^4(\\log\\log(2r))^{5/2})$ 的显式量化界与 $\\le k$ 变长版本。"
    },
    {
      id: "lp",
      fam: 380,
      num: "#8 · Smale #9",
      fam380: true,
      cnTitle: "强多项式时间线性规划",
      enTitle: "Strongly polynomial linear programming",
      leanStatus: "partial",
      leanBadge: "有理数版已形式化",
      claim: "给出确定性算法，对任意实矩阵 $A\\in\\mathbb{R}^{m\\times n}$ 和 $b,c$ 求解线性规划（及凸二次规划、单调 LCP、确定性平均收益博弈），操作步数仅为 $m,n$ 的多项式（解决 Smale 第九问题）。",
      mechanism: "将原始可行解与 Farkas 证书置于正交子空间对；通过坐标动态尺度变换（“价格”）探测最小支撑证书非零项的符号，并用子行列式比值的短对数替代品来校准有理数查询，从而用普通比特多项式 LP 恢复精确支撑集。",
      bridge: "普通椭球法/内点法步数会受输入数字小数位数（比特长）拖累；强多项式时间只看变量数和约束数。",
      leanScope: "已形式化：有理数输入的固定 RAM 程序以 $m+d$ 的多项式指令数和输入比特长的多项式存储位宽完成可行性与最优化求解。未形式化：论文中抽象实数序列模型（BSS）及二次规划/博弈推广。"
    },
    {
      id: "hirsch",
      fam: 380,
      num: "#9 · Hirsch",
      fam380: true,
      cnTitle: "简单多胞体的超多项式图直径",
      enTitle: "Superpolynomial graph diameter of simple polytopes",
      leanStatus: "full",
      leanBadge: "主要定理已全面形式化",
      claim: "构造出面数为 $n$、维度仅为 $n^{o(1)}$ 的有界简单有理多胞体族，其顶点-棱图直径超过任意固定多项式 $n^k$（$n^{\\omega(1)}$），甚至允许跨低维面跳跃亦然，彻底否定多项式 Hirsch 猜想。",
      mechanism: "沿线性目标 $x$ 作为时间坐标构造多组“折线拐点”约束 $z_i \\ge |x-a|$ 强制路径必须弯折；再利用共用“时钟读数”压缩不等式行数，将多层嵌套拐点呈指数/超多项式级放大。",
      bridge: "说明单纯形法沿多胞体棱边“一步步爬”存在绕不过去的几何长路，恰好与 #8 跳过沿棱行走形成对照。",
      leanScope: "已全面形式化：对有界简单有理多胞体否定多项式 Hirsch 猜想、允许跨 $k(n)=n^{o(1)}$ 维面移动的超多项式直径、指定目标差距顶点对距离下界，以及指定维度和多余面数的定量下界（Hirsch.lean）。"
    }
  ];

  const fam379El = document.getElementById("fam379Chips");
  const fam380El = document.getElementById("fam380Chips");
  const detailEl = document.getElementById("atlasDetail");
  let selectedPaperId = "mm";

  function renderAtlas() {
    fam379El.innerHTML = "";
    fam380El.innerHTML = "";
    PAPERS.forEach((p) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "paper-chip" +
        (p.core ? " core" : "") +
        (p.fam380 ? " fam380" : "") +
        (p.id === selectedPaperId ? " active" : "");
      btn.innerHTML = `
        <div class="chip-num">
          <span>${p.num}</span>
          <span class="lean-tag ${p.leanStatus === "partial" ? "partial" : ""}">${p.leanBadge}</span>
        </div>
        <div class="chip-name">${p.cnTitle}</div>
      `;
      btn.addEventListener("click", () => {
        selectedPaperId = p.id;
        renderAtlas();
      });
      (p.fam === 379 ? fam379El : fam380El).appendChild(btn);
    });

    const cur = PAPERS.find((p) => p.id === selectedPaperId) || PAPERS[0];
    detailEl.innerHTML = `
      <h4 class="atlas-detail-title">${cur.cnTitle}</h4>
      <div class="atlas-detail-en">${cur.enTitle} · Family ${cur.fam}</div>
      <div class="atlas-kv">
        <div class="atlas-k">核心结论</div>
        <div>${cur.claim}</div>
        <div class="atlas-k">数学机制</div>
        <div>${cur.mechanism}</div>
        <div class="atlas-k">工科直觉</div>
        <div>${cur.bridge}</div>
        <div class="atlas-k">Lean 4 边界</div>
        <div>${cur.leanScope}</div>
      </div>
    `;
    renderMath(detailEl);
  }

  renderAtlas();

  /* ================= 3. Euclidean Tensor Geometry Lab ================= */
  const geoSvg = document.getElementById("geoSvg");
  const hullPoly = document.getElementById("hullPoly");
  const wireEdges = document.getElementById("wireEdges");
  const edgeLabels = document.getElementById("edgeLabels");
  const vertexNodes = document.getElementById("vertexNodes");
  const geoMetrics = document.getElementById("geoMetrics");
  const geoPresetBtns = Array.from(document.querySelectorAll("#geoPresets .pill-btn"));

  const SCALE = 80; // 80 px = 1 unit
  let points = [
    { name: "A", x: 110, y: 235 },
    { name: "B", x: 310, y: 235 },
    { name: "C", x: 210, y: 62 }
  ];
  let draggingIdx = -1;

  function dist(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y) / SCALE;
  }

  function convexHull(pts) {
    if (pts.length <= 2) return pts.slice();
    const sorted = pts.slice().sort((a, b) => (a.x !== b.x ? a.x - b.x : a.y - b.y));
    const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    const lower = [];
    for (const p of sorted) {
      while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
        lower.pop();
      }
      lower.push(p);
    }
    const upper = [];
    for (let i = sorted.length - 1; i >= 0; i--) {
      const p = sorted[i];
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
        upper.pop();
      }
      upper.push(p);
    }
    lower.pop();
    upper.pop();
    return lower.concat(upper);
  }

  function polyPerimeter(hull) {
    if (hull.length < 2) return 0;
    if (hull.length === 2) return 2 * dist(hull[0], hull[1]);
    let p = 0;
    for (let i = 0; i < hull.length; i++) {
      p += dist(hull[i], hull[(i + 1) % hull.length]);
    }
    return p;
  }

  function renderGeo() {
    const hull = convexHull(points);
    hullPoly.setAttribute("points", hull.map((p) => `${p.x},${p.y}`).join(" "));

    // Draw pairwise edges among first 3 (or all) points
    wireEdges.innerHTML = "";
    edgeLabels.innerHTML = "";
    let pairwiseSum = 0;

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        // If 4 points, only draw outer cycle + diagonals lightly, or draw triangle for first 3
        const p1 = points[i];
        const p2 = points[j];
        const d = dist(p1, p2);
        const isTriangleEdge = i < 3 && j < 3;
        if (points.length === 3 || (i < 3 && j < 3) || (j === 3)) {
          if (isTriangleEdge) pairwiseSum += d;
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("x1", p1.x);
          line.setAttribute("y1", p1.y);
          line.setAttribute("x2", p2.x);
          line.setAttribute("y2", p2.y);
          line.setAttribute("stroke", isTriangleEdge ? "#1f2e35" : "#9aa7ad");
          line.setAttribute("stroke-width", isTriangleEdge ? "2" : "1.2");
          if (!isTriangleEdge) line.setAttribute("stroke-dasharray", "3 3");
          wireEdges.appendChild(line);

          if (isTriangleEdge || points.length === 4) {
            const mx = (p1.x + p2.x) / 2;
            const my = (p1.y + p2.y) / 2;
            const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
            txt.setAttribute("x", mx);
            txt.setAttribute("y", my - 5);
            txt.setAttribute("text-anchor", "middle");
            txt.setAttribute("font-size", "11");
            txt.setAttribute("font-family", "JetBrains Mono, monospace");
            txt.setAttribute("fill", isTriangleEdge ? "#1f2e35" : "#6f7f87");
            txt.textContent = d.toFixed(2);
            edgeLabels.appendChild(txt);
          }
        }
      }
    }

    // Draw vertices
    vertexNodes.innerHTML = "";
    points.forEach((p, idx) => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.style.cursor = "grab";
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", p.x);
      circle.setAttribute("cy", p.y);
      circle.setAttribute("r", "12");
      circle.setAttribute("fill", idx < 3 ? "#ffffff" : "#f3efe6");
      circle.setAttribute("stroke", idx < 3 ? "#1d5b4c" : "#2d4c7c");
      circle.setAttribute("stroke-width", "2.5");
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", p.x);
      label.setAttribute("y", p.y + 4);
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("font-size", "12");
      label.setAttribute("font-weight", "700");
      label.setAttribute("fill", "#1f2e35");
      label.textContent = p.name;
      g.appendChild(circle);
      g.appendChild(label);
      g.addEventListener("pointerdown", (ev) => {
        draggingIdx = idx;
        geoSvg.setPointerCapture(ev.pointerId);
      });
      vertexNodes.appendChild(g);
    });

    // Compute Cauchy-Crofton numerical mean width as sanity verification vs P/2
    const hullPerim = polyPerimeter(hull);
    const meanWidth = hullPerim / 2;

    if (points.length === 3) {
      const dAB = dist(points[0], points[1]);
      const dBC = dist(points[1], points[2]);
      const dCA = dist(points[2], points[0]);
      const triPerim = dAB + dBC + dCA;
      const ratio = meanWidth > 1e-6 ? triPerim / meanWidth : 0;

      geoMetrics.innerHTML = `
        <div class="metric-row"><span>导线 $AB$（距离 $\\|A-B\\|$）</span><span class="metric-val">${dAB.toFixed(3)}</span></div>
        <div class="metric-row"><span>导线 $BC$（距离 $\\|B-C\\|$）</span><span class="metric-val">${dBC.toFixed(3)}</span></div>
        <div class="metric-row"><span>导线 $CA$（距离 $\\|C-A\\|$）</span><span class="metric-val">${dCA.toFixed(3)}</span></div>
        <div class="metric-row highlight"><span>3 条独立导线总价（$P = AB+BC+CA$）</span><span class="metric-val">${triPerim.toFixed(3)}</span></div>
        <div class="metric-row highlight"><span>3 方共享 1 比特价格 $W(S) = P/2$</span><span class="metric-val">${meanWidth.toFixed(3)}</span></div>
        <div class="metric-row warn"><span>欧氏平直下界比值 $P / W(S)$</span><span class="metric-val">${ratio.toFixed(3)}</span></div>
      `;
    } else {
      const allSix = (() => {
        let s = 0;
        for (let i = 0; i < points.length; i++) {
          for (let j = i + 1; j < points.length; j++) s += dist(points[i], points[j]);
        }
        return s;
      })();
      geoMetrics.innerHTML = `
        <div class="metric-row"><span>凸包顶点数</span><span class="metric-val">${hull.length} / 4</span></div>
        <div class="metric-row"><span>凸包周长 $P_{\\text{hull}}$</span><span class="metric-val">${hullPerim.toFixed(3)}</span></div>
        <div class="metric-row highlight"><span>4 方共享 1 比特 $W(S) = P_{\\text{hull}}/2$</span><span class="metric-val">${meanWidth.toFixed(3)}</span></div>
        <div class="metric-row"><span>全连接 6 条导线总价</span><span class="metric-val">${allSix.toFixed(3)}</span></div>
        <div class="metric-row warn"><span>提示：把 $D$ 拖进 $\\triangle ABC$ 内部，观察 $W(S)$</span><span class="metric-val">${hull.length === 3 ? "免费中继！" : "扩大凸包"}</span></div>
      `;
    }
    renderMath(geoMetrics);
  }

  geoSvg.addEventListener("pointermove", (ev) => {
    if (draggingIdx < 0) return;
    const rect = geoSvg.getBoundingClientRect();
    const sx = ((ev.clientX - rect.left) / rect.width) * 420;
    const sy = ((ev.clientY - rect.top) / rect.height) * 310;
    points[draggingIdx].x = Math.min(395, Math.max(25, sx));
    points[draggingIdx].y = Math.min(285, Math.max(25, sy));
    renderGeo();
  });

  window.addEventListener("pointerup", () => {
    draggingIdx = -1;
  });

  geoPresetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      geoPresetBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const k = btn.dataset.preset;
      if (k === "equilateral") {
        points = [
          { name: "A", x: 110, y: 235 },
          { name: "B", x: 310, y: 235 },
          { name: "C", x: 210, y: 62 }
        ];
      } else if (k === "flat") {
        points = [
          { name: "A", x: 80, y: 160 },
          { name: "B", x: 340, y: 160 },
          { name: "C", x: 210, y: 160 }
        ];
      } else if (k === "right") {
        points = [
          { name: "A", x: 90, y: 245 },
          { name: "B", x: 330, y: 245 },
          { name: "C", x: 90, y: 65 }
        ];
      } else if (k === "square4") {
        points = [
          { name: "A", x: 120, y: 240 },
          { name: "B", x: 300, y: 240 },
          { name: "C", x: 300, y: 60 },
          { name: "D", x: 120, y: 60 }
        ];
      }
      renderGeo();
    });
  });

  renderGeo();

  /* ================= 4. Matrix Multiplication Rectangular Formula & Timeline ================= */
  const sliderA = document.getElementById("sliderA");
  const sliderB = document.getElementById("sliderB");
  const sliderC = document.getElementById("sliderC");
  const valA = document.getElementById("valA");
  const valB = document.getElementById("valB");
  const valC = document.getElementById("valC");
  const mmMetrics = document.getElementById("mmMetrics");
  const rectCurveSvg = document.getElementById("rectCurveSvg");
  const mmPresets = Array.from(document.querySelectorAll("#mmPresets .pill-btn"));

  function calcOmega(a, b, c) {
    const arr = [a, b, c].sort((u, v) => v - u);
    const [x, y, z] = arr;
    const raw = (x + y) * z - x * y;
    const excess = Math.max(0, raw);
    const corr = (excess * excess) / (4 * x * y * z);
    return { x, y, z, excess, corr, omega: x + y + corr };
  }

  function renderRectCurve(curT) {
    const W = 420;
    const H = 230;
    const padL = 48;
    const padR = 20;
    const padT = 20;
    const padB = 34;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    const mapX = (t) => padL + t * plotW;
    const mapY = (om) => padT + plotH - ((om - 1.95) / 0.35) * plotH;

    let dPath = "";
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const om = t <= 0.5 ? 2.0 : 2.0 + Math.pow(2 * t - 1, 2) / (4 * t);
      dPath += (i === 0 ? "M" : "L") + `${mapX(t).toFixed(1)},${mapY(om).toFixed(1)} `;
    }

    const alphaX = mapX(0.5);
    const curVal = curT <= 0.5 ? 2.0 : 2.0 + Math.pow(2 * curT - 1, 2) / (4 * curT);

    rectCurveSvg.innerHTML = `
      <rect x="${padL}" y="${padT}" width="${alphaX - padL}" height="${plotH}" fill="rgba(29,91,76,0.07)" />
      <line x1="${padL}" y1="${mapY(2.0)}" x2="${W - padR}" y2="${mapY(2.0)}" stroke="#ddd6c7" stroke-dasharray="4 3" />
      <line x1="${padL}" y1="${mapY(2.25)}" x2="${W - padR}" y2="${mapY(2.25)}" stroke="#ddd6c7" stroke-dasharray="4 3" />
      <line x1="${alphaX}" y1="${padT}" x2="${alphaX}" y2="${padT + plotH}" stroke="#1d5b4c" stroke-width="1.2" stroke-dasharray="4 3" />
      <line x1="${padL}" y1="${padT + plotH}" x2="${W - padR}" y2="${padT + plotH}" stroke="#6f7f87" />
      <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + plotH}" stroke="#6f7f87" />
      <path d="${dPath}" fill="none" stroke="#1d5b4c" stroke-width="2.6" />
      <circle cx="${mapX(0.5)}" cy="${mapY(2.0)}" r="4.5" fill="#1d5b4c" />
      <circle cx="${mapX(1.0)}" cy="${mapY(2.25)}" r="4.5" fill="#b04a32" />
      <circle cx="${mapX(curT)}" cy="${mapY(curVal)}" r="5.5" fill="#ffffff" stroke="#1f2e35" stroke-width="2.2" />
      <text x="${padL - 8}" y="${mapY(2.0) + 4}" text-anchor="end" font-size="11" font-family="JetBrains Mono, monospace" fill="#52636b">2.00</text>
      <text x="${padL - 8}" y="${mapY(2.25) + 4}" text-anchor="end" font-size="11" font-family="JetBrains Mono, monospace" fill="#b04a32">2.25</text>
      <text x="${mapX(0)}" y="${H - 12}" text-anchor="middle" font-size="11" font-family="JetBrains Mono, monospace" fill="#52636b">t=0</text>
      <text x="${alphaX}" y="${H - 12}" text-anchor="middle" font-size="11" font-family="JetBrains Mono, monospace" fill="#1d5b4c">α=0.5</text>
      <text x="${mapX(1)}" y="${H - 12}" text-anchor="middle" font-size="11" font-family="JetBrains Mono, monospace" fill="#b04a32">t=1</text>
      <text x="${(padL + alphaX) / 2}" y="${padT + 18}" text-anchor="middle" font-size="11" fill="#1d5b4c">免费区 ω=2</text>
      <text x="${mapX(1) - 4}" y="${mapY(2.25) - 9}" text-anchor="end" font-size="11" font-weight="600" fill="#b04a32">(1, 9/4)</text>
    `;
  }

  function updateMMLab() {
    const a = parseFloat(sliderA.value);
    const b = parseFloat(sliderB.value);
    const c = parseFloat(sliderC.value);
    valA.textContent = a.toFixed(2);
    valB.textContent = b.toFixed(2);
    valC.textContent = c.toFixed(2);

    const res = calcOmega(a, b, c);
    const naive = a + b + c;
    const trivialLower = res.x + res.y;

    mmMetrics.innerHTML = `
      <div class="metric-row"><span>排序权重 $(x \\ge y \\ge z)$</span><span class="metric-val">(${res.x.toFixed(2)}, ${res.y.toFixed(2)}, ${res.z.toFixed(2)})</span></div>
      <div class="metric-row"><span>输入/输出尺寸下界 $x+y$</span><span class="metric-val">${trivialLower.toFixed(4)}</span></div>
      <div class="metric-row"><span>朴素三重循环 $a+b+c$</span><span class="metric-val">${naive.toFixed(4)}</span></div>
      <div class="metric-row ${res.corr > 0 ? "warn" : "highlight"}"><span>溢价项 $\\frac{[\\max(0,(x+y)z-xy)]^2}{4xyz}$</span><span class="metric-val">+${res.corr.toFixed(4)}</span></div>
      <div class="metric-row highlight"><span>精确指数 $\\omega(F; a, b, c)$</span><span class="metric-val">${res.omega.toFixed(4)}</span></div>
    `;
    renderMath(mmMetrics);

    // For the (1, 1, t) chart, project normalized smallest/largest ratio if a=b, else use min/max
    const tProj = Math.min(1, res.z / res.x);
    renderRectCurve(tProj);
  }

  [sliderA, sliderB, sliderC].forEach((s) => {
    s.addEventListener("input", () => {
      mmPresets.forEach((b) => b.classList.remove("active"));
      updateMMLab();
    });
  });

  mmPresets.forEach((btn) => {
    btn.addEventListener("click", () => {
      mmPresets.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const [a, b, c] = btn.dataset.abc.split(",");
      sliderA.value = a;
      sliderB.value = b;
      sliderC.value = c;
      updateMMLab();
    });
  });

  updateMMLab();

  /* ================= 5. Historical Timeline SVG ================= */
  function renderTimeline() {
    const svg = document.getElementById("timelineSvg");
    const items = [
      { year: "经典", label: "朴素定义", val: 3.0, x: 65, color: "#6f7f87" },
      { year: "1969", label: "Strassen", val: 2.807, x: 185, color: "#2d4c7c" },
      { year: "1990", label: "CW", val: 2.3755, x: 315, color: "#2d4c7c" },
      { year: "2026初", label: "精细CW", val: 2.3711, x: 445, color: "#2d4c7c" },
      { year: "2026.10", label: "上界 9/4", val: 2.25, x: 565, color: "#1d5b4c" },
      { year: "2026.11", label: "匹配下界 9/4", val: 2.25, x: 660, color: "#b04a32" }
    ];

    const yMin = 2.0;
    const yMax = 3.1;
    const mapY = (v) => 155 - ((v - yMin) / (yMax - yMin)) * 125;

    let out = `
      <line x1="40" y1="${mapY(2.0)}" x2="695" y2="${mapY(2.0)}" stroke="#c5bca8" stroke-dasharray="4 3" />
      <text x="36" y="${mapY(2.0) + 4}" text-anchor="end" font-size="10.5" font-family="JetBrains Mono, monospace" fill="#6f7f87">2.0</text>
      <line x1="40" y1="${mapY(2.25)}" x2="695" y2="${mapY(2.25)}" stroke="rgba(176,74,50,0.35)" stroke-dasharray="4 3" />
      <text x="36" y="${mapY(2.25) + 4}" text-anchor="end" font-size="10.5" font-family="JetBrains Mono, monospace" fill="#b04a32">2.25</text>
      <line x1="40" y1="${mapY(3.0)}" x2="695" y2="${mapY(3.0)}" stroke="#e5dfd2" stroke-dasharray="3 3" />
      <text x="36" y="${mapY(3.0) + 4}" text-anchor="end" font-size="10.5" font-family="JetBrains Mono, monospace" fill="#6f7f87">3.0</text>
    `;

    // Connect upper bound curve up to 2026.10
    const pathPts = items.slice(0, 5).map((d) => `${d.x},${mapY(d.val).toFixed(1)}`).join(" L ");
    out += `<path d="M ${pathPts}" fill="none" stroke="#1d5b4c" stroke-width="2" />`;

    items.forEach((d, i) => {
      const cy = mapY(d.val);
      const yOff = i === 3 ? -14 : i === 4 ? -12 : i === 5 ? 19 : -11;
      out += `
        <circle cx="${d.x}" cy="${cy}" r="5" fill="${d.color}" />
        <text x="${d.x}" y="${cy + yOff}" text-anchor="middle" font-size="11" font-weight="700" font-family="JetBrains Mono, monospace" fill="${d.color}">${d.val}</text>
        <text x="${d.x}" y="176" text-anchor="middle" font-size="10.5" fill="#1f2e35">${d.label}</text>
        <text x="${d.x}" y="188" text-anchor="middle" font-size="9.5" fill="#6f7f87">${d.year}</text>
      `;
    });

    svg.innerHTML = out;
  }

  renderTimeline();

  /* ================= 6. Initial KaTeX Render ================= */
  if (document.readyState === "complete") {
    renderMath(document.body);
  } else {
    window.addEventListener("load", () => renderMath(document.body));
  }
})();
