/*
 Copyright (c) 2026 Ashraf Morningstar
 These are personal recreations of existing projects, developed by Ashraf Morningstar
 for learning and skill development.
 Original project concepts remain the intellectual property of their respective creators.
 Repository: https://github.com/AshrafMorningstar
*/

import { Badge } from "../types";

export const INITIAL_BADGES: Badge[] = [
  {
    id: "pull-shark",
    name: "Pull Shark",
    emoji: "🦈",
    description: "Opened pull requests that have been merged.",
    category: "Earnable",
    rarity: "Common",
    howToEarn: "Open Pull Requests that get merged into the default branch of a repository.",
    owned: true,
    strategy: "Focus on fixing typos in documentation or small bugs in open source projects to get your first PRs merged quickly.",
    tiers: [
      { name: "Bronze", criteria: "2 Merged PRs" },
      { name: "Silver", criteria: "16 Merged PRs" },
      { name: "Gold", criteria: "128 Merged PRs" },
    ]
  },
  {
    id: "yolo",
    name: "YOLO",
    emoji: "🚀",
    description: "Merged a pull request without code review.",
    category: "Earnable",
    rarity: "Rare",
    howToEarn: "Merge your own Pull Request without waiting for a review (requires admin rights or a repo with no protection rules).",
    owned: false,
    strategy: "Create a new personal repository, make a change in a branch, open a PR, and merge it immediately.",
    tiers: [
      { name: "Base", criteria: "Merge 1 PR without review" }
    ]
  },
  {
    id: "quickdraw",
    name: "Quickdraw",
    emoji: "🤠",
    description: "Closed an issue or pull request within 5 minutes of opening.",
    category: "Earnable",
    rarity: "Rare",
    howToEarn: "Close an issue or merge a PR less than 5 minutes after creating it.",
    owned: false,
    strategy: "If you find a bug you can fix instantly, open the issue and the PR, then close them immediately.",
    tiers: [
      { name: "Base", criteria: "Close within 5 mins" }
    ]
  },
  {
    id: "starstruck",
    name: "Starstruck",
    emoji: "🤩",
    description: "Created a repository that has many stars.",
    category: "Earnable",
    rarity: "Epic",
    howToEarn: "Your repositories need to accumulate stars from the community.",
    owned: true,
    strategy: "Build something useful for developers or curate a comprehensive 'Awesome' list.",
    tiers: [
      { name: "Bronze", criteria: "16 Stars" },
      { name: "Silver", criteria: "128 Stars" },
      { name: "Gold", criteria: "512 Stars" },
    ]
  },
  {
    id: "galaxy-brain",
    name: "Galaxy Brain",
    emoji: "🧠",
    description: "Accepted answer on a discussion.",
    category: "Earnable",
    rarity: "Common",
    howToEarn: "Provide an answer in a GitHub Discussion that is marked as the answer by the author.",
    owned: false,
    tiers: [
      { name: "Bronze", criteria: "2 Accepted Answers" },
      { name: "Silver", criteria: "8 Accepted Answers" },
      { name: "Gold", criteria: "16 Accepted Answers" },
    ]
  },
  {
    id: "pair-extraordinaire",
    name: "Pair Extraordinaire",
    emoji: "👯",
    description: "Co-authored commits in a merged pull request.",
    category: "Earnable",
    rarity: "Common",
    howToEarn: "Use the 'Co-authored-by' trailer in a commit message that gets merged.",
    owned: true,
    tiers: [
      { name: "Bronze", criteria: "10 Co-authored commits" },
      { name: "Silver", criteria: "24 Co-authored commits" },
      { name: "Gold", criteria: "48 Co-authored commits" },
    ]
  },
  {
    id: "public-sponsor",
    name: "Public Sponsor",
    emoji: "💖",
    description: "Sponsoring open source work via GitHub Sponsors.",
    category: "Earnable",
    rarity: "Common",
    howToEarn: "Sponsor a developer or organization through GitHub Sponsors.",
    owned: true,
    tiers: [
      { name: "Base", criteria: "Sponsor 1 person/project" }
    ]
  },
  {
    id: "arctic-code-vault",
    name: "Arctic Code Vault",
    emoji: "❄️",
    description: "Contributed code to a repository archived in the Arctic Code Vault.",
    category: "Historical",
    rarity: "Legendary",
    howToEarn: "This badge is no longer earnable. It was awarded to users who contributed to repos captured in the 02/02/2020 snapshot.",
    owned: false,
    tiers: [
      { name: "Base", criteria: "Snapshot 2020" }
    ]
  },
  {
    id: "mars-2020",
    name: "Mars 2020",
    emoji: "🚁",
    description: "Contributed to a repository used in the Mars 2020 Helicopter mission.",
    category: "Historical",
    rarity: "Legendary",
    howToEarn: "Contributed to specific open source projects used by NASA/JPL for the Ingenuity Helicopter.",
    owned: false,
    tiers: [
      { name: "Base", criteria: "Mission Contribution" }
    ]
  }
];
