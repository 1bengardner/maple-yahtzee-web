const scoreCriteria = [{
  "id": 9,
  "criteria": {
    "p": 500,
  },
  "details": {
    "icon": "💥",
    "title": "Big Bang",
    "description": "Achieve a score of 500.",
    "glass": "explosion",
    "sound": "bigbang.mp3",
  },
}, {
  "id": 8,
  "criteria": {
    "p": 450,
  },
  "details": {
    "icon": "📣",
    "title": "Smega",
    "description": "Achieve a score of 450.",
    "glass": "smega",
    "sound": "special.mp3",
  },
}, {
  "id": 7,
  "criteria": {
    "p": 400,
  },
  "details": {
    "icon": "📢",
    "title": "Mega",
    "description": "Achieve a score of 400.",
    "glass": "mega",
    "sound": "echo.mp3",
  },
}, {
  "id": 6,
  "criteria": {
    "p": 350,
  },
  "details": {
    "icon": "🌱",
    "title": "New Leaf",
    "description": "Achieve a score of 350.",
    "glass": "leaf",
    "sound": "job.mp3",
  },
}, {
  "id": 5,
  "criteria": {
    "p": 300,
  },
  "details": {
    "icon": "🐼",
    "title": "Kung xShruu Panda",
    "description": "Achieve a score of 300.",
    "glass": "panda",
    "sound": "panda.mp3",
  },
}, {
  "id": 4,
  "criteria": {
    "p": 250,
  },
  "details": {
    "icon": "🫚",
    "title": "Getting to the root of it",
    "description": "Achieve a score of 250.",
    "glass": "root",
    "sound": "root.mp3",
  },
}, {
  "id": 3,
  "criteria": {
    "p": 200,
  },
  "details": {
    "icon": "🐖",
    "title": "Not a pork eata'",
    "description": "Achieve a score of 200.",
    "glass": "pig",
    "sound": "pig.mp3",
  },
}, {
  "id": 2,
  "criteria": {
    "p": 150,
  },
  "details": {
    "icon": "🍄",
    "title": "The morel of the story",
    "description": "Achieve a score of 150.",
    "glass": "shroom",
    "sound": "shroom.mp3",
  },
}, {
  "id": 1,
  "criteria": {
    "p": 100,
  },
  "details": {
    "icon": "🐌",
    "title": "Slow and steady",
    "description": "Achieve a score of 100.",
    "glass": "snail",
    "sound": "snail.mp3",
  },
},];

const yahtzeeCriteria = [{
  "id": 104,
  "criteria": {
    "y": 4,
  },
  "details": {
    "icon": "🍀",
    "title": "Four-Leaf",
    "description": "Get four yahtzees in one game.",
  },
}, {
  "id": 103,
  "criteria": {
    "y": 3,
  },
  "details": {
    "icon": "🐄",
    "title": "Triple Nipple!",
    "description": "Get a triple yahtzee.",
  },
}, {
  "id": 102,
  "criteria": {
    "y": 2,
  },
  "details": {
    "icon": "🐫",
    "title": "Double Trouble!",
    "description": "Get a double yahtzee.",
  },
}, {
  "id": 101,
  "criteria": {
    "y": 1,
  },
  "details": {
    "icon": "🎲",
    "title": "Yahtzee!",
    "description": "Get a yahtzee.",
  },
},];

const gameCriteria = [{
  "id": 1005,
  "criteria": {
    "g": 1000,
  },
  "details": {
    "icon": "🍁",
    "title": "True Mapler",
    "description": "Play 1000 games.",
  },
}, {
  "id": 1004,
  "criteria": {
    "g": 100,
  },
  "details": {
    "icon": "💊",
    "title": "Addict",
    "description": "Play 100 games.",
  },
}, {
  "id": 1003,
  "criteria": {
    "g": 50,
  },
  "details": {
    "icon": "🥜",
    "title": "Goober",
    "description": "Play 50 games.",
  },
}, {
  "id": 1002,
  "criteria": {
    "g": 20,
  },
  "details": {
    "icon": "🌳",
    "title": "Grower",
    "description": "Play 20 games.",
  },
}, {
  "id": 1001,
  "criteria": {
    "g": 10,
  },
  "details": {
    "icon": "🕹",
    "title": "Gamer",
    "description": "Play 10 games.",
  },
},];

const yaouw = [{
  "id": 10001,
  "criteria": {
    "y": 0,
    "p": 250,
  },
  "details": {
    "icon": "🐋",
    "title": "Yaouw!",
    "description": "Achieve a score of 250 with no yahtzee.",
    "glass": "yaouw",
  },
},];

const subbingOut = [{
  "id": 10002,
  "criteria": {
    "s": false,
    "p": 250,
  },
  "details": {
    "icon": "🚢",
    "title": "Subbing Out",
    "description": "Achieve a score of 250 with no subtotal bonus.",
    "glass": "submarine",
  },
},];

export function generateData(history) {
  function getBestTrophy(category, historyItem) {
    for (const trophy of category) {
      if (Object.entries(trophy.criteria).every(([criterion, value]) => criterion != "g" && value ? historyItem[criterion] >= value : historyItem[criterion] == value)) {
        return trophy;
      }
    }
  }
  
  const categories = [
    scoreCriteria,
    yahtzeeCriteria,
    gameCriteria,
    yaouw,
    subbingOut,
  ]
  
  const trophyIds = []; // For order
  const trophyDetails = {};
  let gameCount = 0;
  
  // Oldest first
  history.sort((a, b) => a.t - b.t);
  for (const historyItem of history) {
    gameCount += 1;
    historyItem.g = gameCount;
    for (const category of categories) {
      const trophy = getBestTrophy(category, historyItem);
      if (!trophy) {
        continue;
      }
      if (trophy.id in trophyDetails) {
        trophyDetails[trophy.id].count += 1;
      } else {
        trophyIds.push(trophy.id);
        trophyDetails[trophy.id] = {
          ...trophy.details,
          count: 1,
          timestamp: historyItem.t,
        }
      }
    }
  }
  
  return trophyIds.map(id => trophyDetails[id]);
}

export function getTopScore(history) {
  return Math.max(...history.map(x => x.p));
}
