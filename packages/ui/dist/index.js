import { jsx as _jsx } from "react/jsx-runtime";
export const uiPackageName = "@within/ui";
export function NavList({ items }) {
    return (_jsx("nav", { children: _jsx("ul", { children: items.map((item) => (_jsx("li", { children: item.label }, item.label))) }) }));
}
