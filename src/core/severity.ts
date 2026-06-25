// Coarse remediation PRIORITY — deliberately NOT a per-rule safety classification (which rules are
// "safety-critical" is an SME call; see the open questions in REVAMP-DESIGN / DECISIONS). "core" = the
// hands-on domains where getting it wrong on the ground hurts someone. Used only to (a) put core items
// first in the end-of-session "practice your misses" round and (b) add a calm "worth nailing" cue on a
// core miss. Carries no safety claim about any single rule, and is easy to retune.
import type { ContentItem } from './types';

const CORE_DOMAINS = new Set(['switching', 'securement', 'signals']);
export type Priority = 'core' | 'standard';

export function priorityOf(item: ContentItem): Priority {
  return CORE_DOMAINS.has(item.domain) ? 'core' : 'standard';
}
