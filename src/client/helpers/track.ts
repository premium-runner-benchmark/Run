declare var window: any;

export function trackEvent(
    category: string,
    action: string,
    name?: string,
    value?: number
): void {
    window._paq.push(['trackEvent', category, action, name, value]);
}
