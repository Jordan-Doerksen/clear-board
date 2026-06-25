// S1/S2/S3 severity — drives feedback tone and remediation weight (safety-critical misses come back
// first). This is a REVIEWABLE v1 classification, NOT a legal safety ranking: transparent DOMAIN
// defaults + a short, reasoned override list. Jordan/SME: adjust DOMAIN_SEV and SEV_OVERRIDE freely.
//   S1 = knowledge / inefficiency · S2 = rule violation · S3 = safety-critical (someone gets hurt).
import type { ContentItem } from './types';

export type Severity = 'S1' | 'S2' | 'S3';

// The hands-on operational domains — where a mistake on the ground hurts someone — default to S3;
// comms and general procedure to S2; vocabulary to S1.
const DOMAIN_SEV: Record<string, Severity> = {
  securement: 'S3', switching: 'S3', signals: 'S3', authority: 'S3',
  radio: 'S2', operating: 'S2', definitions: 'S1',
};

// Exceptions to the domain default — kept short and reasoned (id → severity).
const SEV_OVERRIDE: Record<string, Severity> = {
  'rule.104.1': 'S2', 'rule.104.4': 'S2',                                  // switching: sign/equipment identification, not an immediate-danger miss
  'rule.403': 'S2', 'rule.405': 'S2', 'rule.430': 'S2', 'rule.416': 'S2',  // signals: "proceed"/plate mechanics (the STOP/Restricting family stays S3)
  'rule.301': 'S2', 'rule.306': 'S2',                                      // authority: RTC / track-numbering procedure, not "don't pass a stop / don't foul"
  'rule.123': 'S3', 'rule.123.2': 'S3',                                    // radio: verification + doubt=STOP are safety, not just comms
  'rule.12': 'S3',                                                         // operating: hand signals — misread = wrong movement
};

export function severityOf(item: ContentItem): Severity {
  return SEV_OVERRIDE[item.id] || DOMAIN_SEV[item.domain] || 'S2';
}

export const SEV_RANK: Record<Severity, number> = { S3: 0, S2: 1, S1: 2 };
