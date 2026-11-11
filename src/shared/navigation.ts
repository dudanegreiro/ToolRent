import { type Href } from 'expo-router';

type RouterLike = {
    canGoBack: () => boolean;
    back: () => void;
    replace: (href: Href) => void;
};

type HomeParams = Record<string, string | string[] | undefined>;

export function goBackOrHome(router: RouterLike, params?: HomeParams) {
    if (router.canGoBack()) {
        router.back();
        return;
    }

    router.replace({
        pathname: '/home',
        params,
    } as Href);
}
