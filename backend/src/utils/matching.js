const PROFICIENCY_WEIGHT = {
  BASIC: 0.5,
  INTERMEDIATE: 0.75,
  ADVANCED: 1.0,
};

const EXPERIENCE_LEVEL_RANK = {
  INTERN: 1,
  JUNIOR: 2,
  MIDDLE: 3,
  SENIOR: 4,
};

function inferCandidateLevel(headline = '') {
  const text = headline.toLowerCase();
  if (text.includes('lead') || text.includes('senior') || text.includes('главн')) return 4;
  if (text.includes('middle') || text.includes('специалист')) return 3;
  if (text.includes('junior') || text.includes('младш')) return 2;
  if (text.includes('intern') || text.includes('стаж')) return 1;
  return 3;
}

function getTextRelevanceBonus(job, profile) {
  const jobText = `${job.title} ${job.description} ${job.responsibilities || ''}`.toLowerCase();
  const profileText = `${profile.headline || ''} ${profile.summary || ''}`.toLowerCase();

  const tokens = jobText
    .split(/[^a-zа-яё0-9]+/i)
    .filter((token) => token.length > 3);

  const uniqueTokens = [...new Set(tokens)];
  if (!uniqueTokens.length) return 0;

  const hits = uniqueTokens.filter((token) => profileText.includes(token)).length;
  return Math.min(Math.round((hits / uniqueTokens.length) * 15), 15);
}

export function calculateCandidateMatch(job, profile) {
  const requiredSkills = job.requiredSkills?.map((item) => item.skill) || [];

  if (!requiredSkills.length) {
    return {
      matchScore: 0,
      matchedSkills: [],
    };
  }

  const candidateSkillsByName = new Map(
    (profile.skills || []).map((item) => [item.skill.name.toLowerCase(), item]),
  );

  let skillPoints = 0;
  const matchedSkills = [];

  for (const requiredSkill of requiredSkills) {
    const candidateSkill = candidateSkillsByName.get(requiredSkill.name.toLowerCase());
    if (!candidateSkill) continue;

    const proficiencyWeight = PROFICIENCY_WEIGHT[candidateSkill.proficiencyLevel] || 0.5;
    const yearsBonus = Math.min((candidateSkill.yearsOfExperience || 0) / 5, 0.2);
    skillPoints += proficiencyWeight + yearsBonus;
    matchedSkills.push(requiredSkill.name);
  }

  const skillsScore = (skillPoints / requiredSkills.length) * 70;

  const jobLevel = EXPERIENCE_LEVEL_RANK[job.experienceLevel] || 3;
  const candidateLevel = inferCandidateLevel(profile.headline || '');
  let experienceScore = 0;
  if (candidateLevel >= jobLevel) experienceScore = 10;
  else if (candidateLevel === jobLevel - 1) experienceScore = 5;

  const availabilityScore = profile.isOpenToWork ? 5 : 0;
  const textScore = getTextRelevanceBonus(job, profile);

  const matchScore = Math.min(
    Math.round(skillsScore + experienceScore + availabilityScore + textScore),
    100,
  );

  return {
    matchScore,
    matchedSkills,
  };
}

export function rankCandidatesForJob(job, candidates, limit = 3) {
  return candidates
    .map((profile) => {
      const { matchScore, matchedSkills } = calculateCandidateMatch(job, profile);
      return {
        candidateProfileId: profile.id,
        userId: profile.userId,
        firstName: profile.firstName,
        lastName: profile.lastName,
        headline: profile.headline,
        isOpenToWork: profile.isOpenToWork,
        skills: (profile.skills || []).map((item) => ({
          name: item.skill.name,
          proficiencyLevel: item.proficiencyLevel,
          yearsOfExperience: item.yearsOfExperience,
        })),
        matchScore,
        matchedSkills,
      };
    })
    .filter((item) => item.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}
