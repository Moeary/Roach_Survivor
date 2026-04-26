(function (global) {
  const NS = global.RoachSurvivor = global.RoachSurvivor || {};

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function toFixed(value) {
    return Number(value).toFixed(1);
  }

  function renderMap(state) {
    const width = state.map.width;
    const height = state.map.height;

    const decorationMarkup = state.decorations.map((prop) => {
      if (prop.type === "puddle") {
        return `
          <g transform="translate(${toFixed(prop.x)} ${toFixed(prop.y)}) rotate(${toFixed(prop.rotation)}) scale(${toFixed(prop.scale)})">
            <ellipse rx="54" ry="30" fill="rgba(113, 210, 87, 0.12)"></ellipse>
            <ellipse rx="34" ry="18" fill="rgba(214, 239, 109, 0.08)"></ellipse>
          </g>
        `;
      }

      if (prop.type === "crumb") {
        return `
          <g transform="translate(${toFixed(prop.x)} ${toFixed(prop.y)}) rotate(${toFixed(prop.rotation)}) scale(${toFixed(prop.scale)})">
            <polygon points="-18,-10 14,-16 22,4 -2,18 -24,2" fill="#8e6d3f"></polygon>
            <polygon points="-6,-2 8,-6 10,2 -2,8" fill="#c7a26a"></polygon>
          </g>
        `;
      }

      if (prop.type === "cap") {
        return `
          <g transform="translate(${toFixed(prop.x)} ${toFixed(prop.y)}) rotate(${toFixed(prop.rotation)}) scale(${toFixed(prop.scale)})">
            <circle r="26" fill="#345468"></circle>
            <circle r="16" fill="#233641"></circle>
            <circle r="7" fill="#a0d5f8"></circle>
          </g>
        `;
      }

      if (prop.type === "drain") {
        return `
          <g transform="translate(${toFixed(prop.x)} ${toFixed(prop.y)}) rotate(${toFixed(prop.rotation)}) scale(${toFixed(prop.scale)})">
            <rect x="-34" y="-22" width="68" height="44" rx="8" fill="#26322c"></rect>
            <path d="M -24 -12 H 24 M -24 0 H 24 M -24 12 H 24" stroke="#8e9e7d" stroke-width="4" stroke-linecap="round"></path>
          </g>
        `;
      }

      return `
        <g transform="translate(${toFixed(prop.x)} ${toFixed(prop.y)}) rotate(${toFixed(prop.rotation)}) scale(${toFixed(prop.scale)})">
          <ellipse rx="46" ry="20" fill="rgba(74, 43, 24, 0.22)"></ellipse>
          <ellipse rx="26" ry="10" fill="rgba(118, 83, 56, 0.18)"></ellipse>
        </g>
      `;
    }).join("");

    const laneMarkup = Array.from({ length: 10 }).map((_, index) => {
      const y = 160 + index * 210;
      return `<path d="M 0 ${y} C 480 ${y + 28}, 760 ${y - 44}, ${width} ${y + 24}" stroke="rgba(164, 190, 110, 0.07)" stroke-width="18" fill="none"></path>`;
    }).join("");

    const gutterMarkup = Array.from({ length: 6 }).map((_, index) => {
      const x = 260 + index * 540;
      return `<path d="M ${x} 0 C ${x + 20} 640, ${x - 18} 1660, ${x + 12} ${height}" stroke="rgba(255, 160, 79, 0.06)" stroke-width="24" fill="none"></path>`;
    }).join("");

    return `
      <rect x="0" y="0" width="${width}" height="${height}" fill="url(#floorGradient)"></rect>
      <rect x="0" y="0" width="${width}" height="${height}" fill="url(#sewerGrid)" opacity="0.84"></rect>
      <rect x="42" y="42" width="${width - 84}" height="${height - 84}" fill="none" stroke="rgba(214, 239, 109, 0.06)" stroke-width="18" stroke-dasharray="32 16"></rect>
      ${laneMarkup}
      ${gutterMarkup}
      ${decorationMarkup}
    `;
  }

  function renderPickup(pickup) {
    return `
      <g transform="translate(${toFixed(pickup.x)} ${toFixed(pickup.y)})">
        <circle r="${toFixed(pickup.radius + 8)}" fill="url(#slimeGlow)" opacity="0.42"></circle>
        <circle r="${toFixed(pickup.radius)}" fill="#d7f06d"></circle>
        <circle r="${toFixed(Math.max(4, pickup.radius * 0.42))}" fill="#f7ffe0"></circle>
      </g>
    `;
  }

  function renderProjectile(projectile) {
    const angle = projectile.angle * 180 / Math.PI;
    return `
      <g transform="translate(${toFixed(projectile.x)} ${toFixed(projectile.y)}) rotate(${toFixed(angle)})">
        <ellipse cx="-8" cy="0" rx="18" ry="8" fill="rgba(198, 255, 92, 0.18)"></ellipse>
        <ellipse rx="15" ry="8" fill="#f4f0d2"></ellipse>
        <ellipse cx="4" rx="8" ry="5" fill="#d8c89d"></ellipse>
      </g>
    `;
  }

  function renderEnemy(enemy) {
    const angle = Math.atan2(enemy.vy, enemy.vx) * 180 / Math.PI;
    const pulseScale = 1 + Math.sin(enemy.pulse || 0) * 0.04;
    const hpRatio = clamp(enemy.hp / enemy.maxHp, 0, 1);

    if (enemy.type === "boss") {
      return `
        <g transform="translate(${toFixed(enemy.x)} ${toFixed(enemy.y)}) rotate(${toFixed(angle)}) scale(${toFixed(pulseScale)})">
          <ellipse cx="0" cy="18" rx="98" ry="40" fill="rgba(0, 0, 0, 0.24)"></ellipse>
          <g stroke="#2f1218" stroke-width="10" stroke-linecap="round">
            <path d="M -58 8 L -126 -44"></path>
            <path d="M -72 26 L -138 0"></path>
            <path d="M -58 46 L -126 94"></path>
            <path d="M 58 8 L 126 -44"></path>
            <path d="M 72 26 L 138 0"></path>
            <path d="M 58 46 L 126 94"></path>
          </g>
          <ellipse cx="32" cy="0" rx="62" ry="48" fill="#8f2741"></ellipse>
          <ellipse cx="-18" cy="0" rx="76" ry="58" fill="#642131"></ellipse>
          <ellipse cx="-40" cy="0" rx="42" ry="32" fill="#47222b"></ellipse>
          <circle cx="-62" cy="-10" r="10" fill="#ffe7be"></circle>
          <circle cx="-62" cy="-10" r="4" fill="#34180c"></circle>
          <path d="M -90 -12 C -124 -34, -132 -42, -146 -36" stroke="#8d4550" stroke-width="6" fill="none"></path>
          <path d="M -90 14 C -124 40, -132 48, -146 42" stroke="#8d4550" stroke-width="6" fill="none"></path>
          <rect x="-84" y="-94" width="168" height="10" rx="5" fill="rgba(0, 0, 0, 0.35)"></rect>
          <rect x="-84" y="-94" width="${toFixed(168 * hpRatio)}" height="10" rx="5" fill="#e74a5a"></rect>
        </g>
      `;
    }

    const bodyFill = enemy.type === "guard" ? "#5a4035" : enemy.type === "adult" ? "#9a5a36" : "#dcc488";
    const shellFill = enemy.type === "guard" ? "#2c2220" : enemy.type === "adult" ? "#6f3d25" : "#a69867";
    const eyeFill = enemy.type === "guard" ? "#ff934e" : "#fff4cb";

    return `
      <g transform="translate(${toFixed(enemy.x)} ${toFixed(enemy.y)}) rotate(${toFixed(angle)}) scale(${toFixed(pulseScale)})">
        <ellipse cx="0" cy="${toFixed(enemy.radius * 0.7)}" rx="${toFixed(enemy.radius * 1.18)}" ry="${toFixed(enemy.radius * 0.5)}" fill="rgba(0, 0, 0, 0.24)"></ellipse>
        <g stroke="${shellFill}" stroke-width="${enemy.type === "guard" ? 6 : 4}" stroke-linecap="round">
          <path d="M -${enemy.radius} 4 L -${enemy.radius * 1.7} -${enemy.radius * 0.9}"></path>
          <path d="M -${enemy.radius * 1.1} ${enemy.radius * 0.4} L -${enemy.radius * 1.8} 0"></path>
          <path d="M -${enemy.radius} ${enemy.radius} L -${enemy.radius * 1.7} ${enemy.radius * 1.3}"></path>
          <path d="M ${enemy.radius} 4 L ${enemy.radius * 1.7} -${enemy.radius * 0.9}"></path>
          <path d="M ${enemy.radius * 1.1} ${enemy.radius * 0.4} L ${enemy.radius * 1.8} 0"></path>
          <path d="M ${enemy.radius} ${enemy.radius} L ${enemy.radius * 1.7} ${enemy.radius * 1.3}"></path>
        </g>
        <ellipse cx="${toFixed(enemy.radius * 0.22)}" cy="0" rx="${toFixed(enemy.radius * 0.98)}" ry="${toFixed(enemy.radius * 0.78)}" fill="${bodyFill}"></ellipse>
        <ellipse cx="-${toFixed(enemy.radius * 0.25)}" cy="0" rx="${toFixed(enemy.radius * 0.92)}" ry="${toFixed(enemy.radius * 0.72)}" fill="${shellFill}"></ellipse>
        <ellipse cx="-${toFixed(enemy.radius * 0.68)}" cy="-${toFixed(enemy.radius * 0.16)}" rx="${toFixed(enemy.radius * 0.38)}" ry="${toFixed(enemy.radius * 0.3)}" fill="#2e201a"></ellipse>
        <circle cx="-${toFixed(enemy.radius * 0.72)}" cy="-${toFixed(enemy.radius * 0.26)}" r="${toFixed(Math.max(3, enemy.radius * 0.14))}" fill="${eyeFill}"></circle>
        <circle cx="-${toFixed(enemy.radius * 0.72)}" cy="-${toFixed(enemy.radius * 0.26)}" r="${toFixed(Math.max(1.8, enemy.radius * 0.06))}" fill="#23140f"></circle>
      </g>
    `;
  }

  function renderPlayer(player) {
    const aimAngle = player.aimAngle * 180 / Math.PI;
    const isBlinking = player.contactTimer > 0 && Math.floor(player.contactTimer * 18) % 2 === 0;

    return `
      <g transform="translate(${toFixed(player.x)} ${toFixed(player.y)}) rotate(${toFixed(aimAngle)})">
        <circle r="${toFixed(player.stats.pickupRadius + 72)}" fill="url(#slimeGlow)" opacity="0.08" filter="url(#softGlow)"></circle>
        <circle r="${toFixed(player.stats.pickupRadius)}" fill="none" stroke="rgba(198, 255, 92, 0.14)" stroke-width="2" stroke-dasharray="10 14"></circle>
        <ellipse cx="0" cy="18" rx="52" ry="22" fill="rgba(0, 0, 0, 0.28)"></ellipse>
        <g opacity="${isBlinking ? 0.55 : 1}">
          <g stroke="#2a1d18" stroke-width="6" stroke-linecap="round">
            <path d="M -24 4 L -66 -28"></path>
            <path d="M -28 18 L -70 12"></path>
            <path d="M -22 32 L -62 56"></path>
            <path d="M 24 4 L 66 -28"></path>
            <path d="M 28 18 L 70 12"></path>
            <path d="M 22 32 L 62 56"></path>
          </g>
          <ellipse cx="20" cy="0" rx="30" ry="22" fill="#c6d86e"></ellipse>
          <ellipse cx="-8" cy="0" rx="42" ry="30" fill="#4d2d22"></ellipse>
          <ellipse cx="-26" cy="0" rx="24" ry="18" fill="#291712"></ellipse>
          <ellipse cx="-34" cy="-4" rx="11" ry="9" fill="#d7f06d"></ellipse>
          <circle cx="-34" cy="-4" r="4" fill="#20120e"></circle>
          <path d="M -46 -12 C -68 -32, -80 -40, -90 -34" stroke="#a8846a" stroke-width="4" fill="none"></path>
          <path d="M -46 12 C -68 32, -80 40, -90 34" stroke="#a8846a" stroke-width="4" fill="none"></path>
          <ellipse cx="42" cy="0" rx="18" ry="10" fill="#f5eed0"></ellipse>
          <ellipse cx="54" cy="0" rx="10" ry="5" fill="#dccda4"></ellipse>
        </g>
      </g>
    `;
  }

  function renderEffect(effect) {
    const progress = effect.age / effect.duration;
    const radius = effect.radius * (0.5 + progress * 1.2);
    const opacity = clamp(1 - progress, 0, 1);

    return `
      <g transform="translate(${toFixed(effect.x)} ${toFixed(effect.y)})" opacity="${toFixed(opacity)}">
        <circle r="${toFixed(radius)}" fill="${effect.tint}" opacity="0.26"></circle>
        <circle r="${toFixed(radius * 0.5)}" fill="${effect.tint}" opacity="0.5"></circle>
      </g>
    `;
  }

  function createOverlayMarkup(state) {
    if (state.runState === "levelup") {
      const choices = state.upgradeChoices.map((choice, index) => `
        <button class="choice-card" data-action="upgrade" data-upgrade-id="${choice.id}">
          <span class="choice-hotkey">${index + 1}</span>
          <h3>${choice.name}</h3>
          <p>${choice.description}</p>
          <p class="overlay-copy">当前等级 ${choice.currentRank} -> ${choice.nextRank}</p>
        </button>
      `).join("");

      return `
        <p class="overlay-kicker">Level Up</p>
        <h2>腺体突然暴走了</h2>
        <p class="overlay-copy">选择一次变异强化。战斗会暂停，直到你完成选择。</p>
        <div class="choice-grid">${choices}</div>
      `;
    }

    if (state.runState === "paused") {
      return `
        <p class="overlay-kicker">Paused</p>
        <h2>下水道短暂停摆</h2>
        <p class="overlay-copy">准备好了就继续突围，或者直接重开这一局。</p>
        <div class="action-row">
          <button class="button-primary" data-action="resume">继续战斗</button>
          <button data-action="restart">重新开局</button>
        </div>
      `;
    }

    if (state.runState === "won") {
      return `
        <p class="overlay-kicker">Victory</p>
        <h2>母巢女王被你轰碎了</h2>
        <p class="overlay-copy">你活过了五分钟，还把整片污水区最肥的一只蟑螂炸成了壳片。按 Enter 也可以立刻重开。</p>
        <div class="action-row">
          <button class="button-primary" data-action="restart">再来一局</button>
        </div>
      `;
    }

    if (state.runState === "lost") {
      return `
        <p class="overlay-kicker">Defeat</p>
        <h2>你被虫潮啃穿了</h2>
        <p class="overlay-copy">这次走位没顶住。下一局试试更早拿攻速、移速或者穿透。按 Enter 也可以直接重开。</p>
        <div class="action-row">
          <button class="button-primary" data-action="restart">重新孵化</button>
        </div>
      `;
    }

    return "";
  }

  function createBuildMarkup(state) {
    const summary = NS.Upgrades.summarizeUpgrades(state);

    if (!summary.length) {
      return `
        <div class="build-row">
          <span>尚未变异</span>
          <strong>先吃经验颗粒升级</strong>
        </div>
      `;
    }

    return summary.map((entry) => `
      <div class="build-row">
        <span>${entry.name}</span>
        <strong>Lv.${entry.rank}</strong>
      </div>
    `).join("");
  }

  function createRenderer(elements) {
    function renderStatic(state) {
      elements.mapLayer.innerHTML = renderMap(state);
    }

    function render(state) {
      const camera = NS.Game.getCamera(state);
      const translateX = state.viewport.width / 2 - camera.x;
      const translateY = state.viewport.height / 2 - camera.y;
      const boss = NS.Game.getBoss(state);
      const summary = NS.Upgrades.summarizeUpgrades(state);
      const hpRatio = clamp(state.player.hp / state.player.maxHp, 0, 1);
      const xpRatio = clamp(state.xp / state.xpToNext, 0, 1);
      const overlayMarkup = createOverlayMarkup(state);

      elements.world.setAttribute("transform", "translate(" + toFixed(translateX) + " " + toFixed(translateY) + ")");
      elements.pickupLayer.innerHTML = state.pickups.map(renderPickup).join("");
      elements.enemyLayer.innerHTML = state.enemies.map(renderEnemy).join("");
      elements.projectileLayer.innerHTML = state.projectiles.map(renderProjectile).join("");
      elements.playerLayer.innerHTML = renderPlayer(state.player);
      elements.effectLayer.innerHTML = state.effects.map(renderEffect).join("");

      elements.healthFill.style.width = (hpRatio * 100).toFixed(1) + "%";
      elements.healthLabel.textContent = Math.ceil(state.player.hp) + " / " + state.player.maxHp;
      elements.xpFill.style.width = (xpRatio * 100).toFixed(1) + "%";
      elements.xpLabel.textContent = state.xp + " / " + state.xpToNext;
      elements.levelLabel.textContent = "Lv." + state.level;
      elements.timerLabel.textContent = NS.Game.formatTime(state.timer);
      elements.phaseLabel.textContent = NS.Game.getPhaseLabel(state);
      elements.statusLabel.textContent = NS.Game.getStatusLabel(state);
      elements.enemyCount.textContent = String(state.enemies.length);
      elements.upgradeSummary.innerHTML = summary.length
        ? summary.map((entry) => "<li>" + entry.shortName + " Lv." + entry.rank + "</li>").join("")
        : "<li>暂未变异</li>";
      elements.buildReadout.innerHTML = createBuildMarkup(state);

      if (boss) {
        const bossRatio = clamp(boss.hp / boss.maxHp, 0, 1);
        elements.bossBar.classList.remove("is-hidden");
        elements.bossFill.style.width = (bossRatio * 100).toFixed(1) + "%";
        elements.bossLabel.textContent = Math.ceil(boss.hp) + " / " + boss.maxHp;
      } else {
        elements.bossBar.classList.add("is-hidden");
        elements.bossFill.style.width = "0%";
        elements.bossLabel.textContent = "0 / 0";
      }

      if (overlayMarkup) {
        elements.overlay.classList.remove("is-hidden");
        elements.overlayCard.innerHTML = overlayMarkup;
      } else {
        elements.overlay.classList.add("is-hidden");
        elements.overlayCard.innerHTML = "";
      }
    }

    return {
      render,
      renderStatic,
    };
  }

  NS.Renderer = {
    createRenderer,
  };
})(window);
