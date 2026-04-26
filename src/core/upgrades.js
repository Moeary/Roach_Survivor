(function (global) {
  const NS = global.RoachSurvivor = global.RoachSurvivor || {};

  const UPGRADE_DEFS = [
    {
      id: "damage",
      name: "硬壳弹性卵",
      shortName: "伤害",
      description: "卵鞘伤害提升 22%，一发更疼。",
      apply(state) {
        state.player.stats.projectileDamage *= 1.22;
      },
    },
    {
      id: "attackSpeed",
      name: "密集孵化",
      shortName: "攻速",
      description: "发射间隔缩短 15%，更快喷射。",
      apply(state) {
        state.player.stats.attackCooldown = Math.max(0.24, state.player.stats.attackCooldown * 0.85);
      },
    },
    {
      id: "volley",
      name: "双囊齐发",
      shortName: "弹体数量",
      description: "每次额外发射 1 枚卵鞘，扇形扩散。",
      apply(state) {
        state.player.stats.projectileCount += 1;
      },
    },
    {
      id: "pierce",
      name: "裂壳钻刺",
      shortName: "穿透",
      description: "卵鞘额外穿透 1 个敌人。",
      apply(state) {
        state.player.stats.projectilePierce += 1;
      },
    },
    {
      id: "moveSpeed",
      name: "惊吓疾跑",
      shortName: "移速",
      description: "移动速度提升 12%，走位更稳。",
      apply(state) {
        state.player.stats.moveSpeed *= 1.12;
      },
    },
    {
      id: "pickupRadius",
      name: "胡须感应",
      shortName: "拾取范围",
      description: "经验吸附半径扩大 24%。",
      apply(state) {
        state.player.stats.pickupRadius *= 1.24;
      },
    },
  ];

  const UPGRADE_MAP = {};

  UPGRADE_DEFS.forEach((upgrade) => {
    UPGRADE_MAP[upgrade.id] = upgrade;
  });

  function shuffle(array) {
    for (let index = array.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      const temp = array[index];
      array[index] = array[swapIndex];
      array[swapIndex] = temp;
    }
    return array;
  }

  function pickUpgradeChoices(state, count) {
    const available = shuffle(UPGRADE_DEFS.slice());
    const desiredCount = Math.min(count || 3, available.length);
    return available.slice(0, desiredCount).map((upgrade) => ({
      id: upgrade.id,
      name: upgrade.name,
      shortName: upgrade.shortName,
      description: upgrade.description,
      currentRank: state.upgradeLevels[upgrade.id] || 0,
      nextRank: (state.upgradeLevels[upgrade.id] || 0) + 1,
    }));
  }

  function applyUpgrade(state, upgradeId) {
    const upgrade = UPGRADE_MAP[upgradeId];

    if (!upgrade) {
      return false;
    }

    upgrade.apply(state);
    state.upgradeLevels[upgradeId] = (state.upgradeLevels[upgradeId] || 0) + 1;
    state.upgradesTaken.push(upgradeId);
    state.lastUpgradeName = upgrade.name;
    return true;
  }

  function summarizeUpgrades(state) {
    return UPGRADE_DEFS.map((upgrade) => ({
      id: upgrade.id,
      name: upgrade.name,
      shortName: upgrade.shortName,
      rank: state.upgradeLevels[upgrade.id] || 0,
    })).filter((entry) => entry.rank > 0);
  }

  NS.Upgrades = {
    applyUpgrade,
    pickUpgradeChoices,
    summarizeUpgrades,
  };
})(window);
