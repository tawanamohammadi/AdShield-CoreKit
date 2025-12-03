const keywordPattern = /(ad[s]?|sponsor|promo|banner|tracker|marketing|doubleclick)/i;
const commonSizes = [
  '300x250',
  '320x50',
  '728x90',
  '160x600',
  '300x600',
  '970x250',
];

const guessSelector = (el: Element) => {
  if (el.id) return `#${el.id}`;
  const classes = el.className ? `${el.tagName.toLowerCase()}.${(el.className as string).split(' ').join('.')}` : el.tagName.toLowerCase();
  return classes;
};

export const scanDom = (doc: Document): { adElements: number; details: Array<{ selector: string; reason: string }> } => {
  const details: Array<{ selector: string; reason: string }> = [];

  const candidates = doc.querySelectorAll('iframe, ins, aside, div, section');
  candidates.forEach((node) => {
    const el = node as HTMLElement;
    const reason: string[] = [];
    const classId = `${el.className ?? ''} ${el.id ?? ''}`;

    if (keywordPattern.test(classId)) {
      reason.push('Ad keyword in class/id');
    }

    const size = `${el.clientWidth}x${el.clientHeight}`;
    if (commonSizes.includes(size)) {
      reason.push('Common ad slot size');
    }

    if (el.tagName.toLowerCase() === 'iframe') {
      reason.push('Iframe element');
    }

    if (reason.length > 0) {
      details.push({ selector: guessSelector(el), reason: reason.join(' · ') });
    }
  });

  return { adElements: details.length, details };
};
