// Renders one verified signal aspect. The SVG comes from the byte-for-byte drawSignal (our own
// trusted code — no user input), so dangerouslySetInnerHTML is safe and keeps the renderer verbatim.
import { drawSignal } from '../core/signal';
import type { SignalAspect } from '../core/types';

export function Signal({ aspect }: { aspect: SignalAspect }) {
  return <span className="signal" role="img" dangerouslySetInnerHTML={{ __html: drawSignal(aspect) }} />;
}
