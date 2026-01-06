import { CartCustomisation, CartStore } from "@/type";
import { create } from "zustand";

function areCustomisationsEqual(
    a: CartCustomisation[] = [],
    b: CartCustomisation[] = []
): boolean {
    if (a.length !== b.length) return false;

    const aSorted = [...a].sort((x, y) => x.id.localeCompare(y.id));
    const bSorted = [...b].sort((x, y) => x.id.localeCompare(y.id));

    return aSorted.every((item, idx) => item.id === bSorted[idx].id);
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],

    addItem: (item) => {
        const customisations = item.customisations ?? [];

        const existing = get().items.find(
            (i) =>
                i.id === item.id &&
                areCustomisationsEqual(i.customisations ?? [], customisations)
        );

        if (existing) {
            set({
                items: get().items.map((i) =>
                    i.id === item.id &&
                    areCustomisationsEqual(i.customisations ?? [], customisations)
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                ),
            });
        } else {
            set({
                items: [...get().items, { ...item, quantity: 1, customisations }],
            });
        }
    },

    removeItem: (id, customisations = []) => {
        set({
            items: get().items.filter(
                (i) =>
                    !(
                        i.id === id &&
                        areCustomisationsEqual(i.customisations ?? [], customisations)
                    )
            ),
        });
    },

    increaseQty: (id, customisations = []) => {
        set({
            items: get().items.map((i) =>
                i.id === id &&
                areCustomisationsEqual(i.customisations ?? [], customisations)
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
            ),
        });
    },

    decreaseQty: (id, customisations = []) => {
        set({
            items: get()
                .items.map((i) =>
                    i.id === id &&
                    areCustomisationsEqual(i.customizations ?? [], customisations)
                        ? { ...i, quantity: i.quantity - 1 }
                        : i
                )
                .filter((i) => i.quantity > 0),
        });
    },

    clearCart: () => set({ items: [] }),

    getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

    getTotalPrice: () =>
        get().items.reduce((total, item) => {
            const base = item.price;
            const customPrice =
                item.customizations?.reduce(
                    (s: number, c: CartCustomisation) => s + c.price,
                    0
                ) ?? 0;
            return total + item.quantity * (base + customPrice);
        }, 0),
}));