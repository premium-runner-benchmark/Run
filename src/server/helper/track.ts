import qs from 'query-string';
import superagent from 'superagent';

export function trackEvent(
    category: string,
    action: string,
    name?: string,
    value?: number
): void {
    const query = qs.stringify({
        action_name: action,
        e_a: action,
        e_c: category,
        e_n: name,
        e_v: value,
        idsite: '2',
        rec: 1
    });
    superagent.get(`https://lumi.matomo.cloud/matomo.php?${query}`);
}
