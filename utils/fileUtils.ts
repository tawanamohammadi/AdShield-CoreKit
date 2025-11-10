import { BenchmarkResult } from '../types.ts';

export const downloadJson = (data: BenchmarkResult, filename: string) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const copyMarkdownToClipboard = (data: BenchmarkResult) => {
  const summary = `
## AdShield Benchmark Results

- **Score**: ${data.score}/100
- **Blocked**: ${data.blocked}
- **Loaded**: ${data.loaded}
- **Total**: ${data.total}
- **Timestamp**: ${data.timestamp}
  `;
  if(navigator.clipboard) {
    navigator.clipboard.writeText(summary.trim());
  }
};