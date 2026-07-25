export function analyzeSeo(report) {
  let score = 100;
  const metrics = [];
  const recommendations = [];

  // 1. HTTP Status
  if (report.status === 200) {
    metrics.push({ value: 10, label: 'Clean HTTP 200 Status' });
  } else {
    score -= 20;
    metrics.push({ value: -20, label: `Status ${report.status}` });
    recommendations.push(`Resolve the ${report.status} HTTP status code.`);
  }

  // 2. Response Time
  if (report.responseTime < 300) {
    metrics.push({ value: 15, label: 'Fast Response (< 300ms)' });
  } else if (report.responseTime < 800) {
    score -= 5;
    metrics.push({ value: -5, label: 'Average Response Time' });
    recommendations.push(`Improve server response time (currently ${report.responseTime}ms). Aim for under 300ms.`);
  } else {
    score -= 15;
    metrics.push({ value: -15, label: 'Slow Response Time' });
    recommendations.push(`Severely slow response time (${report.responseTime}ms). Optimize server speed.`);
  }

  // 3. Title Tag
  if (report.title && report.title.length > 10) {
    metrics.push({ value: 15, label: 'Valid Title Tag' });
  } else {
    score -= 15;
    metrics.push({ value: -15, label: 'Missing/Short Title' });
    recommendations.push('Add a descriptive <title> tag of at least 10 characters.');
  }

  // 4. Meta Description
  if (report.metaDescription && report.metaDescription.length > 50) {
    metrics.push({ value: 15, label: 'Valid Meta Description' });
  } else {
    score -= 15;
    metrics.push({ value: -15, label: 'Missing/Short Meta Desc' });
    recommendations.push('Add a comprehensive <meta name="description"> tag.');
  }

  // 5. H1 Tag
  if (report.h1Count === 1) {
    metrics.push({ value: 15, label: 'Single H1 Tag' });
  } else if (report.h1Count === 0) {
    score -= 15;
    metrics.push({ value: -15, label: 'Missing H1 Tag' });
    recommendations.push('Add exactly one <h1> tag to describe the page content.');
  } else {
    score -= 5;
    metrics.push({ value: -5, label: 'Multiple H1 Tags' });
    recommendations.push(`Your page contains ${report.h1Count} H1 tags; ideally use exactly one primary H1.`);
  }

  // 6. Image Alt Tags
  if (report.imagesMissingAlt === 0 && report.totalImages > 0) {
    metrics.push({ value: 20, label: 'All Images have Alt text' });
  } else if (report.imagesMissingAlt > 0) {
    const penalty = Math.min(20, report.imagesMissingAlt * 2);
    score -= penalty;
    metrics.push({ value: -penalty, label: `Missing ${report.imagesMissingAlt} Alt tags` });
    recommendations.push(`Add 'alt' attributes to ${report.imagesMissingAlt} image(s) for accessibility and SEO.`);
  } else {
    metrics.push({ value: 0, label: 'No images found' });
  }

  // 7. Word Count
  if (report.wordCount > 300) {
    metrics.push({ value: 10, label: 'Good Content Length' });
  } else {
    score -= 10;
    metrics.push({ value: -10, label: 'Thin Content' });
    recommendations.push(`Consider adding more content. Current word count is ~${report.wordCount} (aim for >300).`);
  }

  // Ensure score stays within 0-100
  score = Math.max(0, Math.min(100, score));

  if (recommendations.length === 0) {
    recommendations.push("Excellent work! Your page structure is perfectly optimized for SEO.");
  }

  return {
    score,
    metrics, // Breakdown to show in the score panel
    recommendations // Bullets to show in the recommendations panel
  };
}
