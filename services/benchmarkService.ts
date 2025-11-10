
import { TEST_ENDPOINTS } from '../constants';
import { BenchmarkResult, ResultBreakdown, TestEndpoint, TestResultStatus } from '../types';

const TEST_TIMEOUT = 2500; // 2.5 seconds timeout for each request

/**
 * Tests a single endpoint to see if it's blocked.
 * A request is considered 'blocked' if it fails to complete due to a network error,
 * DNS resolution failure, or timeout.
 * @param endpoint The endpoint to test.
 * @returns A promise that resolves to a ResultBreakdown.
 */
async function testEndpoint(endpoint: TestEndpoint): Promise<ResultBreakdown> {
    const domain = new URL(endpoint.url).hostname;
    let status: TestResultStatus = 'pending';

    try {
        // We use an AbortController for a reliable timeout.
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TEST_TIMEOUT);

        await fetch(endpoint.url, {
            method: 'GET',
            mode: 'no-cors', // Important: Prevents actual content download and bypasses some CORS issues.
            cache: 'no-store', // Ensures a fresh request every time.
            signal: controller.signal,
        });

        // If fetch succeeds, it means the request was not blocked at the DNS level.
        // Even with `no-cors`, a successful opaque response means the domain is accessible.
        status = 'loaded';
        clearTimeout(timeoutId);

    } catch (error) {
        // Any error (network, abort/timeout, DNS resolution failure) is treated as 'blocked'.
        status = 'blocked';
    }

    return {
        domain,
        category: endpoint.category,
        status,
    };
}

/**
 * Runs the full benchmark across all defined endpoints.
 * @param onProgress A callback function to report progress after each test.
 * @returns A promise that resolves to the final BenchmarkResult.
 */
export async function runBenchmark(
    onProgress: (result: ResultBreakdown) => void
): Promise<BenchmarkResult> {
    const breakdown: ResultBreakdown[] = [];
    let weightedBlocked = 0;
    let totalWeight = 0;

    for (const endpoint of TEST_ENDPOINTS) {
        const result = await testEndpoint(endpoint);
        breakdown.push(result);
        onProgress(result);

        totalWeight += endpoint.weight;
        if (result.status === 'blocked') {
            weightedBlocked += endpoint.weight;
        }
    }

    const blockedCount = breakdown.filter(r => r.status === 'blocked').length;
    const loadedCount = breakdown.length - blockedCount;
    const score = totalWeight > 0 ? Math.round((weightedBlocked / totalWeight) * 100) : 0;

    return {
        score,
        blocked: blockedCount,
        loaded: loadedCount,
        total: breakdown.length,
        timestamp: new Date().toISOString(),
        breakdown,
    };
}
