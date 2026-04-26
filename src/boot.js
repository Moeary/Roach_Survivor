(function (global) {
  const NS = global.RoachSurvivor = global.RoachSurvivor || {};

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  }

  onReady(function () {
    const elements = {
      world: document.getElementById("world"),
      mapLayer: document.getElementById("map-layer"),
      pickupLayer: document.getElementById("pickup-layer"),
      enemyLayer: document.getElementById("enemy-layer"),
      projectileLayer: document.getElementById("projectile-layer"),
      playerLayer: document.getElementById("player-layer"),
      effectLayer: document.getElementById("effect-layer"),
      healthFill: document.getElementById("health-fill"),
      healthLabel: document.getElementById("health-label"),
      xpFill: document.getElementById("xp-fill"),
      xpLabel: document.getElementById("xp-label"),
      timerLabel: document.getElementById("hud-timer"),
      phaseLabel: document.getElementById("hud-phase"),
      statusLabel: document.getElementById("hud-status"),
      enemyCount: document.getElementById("enemy-count"),
      levelLabel: document.getElementById("hud-level"),
      upgradeSummary: document.getElementById("upgrade-summary"),
      buildReadout: document.getElementById("build-readout"),
      overlay: document.getElementById("overlay"),
      overlayCard: document.getElementById("overlay-card"),
      bossBar: document.getElementById("boss-bar"),
      bossFill: document.getElementById("boss-fill"),
      bossLabel: document.getElementById("boss-label"),
    };

    const input = NS.Game.createInputState();
    const renderer = NS.Renderer.createRenderer(elements);
    let state = NS.Game.createGameState();
    let lastFrame = performance.now();

    function renderAll() {
      renderer.render(state);
    }

    function restart() {
      state = NS.Game.createGameState();
      NS.Game.resetInputState(input);
      renderer.renderStatic(state);
      renderAll();
      lastFrame = performance.now();
    }

    function handleDirectionalKey(code, pressed) {
      if (code === "KeyW" || code === "ArrowUp") {
        input.up = pressed;
      } else if (code === "KeyS" || code === "ArrowDown") {
        input.down = pressed;
      } else if (code === "KeyA" || code === "ArrowLeft") {
        input.left = pressed;
      } else if (code === "KeyD" || code === "ArrowRight") {
        input.right = pressed;
      }
    }

    function maybeChooseUpgradeByIndex(index) {
      const choice = state.upgradeChoices[index];

      if (!choice) {
        return false;
      }

      const didChoose = NS.Game.chooseUpgrade(state, choice.id);

      if (didChoose) {
        renderAll();
      }

      return didChoose;
    }

    window.addEventListener("keydown", function (event) {
      if (event.code === "KeyP" && !event.repeat) {
        if (NS.Game.togglePause(state)) {
          renderAll();
        }
        return;
      }

      if (state.runState === "levelup" && !event.repeat) {
        if (event.code === "Digit1") {
          maybeChooseUpgradeByIndex(0);
          return;
        }

        if (event.code === "Digit2") {
          maybeChooseUpgradeByIndex(1);
          return;
        }

        if (event.code === "Digit3") {
          maybeChooseUpgradeByIndex(2);
          return;
        }
      }

      if ((state.runState === "won" || state.runState === "lost") && !event.repeat && event.code === "Enter") {
        restart();
        return;
      }

      handleDirectionalKey(event.code, true);
    });

    window.addEventListener("keyup", function (event) {
      handleDirectionalKey(event.code, false);
    });

    window.addEventListener("blur", function () {
      NS.Game.resetInputState(input);
    });

    elements.overlayCard.addEventListener("click", function (event) {
      const button = event.target.closest("button[data-action]");

      if (!button) {
        return;
      }

      const action = button.getAttribute("data-action");

      if (action === "upgrade") {
        const upgradeId = button.getAttribute("data-upgrade-id");

        if (upgradeId) {
          NS.Game.chooseUpgrade(state, upgradeId);
          renderAll();
        }
        return;
      }

      if (action === "resume") {
        NS.Game.togglePause(state);
        renderAll();
        return;
      }

      if (action === "restart") {
        restart();
      }
    });

    function frame(now) {
      const deltaSeconds = (now - lastFrame) / 1000;
      lastFrame = now;
      NS.Game.updateGame(state, input, deltaSeconds);
      renderAll();
      window.requestAnimationFrame(frame);
    }

    renderer.renderStatic(state);
    renderAll();
    window.requestAnimationFrame(frame);
  });
})(window);
